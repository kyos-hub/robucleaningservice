DELETE FROM public.products;
DELETE FROM public.product_categories;

INSERT INTO public.product_categories (name, slug, description, sort_order) VALUES
  ('Commercial Cleaning', 'commercial-cleaning', 'Scheduled cleaning programs for offices, retail, institutions and industrial premises', 10),
  ('Fumigation & Pest Control', 'fumigation-pest-control', 'PEMAK-affiliated fumigation and integrated pest management', 20),
  ('Facility Maintenance', 'facility-maintenance', 'Ongoing facility upkeep and hygiene management', 30),
  ('Specialized Services', 'specialized-services', 'Post-construction, carpet & upholstery cleaning, waste and hygiene solutions', 40);

INSERT INTO public.products (name, slug, category_id, description, origin, seasonality, moq, status, featured, images)
SELECT v.name, v.slug, c.id, v.description, 'Kenya', v.seasonality, v.moq, 'available', true, '{}'::text[]
FROM (VALUES
  ('Commercial Cleaning','commercial-cleaning','Scheduled cleaning programs for offices, retail spaces, institutions and industrial premises, delivered by trained, uniformed crews across Eldoret, Nairobi and Nakuru.','Year-round','Enquire for a site survey and quote','commercial-cleaning'),
  ('Fumigation & Pest Control','fumigation-pest-control','PEMAK-affiliated fumigation and integrated pest management for commercial, industrial and residential properties, using approved chemicals and certified technicians.','Year-round','Enquire for current rates','fumigation-pest-control'),
  ('Facility Maintenance','facility-maintenance','Ongoing facility upkeep and hygiene management for large sites and multi-branch organizations, coordinated under agreed service-level schedules.','Year-round','Enquire for current minimum contract terms','facility-maintenance'),
  ('Specialized Services','specialized-services','Post-construction cleaning, carpet & upholstery cleaning, waste management, sanitary bin services and hygiene solutions, prepared to agreed specifications.','Seasonal','Discussed at enquiry stage','specialized-services')
) AS v(name, slug, description, seasonality, moq, cat_slug)
JOIN public.product_categories c ON c.slug = v.cat_slug;