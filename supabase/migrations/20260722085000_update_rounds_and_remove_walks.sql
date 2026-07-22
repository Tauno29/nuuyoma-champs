-- Migration to remove walks and support 7 rounds with Top 5 / Top 3 elimination

-- 1. Competition State updates
ALTER TABLE public.competition_state ADD COLUMN IF NOT EXISTS round_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE public.competition_state ADD COLUMN IF NOT EXISTS top3_published BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE public.competition_state DROP COLUMN IF EXISTS round1_current_walk;
ALTER TABLE public.competition_state DROP COLUMN IF EXISTS round2_current_walk;
ALTER TABLE public.competition_state DROP COLUMN IF EXISTS round1_status;
ALTER TABLE public.competition_state DROP COLUMN IF EXISTS round2_status;

-- Reset default competition state row
UPDATE public.competition_state SET current_round = 0, round_status = 'pending', top5_published = false, winners_published = false, top3_published = false WHERE id = 1;

-- 2. Contestants updates
ALTER TABLE public.contestants ADD COLUMN IF NOT EXISTS is_top5 BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.contestants DROP COLUMN IF EXISTS qualified_round2;
UPDATE public.contestants SET is_top5 = false;

-- 3. Scores table updates
ALTER TABLE public.scores DROP CONSTRAINT IF EXISTS scores_round_check;
ALTER TABLE public.scores ADD CONSTRAINT scores_round_check CHECK (round BETWEEN 1 AND 7);

ALTER TABLE public.scores DROP CONSTRAINT IF EXISTS scores_unique_judge_contestant_round_walk;
ALTER TABLE public.scores DROP CONSTRAINT IF EXISTS scores_judge_id_contestant_id_round_key;
ALTER TABLE public.scores DROP CONSTRAINT IF EXISTS scores_unique_judge_contestant_round;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'scores_unique_judge_contestant_round'
  ) THEN
    ALTER TABLE public.scores ADD CONSTRAINT scores_unique_judge_contestant_round UNIQUE (judge_id, contestant_id, round);
  END IF;
END $$;

ALTER TABLE public.scores DROP COLUMN IF EXISTS walk;
