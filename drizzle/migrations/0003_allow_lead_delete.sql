GRANT DELETE ON public.leads TO anon;
GRANT DELETE ON public.leads TO authenticated;

CREATE POLICY "Anyone can delete leads"
ON public.leads
FOR DELETE
TO anon, authenticated
USING (true);