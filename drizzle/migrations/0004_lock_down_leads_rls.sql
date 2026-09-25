DROP POLICY IF EXISTS "Anyone can delete leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can read leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can update lead status" ON public.leads;
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;
REVOKE SELECT, UPDATE, DELETE ON public.leads FROM anon, authenticated;
GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;
CREATE POLICY "Intake form can submit new leads" ON public.leads
FOR INSERT TO anon, authenticated
WITH CHECK (source = 'intake' AND status = 'new' AND plan IS NULL AND price IS NULL
  AND char_length(name) BETWEEN 2 AND 80);