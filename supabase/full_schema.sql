-- Full Supabase SQL Schema for Pagents Modelling Sys (Idempotent / Safe to re-run)

-- 1. Competition State Singleton
CREATE TABLE IF NOT EXISTS public.competition_state (
  id INT PRIMARY KEY DEFAULT 1,
  current_round INT NOT NULL DEFAULT 0, -- 0 = pending/not started, 1-4 = preliminary rounds, 5-7 = top 5 final rounds
  round_status TEXT NOT NULL DEFAULT 'pending', -- pending, open, closed
  top5_published BOOLEAN NOT NULL DEFAULT false,
  top3_published BOOLEAN NOT NULL DEFAULT false,
  winners_published BOOLEAN NOT NULL DEFAULT false,
  leaderboard_visible BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);

-- Ensure updated columns exist if upgrading from older schema
ALTER TABLE public.competition_state ADD COLUMN IF NOT EXISTS round_status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE public.competition_state ADD COLUMN IF NOT EXISTS top3_published BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.competition_state DROP COLUMN IF EXISTS round1_current_walk;
ALTER TABLE public.competition_state DROP COLUMN IF EXISTS round2_current_walk;
ALTER TABLE public.competition_state DROP COLUMN IF EXISTS round1_status;
ALTER TABLE public.competition_state DROP COLUMN IF EXISTS round2_status;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.competition_state TO anon, authenticated;
GRANT ALL ON public.competition_state TO service_role;
ALTER TABLE public.competition_state ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone read state" ON public.competition_state;
DROP POLICY IF EXISTS "anyone update state" ON public.competition_state;
DROP POLICY IF EXISTS "anyone insert state" ON public.competition_state;
CREATE POLICY "anyone read state" ON public.competition_state FOR SELECT USING (true);
CREATE POLICY "anyone update state" ON public.competition_state FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "anyone insert state" ON public.competition_state FOR INSERT WITH CHECK (true);

-- 2. Judges Table
CREATE TABLE IF NOT EXISTS public.judges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.judges TO anon, authenticated;
GRANT ALL ON public.judges TO service_role;
ALTER TABLE public.judges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone read judges" ON public.judges;
DROP POLICY IF EXISTS "anyone insert judges" ON public.judges;
DROP POLICY IF EXISTS "anyone delete judges" ON public.judges;
CREATE POLICY "anyone read judges" ON public.judges FOR SELECT USING (true);
CREATE POLICY "anyone insert judges" ON public.judges FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone delete judges" ON public.judges FOR DELETE USING (true);

-- 3. Contestants Table
CREATE TABLE IF NOT EXISTS public.contestants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  photo_url TEXT,
  is_top5 BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contestants ADD COLUMN IF NOT EXISTS is_top5 BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.contestants DROP COLUMN IF EXISTS qualified_round2;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.contestants TO anon, authenticated;
GRANT ALL ON public.contestants TO service_role;
ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone read contestants" ON public.contestants;
DROP POLICY IF EXISTS "anyone modify contestants" ON public.contestants;
CREATE POLICY "anyone read contestants" ON public.contestants FOR SELECT USING (true);
CREATE POLICY "anyone modify contestants" ON public.contestants FOR ALL USING (true) WITH CHECK (true);

-- 4. Scores Table
CREATE TABLE IF NOT EXISTS public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id UUID NOT NULL REFERENCES public.judges(id) ON DELETE CASCADE,
  contestant_id UUID NOT NULL REFERENCES public.contestants(id) ON DELETE CASCADE,
  round INT NOT NULL CHECK (round BETWEEN 1 AND 7),
  confidence INT NOT NULL CHECK (confidence BETWEEN 0 AND 10),
  catwalk INT NOT NULL CHECK (catwalk BETWEEN 0 AND 10),
  creativity INT NOT NULL CHECK (creativity BETWEEN 0 AND 10),
  stage_presence INT NOT NULL CHECK (stage_presence BETWEEN 0 AND 10),
  overall_appearance INT NOT NULL CHECK (overall_appearance BETWEEN 0 AND 10),
  total INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Adjust constraints for scores if upgrading existing table
ALTER TABLE public.scores DROP CONSTRAINT IF EXISTS scores_round_check;
ALTER TABLE public.scores ADD CONSTRAINT scores_round_check CHECK (round BETWEEN 1 AND 7);
ALTER TABLE public.scores DROP CONSTRAINT IF EXISTS scores_unique_judge_contestant_round_walk;
ALTER TABLE public.scores DROP CONSTRAINT IF EXISTS scores_judge_id_contestant_id_round_key;
ALTER TABLE public.scores DROP CONSTRAINT IF EXISTS scores_unique_judge_contestant_round;
ALTER TABLE public.scores DROP COLUMN IF EXISTS walk;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'scores_unique_judge_contestant_round'
  ) THEN
    ALTER TABLE public.scores ADD CONSTRAINT scores_unique_judge_contestant_round UNIQUE (judge_id, contestant_id, round);
  END IF;
END $$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.scores TO anon, authenticated;
GRANT ALL ON public.scores TO service_role;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anyone read scores" ON public.scores;
DROP POLICY IF EXISTS "anyone modify scores" ON public.scores;
CREATE POLICY "anyone read scores" ON public.scores FOR SELECT USING (true);
CREATE POLICY "anyone modify scores" ON public.scores FOR ALL USING (true) WITH CHECK (true);

-- 5. Realtime Subscriptions (Safely add tables only if not already in publication)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'competition_state') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.competition_state;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'judges') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.judges;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'contestants') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.contestants;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'scores') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.scores;
  END IF;
END $$;

-- 6. Initial Seed Data
INSERT INTO public.competition_state (id) VALUES (1) ON CONFLICT DO NOTHING;

INSERT INTO public.contestants (number, name) VALUES
(1,'Contestant 1'),(2,'Contestant 2'),(3,'Contestant 3'),(4,'Contestant 4'),(5,'Contestant 5'),
(6,'Contestant 6'),(7,'Contestant 7'),(8,'Contestant 8'),(9,'Contestant 9'),(10,'Contestant 10'),
(11,'Contestant 11'),(12,'Contestant 12'),(13,'Contestant 13'),(14,'Contestant 14'),(15,'Contestant 15'),
(16,'Contestant 16'),(17,'Contestant 17'),(18,'Contestant 18'),(19,'Contestant 19'),(20,'Contestant 20')
ON CONFLICT (number) DO NOTHING;
