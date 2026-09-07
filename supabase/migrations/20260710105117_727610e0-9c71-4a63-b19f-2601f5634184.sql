
CREATE POLICY "product-images auth read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'product-images');
CREATE POLICY "product-images staff write" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'product-images' AND public.is_portal_user(auth.uid()))
  WITH CHECK (bucket_id = 'product-images' AND public.is_portal_user(auth.uid()));
CREATE POLICY "site-content auth read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'site-content');
CREATE POLICY "site-content staff write" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'site-content' AND public.is_portal_user(auth.uid()))
  WITH CHECK (bucket_id = 'site-content' AND public.is_portal_user(auth.uid()));
