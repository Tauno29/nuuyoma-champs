
-- Competition state singleton
CREATE TABLE public.competition_state (
  id INT PRIMARY KEY DEFAULT 1,
  current_round INT NOT NULL DEFAULT 0, -- 0 = not started, 1 = round 1, 2 = round 2
  round1_status TEXT NOT NULL DEFAULT 'pending', -- pending, open, closed
  round2_status TEXT NOT NULL DEFAULT 'pending',
  top5_published BOOLEAN NOT NULL DEFAULT false,
  winners_published BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.competition_state TO anon, authenticated;
GRANT ALL ON public.competition_state TO service_role;
ALTER TABLE public.competition_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone read state" ON public.competition_state FOR SELECT USING (true);
CREATE POLICY "anyone update state" ON public.competition_state FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "anyone insert state" ON public.competition_state FOR INSERT WITH CHECK (true);

-- Judges
CREATE TABLE public.judges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.judges TO anon, authenticated;
GRANT ALL ON public.judges TO service_role;
ALTER TABLE public.judges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone read judges" ON public.judges FOR SELECT USING (true);
CREATE POLICY "anyone insert judges" ON public.judges FOR INSERT WITH CHECK (true);
CREATE POLICY "anyone delete judges" ON public.judges FOR DELETE USING (true);

-- Contestants
CREATE TABLE public.contestants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number INT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  photo_url TEXT,
  qualified_round2 BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contestants TO anon, authenticated;
GRANT ALL ON public.contestants TO service_role;
ALTER TABLE public.contestants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone read contestants" ON public.contestants FOR SELECT USING (true);
CREATE POLICY "anyone modify contestants" ON public.contestants FOR ALL USING (true) WITH CHECK (true);

-- Scores
CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  judge_id UUID NOT NULL REFERENCES public.judges(id) ON DELETE CASCADE,
  contestant_id UUID NOT NULL REFERENCES public.contestants(id) ON DELETE CASCADE,
  round INT NOT NULL CHECK (round IN (1, 2)),
  confidence INT NOT NULL CHECK (confidence BETWEEN 0 AND 20),
  catwalk INT NOT NULL CHECK (catwalk BETWEEN 0 AND 20),
  creativity INT NOT NULL CHECK (creativity BETWEEN 0 AND 20),
  stage_presence INT NOT NULL CHECK (stage_presence BETWEEN 0 AND 20),
  overall_appearance INT NOT NULL CHECK (overall_appearance BETWEEN 0 AND 20),
  total INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (judge_id, contestant_id, round)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scores TO anon, authenticated;
GRANT ALL ON public.scores TO service_role;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone read scores" ON public.scores FOR SELECT USING (true);
CREATE POLICY "anyone modify scores" ON public.scores FOR ALL USING (true) WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.competition_state;
ALTER PUBLICATION supabase_realtime ADD TABLE public.judges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contestants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.scores;

-- Seed state
INSERT INTO public.competition_state (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Seed 20 contestants
INSERT INTO public.contestants (number, name) VALUES
(1,'Contestant 1'),(2,'Contestant 2'),(3,'Contestant 3'),(4,'Contestant 4'),(5,'Contestant 5'),
(6,'Contestant 6'),(7,'Contestant 7'),(8,'Contestant 8'),(9,'Contestant 9'),(10,'Contestant 10'),
(11,'Contestant 11'),(12,'Contestant 12'),(13,'Contestant 13'),(14,'Contestant 14'),(15,'Contestant 15'),
(16,'Contestant 16'),(17,'Contestant 17'),(18,'Contestant 18'),(19,'Contestant 19'),(20,'Contestant 20')
ON CONFLICT (number) DO NOTHING;
