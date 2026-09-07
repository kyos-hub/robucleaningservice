
CREATE POLICY "docs staff read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'documents' AND public.is_portal_user(auth.uid()));
CREATE POLICY "docs staff insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents' AND public.is_portal_user(auth.uid()));
CREATE POLICY "docs staff update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'documents' AND public.is_portal_user(auth.uid()));
CREATE POLICY "docs staff delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documents' AND public.is_portal_user(auth.uid()));
-- Clients may read documents linked to their own orders (via signed URLs also work,
-- but this allows direct download when file paths are known)
CREATE POLICY "docs client read own" ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents' AND EXISTS (
      SELECT 1 FROM public.export_documents d
      JOIN public.orders o ON o.id = d.order_id
      JOIN public.customers c ON c.id = o.customer_id
      WHERE d.file_url LIKE '%' || storage.objects.name
        AND c.email = (auth.jwt() ->> 'email')
    )
  );
