
-- Add unique constraint on customers.email first (needed for ON CONFLICT and trigger safety)
ALTER TABLE public.customers ADD CONSTRAINT customers_email_key UNIQUE (email);

-- Seed product categories
INSERT INTO public.product_categories (name, slug, description)
VALUES
  ('Livestock', 'livestock', 'Dairy and beef cattle, sheep and goats'),
  ('Coffee', 'coffee', 'Highland-grown coffee cherries and beans'),
  ('Horticulture', 'horticulture', 'Fresh vegetables and mixed produce'),
  ('Citrus Fruit', 'citrus-fruit', 'Oranges and citrus fruits')
ON CONFLICT (slug) DO NOTHING;

-- Seed default products so admins can edit the catalog visible on the public site
INSERT INTO public.products (name, slug, category_id, description, origin, seasonality, moq, status, featured, images)
SELECT * FROM (VALUES
  ('Livestock', 'livestock', (SELECT id FROM public.product_categories WHERE slug='livestock'),
   'Healthy dairy and beef cattle, sheep and goats raised on the Kimoning highland pastures — supplied to local markets, butcheries and traders.',
   'Kenya', 'Year-round', '1 head minimum', 'available', true, ARRAY[]::text[]),
  ('Coffee', 'coffee', (SELECT id FROM public.product_categories WHERE slug='coffee'),
   'Premium Kenyan highland-grown coffee cherries and beans, cultivated in the fertile North Rift and prepared for wholesale and export buyers.',
   'Kenya', 'Seasonal', '1 x 20ft container', 'available', true, ARRAY[]::text[]),
  ('Horticulture Produce', 'horticulture', (SELECT id FROM public.product_categories WHERE slug='horticulture'),
   'Fresh farm horticultural crops — kale, cabbages, tomatoes and mixed vegetables — grown at Eldo Fresh Farm for local wholesale and retail supply.',
   'Kenya', 'Year-round', 'By arrangement', 'available', true, ARRAY[]::text[]),
  ('Citrus Fruit', 'citrus-fruit', (SELECT id FROM public.product_categories WHERE slug='citrus-fruit'),
   'Juicy sun-ripened oranges and citrus fruits from Eldo Fresh Farm orchards, ideal for fresh markets, juice processors and regional trade.',
   'Kenya', 'Seasonal', '500 kg', 'available', true, ARRAY[]::text[])
) AS v(name, slug, category_id, description, origin, seasonality, moq, status, featured, images)
ON CONFLICT (slug) DO NOTHING;

-- Fix the new-user trigger — previous version referenced customers.status which does not exist
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
    VALUES (
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      'individual'
    )
    ON CONFLICT (email) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

-- Backfill customer rows for any existing non-staff auth users
INSERT INTO public.customers (email, contact_name, customer_type)
SELECT au.email,
       COALESCE(au.raw_user_meta_data->>'full_name', au.email),
       'individual'
  FROM auth.users au
  LEFT JOIN public.customers c ON c.email = au.email
  LEFT JOIN public.user_roles ur ON ur.user_id = au.id
 WHERE c.id IS NULL
   AND au.email IS NOT NULL
   AND (ur.role IS NULL OR ur.role NOT IN ('super_admin','admin','manager','staff'))
ON CONFLICT (email) DO NOTHING;
