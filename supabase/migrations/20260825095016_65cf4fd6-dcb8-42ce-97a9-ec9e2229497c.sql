-- ===== ROLES =====
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'manager', 'staff', 'client');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT, email TEXT, phone TEXT, avatar_url TEXT,
  notify_email boolean NOT NULL DEFAULT true,
  notify_marketing boolean NOT NULL DEFAULT false,
  preferred_language text NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles readable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_portal_user(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','admin','manager','staff'));
$$;

CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('super_admin','admin'));
$$;

CREATE POLICY "read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "admins manage user_roles insert" ON public.user_roles
  FOR INSERT TO authenticated WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "admins manage user_roles delete" ON public.user_roles
  FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "admins manage user_roles update" ON public.user_roles
  FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ===== CATALOG =====
CREATE TABLE public.product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT, image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.product_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_categories TO authenticated;
GRANT ALL ON public.product_categories TO service_role;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories public read" ON public.product_categories FOR SELECT USING (true);
CREATE POLICY "categories staff write" ON public.product_categories FOR ALL TO authenticated
  USING (public.is_portal_user(auth.uid())) WITH CHECK (public.is_portal_user(auth.uid()));
CREATE TRIGGER product_categories_updated BEFORE UPDATE ON public.product_categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
  description TEXT, origin TEXT, seasonality TEXT, moq TEXT,
  status TEXT NOT NULL DEFAULT 'available',
  featured BOOLEAN NOT NULL DEFAULT false,
  images TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products public read" ON public.products FOR SELECT USING (true);
CREATE POLICY "products staff write" ON public.products FOR ALL TO authenticated
  USING (public.is_portal_user(auth.uid())) WITH CHECK (public.is_portal_user(auth.uid()));
CREATE TRIGGER products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== CUSTOMERS =====
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT, contact_name TEXT NOT NULL, email TEXT UNIQUE, phone TEXT,
  country TEXT, customer_type TEXT NOT NULL DEFAULT 'company', notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "customers staff access" ON public.customers FOR ALL TO authenticated
  USING (public.is_portal_user(auth.uid())) WITH CHECK (public.is_portal_user(auth.uid()));
CREATE POLICY "Clients read own customer" ON public.customers FOR SELECT TO authenticated
  USING (email = (auth.jwt() ->> 'email'));
CREATE TRIGGER customers_updated BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== QUOTES =====
CREATE TABLE public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  contact_name TEXT NOT NULL, company TEXT, email TEXT NOT NULL, phone TEXT, country TEXT,
  products JSONB NOT NULL DEFAULT '[]'::jsonb,
  quantity TEXT, message TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  read_at timestamptz,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.quote_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quote_requests TO authenticated;
GRANT ALL ON public.quote_requests TO service_role;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quotes public submit" ON public.quote_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "quotes staff access" ON public.quote_requests FOR ALL TO authenticated
  USING (public.is_portal_user(auth.uid())) WITH CHECK (public.is_portal_user(auth.uid()));
CREATE POLICY "Clients read own quotes" ON public.quote_requests FOR SELECT TO authenticated
  USING (email = (auth.jwt() ->> 'email'));
CREATE TRIGGER quote_requests_updated BEFORE UPDATE ON public.quote_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ===== ORDERS =====
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  quote_id UUID REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount NUMERIC(12,2) DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "orders staff access" ON public.orders FOR ALL TO authenticated
  USING (public.is_portal_user(auth.uid())) WITH CHECK (public.is_portal_user(auth.uid()));
CREATE POLICY "Clients read own orders" ON public.orders FOR SELECT TO authenticated
  USING (customer_id IN (SELECT id FROM public.customers WHERE email = (auth.jwt() ->> 'email')));
CREATE TRIGGER orders_updated BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity NUMERIC(12,2) NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'kg',
  unit_price NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "order_items staff access" ON public.order_items FOR ALL TO authenticated
  USING (public.is_portal_user(auth.uid())) WITH CHECK (public.is_portal_user(auth.uid()));

-- ===== SHIPMENTS / DOCUMENTS =====
CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  container_number TEXT, shipping_line TEXT, destination TEXT,
  departure_date DATE, eta DATE,
  status TEXT NOT NULL DEFAULT 'preparing',
  tracking_number TEXT, notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.shipments TO authenticated;
GRANT ALL ON public.shipments TO service_role;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shipments staff access" ON public.shipments FOR ALL TO authenticated
  USING (public.is_portal_user(auth.uid())) WITH CHECK (public.is_portal_user(auth.uid()));
CREATE POLICY "Clients read own shipments" ON public.shipments FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE customer_id IN (SELECT id FROM public.customers WHERE email = (auth.jwt() ->> 'email'))));
CREATE TRIGGER shipments_updated BEFORE UPDATE ON public.shipments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.export_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  shipment_id UUID REFERENCES public.shipments(id) ON DELETE SET NULL,
  doc_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT, notes TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.export_documents TO authenticated;
