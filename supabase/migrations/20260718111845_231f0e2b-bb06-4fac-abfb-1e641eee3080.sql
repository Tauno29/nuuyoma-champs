
ALTER TABLE public.scores ADD COLUMN IF NOT EXISTS walk integer NOT NULL DEFAULT 1;
ALTER TABLE public.scores DROP CONSTRAINT IF EXISTS scores_judge_id_contestant_id_round_key;
ALTER TABLE public.scores DROP CONSTRAINT IF EXISTS scores_unique_judge_contestant_round;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'scores_unique_judge_contestant_round_walk'
  ) THEN
    ALTER TABLE public.scores ADD CONSTRAINT scores_unique_judge_contestant_round_walk UNIQUE (judge_id, contestant_id, round, walk);
  END IF;
END $$;

ALTER TABLE public.competition_state ADD COLUMN IF NOT EXISTS round1_current_walk integer NOT NULL DEFAULT 1;
ALTER TABLE public.competition_state ADD COLUMN IF NOT EXISTS round2_current_walk integer NOT NULL DEFAULT 1;
