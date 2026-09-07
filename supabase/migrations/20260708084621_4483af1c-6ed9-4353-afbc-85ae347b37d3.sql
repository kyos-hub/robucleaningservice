-- Clients can read their own quote requests
CREATE POLICY "Clients read own quotes" ON public.quote_requests
FOR SELECT TO authenticated
USING (email = (auth.jwt() ->> 'email'));

-- Clients can read their own customer record
CREATE POLICY "Clients read own customer" ON public.customers
FOR SELECT TO authenticated
USING (email = (auth.jwt() ->> 'email'));

-- Clients can read their own orders (via customer email)
CREATE POLICY "Clients read own orders" ON public.orders
FOR SELECT TO authenticated
USING (
  customer_id IN (SELECT id FROM public.customers WHERE email = (auth.jwt() ->> 'email'))
);

-- Clients can read shipments for their own orders
CREATE POLICY "Clients read own shipments" ON public.shipments
FOR SELECT TO authenticated
USING (
  order_id IN (
    SELECT id FROM public.orders WHERE customer_id IN (
      SELECT id FROM public.customers WHERE email = (auth.jwt() ->> 'email')
    )
  )
);

-- Clients can read export documents for their own orders
CREATE POLICY "Clients read own documents" ON public.export_documents
FOR SELECT TO authenticated
USING (
  order_id IN (
    SELECT id FROM public.orders WHERE customer_id IN (
      SELECT id FROM public.customers WHERE email = (auth.jwt() ->> 'email')
    )
  )
);