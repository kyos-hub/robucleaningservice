UPDATE public.products SET slug = 'cow-peas' WHERE slug = 'cow peas';

INSERT INTO public.product_categories (name, slug, description, sort_order)
SELECT 'Citrus Fruit', 'citrus-fruit', 'Fresh citrus fruit from the Kimoning highlands.', 40
WHERE NOT EXISTS (SELECT 1 FROM public.product_categories WHERE slug = 'citrus-fruit');

INSERT INTO public.products (name, slug, category_id, description, origin, seasonality, moq, status, featured, images)
SELECT v.name, v.slug, c.id, v.description, 'Kimoning, Uasin Gishu, Kenya', v.seasonality, '1 tonne', 'available', v.featured, '{}'::text[]
FROM (VALUES
  ('Cattle','cattle','Well-conditioned dairy and beef cattle raised on lush North Rift highland pastures — supplied to dairies, butcheries and livestock traders.','Year-round','livestock',true),
  ('Sheep','sheep','Healthy sheep reared on natural highland pastures and ready for meat, breeding and wholesale supply.','Year-round','livestock',true),
  ('Goats','goats','Hardy dairy and meat goats raised on the Kimoning highlands — available year-round for local markets, butcheries and traders.','Year-round','livestock',true),
  ('Citrus Fruit','citrus','Juicy oranges, lemons and tangerines hand-picked at peak ripeness for wholesale and export buyers.','Seasonal','citrus-fruit',true)
) AS v(name, slug, description, seasonality, cat_slug, featured)
JOIN public.product_categories c ON c.slug = v.cat_slug
WHERE NOT EXISTS (SELECT 1 FROM public.products p WHERE p.slug = v.slug);