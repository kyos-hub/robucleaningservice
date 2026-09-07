DELETE FROM public.orders WHERE order_number = 'E2E-TEST-001';
DELETE FROM public.customers WHERE email LIKE 'e2e%@eldotest.dev';