-- Staff full access on product-images
CREATE POLICY "staff can manage product-images"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'product-images' AND public.is_portal_user(auth.uid()))
WITH CHECK (bucket_id = 'product-images' AND public.is_portal_user(auth.uid()));

-- Any authenticated user can read (admin preview)
CREATE POLICY "authenticated can read product-images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'product-images');

-- Staff full access on site-content
CREATE POLICY "staff can manage site-content"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'site-content' AND public.is_portal_user(auth.uid()))
WITH CHECK (bucket_id = 'site-content' AND public.is_portal_user(auth.uid()));

CREATE POLICY "authenticated can read site-content"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'site-content');