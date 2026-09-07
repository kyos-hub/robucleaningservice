-- Rebrand the seeded catalog from Eldo Fresh Farm (livestock/coffee/horticulture)
-- to Miraa Export Kenya (Fresh Miraa / Premium Grade / Bulk Export / Custom Orders).
-- Existing rows are updated in place so admin-entered edits on other columns are preserved;
-- nothing is deleted so historical order/quote references stay intact.

UPDATE public.product_categories SET name = 'Fresh Miraa', slug = 'fresh-miraa', description = 'Freshly harvested Kenyan miraa prepared for shipment' WHERE slug = 'livestock';
UPDATE public.product_categories SET name = 'Premium Grade', slug = 'premium-grade', description = 'Carefully selected product for consistent grading' WHERE slug = 'coffee';
UPDATE public.product_categories SET name = 'Bulk Export', slug = 'bulk-export', description = 'Larger-volume supply for qualified wholesale buyers' WHERE slug = 'horticulture';
UPDATE public.product_categories SET name = 'Custom Orders', slug = 'custom-orders', description = 'Orders prepared to agreed buyer specification' WHERE slug = 'citrus-fruit';

UPDATE public.products
   SET name = 'Fresh Miraa', slug = 'fresh-miraa',
       description = 'Freshly harvested Kenyan miraa, sourced through reliable supply networks and prepared promptly for shipment to maintain freshness.',
       origin = 'Kenya', seasonality = 'Year-round', moq = 'Enquire for current minimum order quantity'
 WHERE slug = 'livestock';

UPDATE public.products
   SET name = 'Premium Grade', slug = 'premium-grade',
       description = 'Carefully selected product intended for buyers requiring consistent grading, stem quality and presentation.',
       origin = 'Kenya', seasonality = 'Year-round', moq = 'Enquire for current minimum order quantity'
 WHERE slug = 'coffee';

UPDATE public.products
   SET name = 'Bulk Export', slug = 'bulk-export',
       description = 'Larger-volume supply for qualified wholesale buyers and distributors, coordinated around agreed shipment schedules.',
       origin = 'Kenya', seasonality = 'Year-round', moq = 'Enquire for current minimum order quantity'
 WHERE slug = 'horticulture';

UPDATE public.products
   SET name = 'Custom Buyer Orders', slug = 'custom-orders',
       description = 'Orders prepared according to mutually agreed specifications, packaging and applicable destination requirements.',
       origin = 'Kenya', seasonality = 'Seasonal', moq = 'Discussed at enquiry stage'
 WHERE slug = 'citrus-fruit';

-- Remove additional legacy products seeded by an earlier migration
-- (Cattle, Sheep, Goats, a duplicate "Citrus Fruit") that have no
-- place in the Miraa Export Kenya catalogue.
DELETE FROM public.products WHERE slug IN ('cattle', 'sheep', 'goats', 'citrus');