GRANT ALL ON public.export_documents TO service_role;
ALTER TABLE public.export_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "documents staff access" ON public.export_documents FOR ALL TO authenticated
  USING (public.is_portal_user(auth.uid())) WITH CHECK (public.is_portal_user(auth.uid()));
CREATE POLICY "Clients read own documents" ON public.export_documents FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE customer_id IN (SELECT id FROM public.customers WHERE email = (auth.jwt() ->> 'email'))));

-- ===== CONTENT =====
CREATE TABLE public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT, category TEXT, image_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;
GRANT ALL ON public.gallery_items TO service_role;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gallery public read" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "gallery staff write" ON public.gallery_items FOR ALL TO authenticated
  USING (public.is_portal_user(auth.uid())) WITH CHECK (public.is_portal_user(auth.uid()));

CREATE TABLE public.news_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  excerpt TEXT, content TEXT, cover_image TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.news_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.news_posts TO authenticated;
GRANT ALL ON public.news_posts TO service_role;
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news public read published" ON public.news_posts FOR SELECT USING (published = true);
CREATE POLICY "news staff access" ON public.news_posts FOR ALL TO authenticated
  USING (public.is_portal_user(auth.uid())) WITH CHECK (public.is_portal_user(auth.uid()));
CREATE TRIGGER news_posts_updated BEFORE UPDATE ON public.news_posts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.website_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.website_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.website_content TO authenticated;
GRANT ALL ON public.website_content TO service_role;
ALTER TABLE public.website_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "content public read" ON public.website_content FOR SELECT USING (true);
CREATE POLICY "content staff write" ON public.website_content FOR ALL TO authenticated
  USING (public.is_portal_user(auth.uid())) WITH CHECK (public.is_portal_user(auth.uid()));

CREATE TABLE public.activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT, entity_id UUID,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.activity_log TO authenticated;
GRANT ALL ON public.activity_log TO service_role;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity staff read" ON public.activity_log FOR SELECT TO authenticated
  USING (public.is_portal_user(auth.uid()));
CREATE POLICY "activity staff insert" ON public.activity_log FOR INSERT TO authenticated
  WITH CHECK (public.is_portal_user(auth.uid()) AND user_id = auth.uid());

-- ===== NEW USER TRIGGER =====
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE user_count INT;
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), NEW.email);

  SELECT COUNT(*) INTO user_count FROM auth.users;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client');
    INSERT INTO public.customers (email, contact_name, customer_type)
    VALUES (NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 'individual')
    ON CONFLICT (email) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== STORAGE POLICIES =====
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
CREATE POLICY "docs staff read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'documents' AND public.is_portal_user(auth.uid()));
CREATE POLICY "docs staff insert" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'documents' AND public.is_portal_user(auth.uid()));
CREATE POLICY "docs staff update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'documents' AND public.is_portal_user(auth.uid()));
CREATE POLICY "docs staff delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documents' AND public.is_portal_user(auth.uid()));
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

-- ===== REALTIME =====
DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.orders; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.shipments; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.quote_requests; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- ===== SEED CATALOG =====
INSERT INTO public.product_categories (name, slug, description, sort_order) VALUES
  ('Fresh Miraa', 'fresh-miraa', 'Freshly harvested Kenyan miraa prepared for shipment', 10),
  ('Premium Grade', 'premium-grade', 'Carefully selected product for consistent grading', 20),
  ('Bulk Export', 'bulk-export', 'Larger-volume supply for qualified wholesale buyers', 30),
  ('Custom Orders', 'custom-orders', 'Orders prepared to agreed buyer specification', 40);

INSERT INTO public.products (name, slug, category_id, description, origin, seasonality, moq, status, featured, images)
SELECT v.name, v.slug, c.id, v.description, 'Kenya', v.seasonality, v.moq, 'available', true, '{}'::text[]
FROM (VALUES
  ('Fresh Miraa','fresh-miraa','Freshly harvested Kenyan miraa, sourced through reliable supply networks and prepared promptly for shipment to maintain freshness.','Year-round','Enquire for current minimum order quantity','fresh-miraa'),
  ('Premium Grade','premium-grade','Carefully selected product intended for buyers requiring consistent grading, stem quality and presentation.','Year-round','Enquire for current minimum order quantity','premium-grade'),
  ('Bulk Export','bulk-export','Larger-volume supply for qualified wholesale buyers and distributors, coordinated around agreed shipment schedules.','Year-round','Enquire for current minimum order quantity','bulk-export'),
  ('Custom Buyer Orders','custom-orders','Orders prepared according to mutually agreed specifications, packaging and applicable destination requirements.','Seasonal','Discussed at enquiry stage','custom-orders')
) AS v(name, slug, description, seasonality, moq, cat_slug)
JOIN public.product_categories c ON c.slug = v.cat_slug;