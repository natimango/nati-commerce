-- =============================================
-- Seed Data: Mills & Suppliers
-- =============================================

INSERT INTO cultural_mills (id, name, location, mill_type, certifications, contact_email, is_active) VALUES
(
    'c3f3e3d0-0003-4000-8000-000000000001',
    'Coimbatore Organic Cotton Mill',
    'Coimbatore, Tamil Nadu',
    'weaving',
    '["GOTS", "Fair Trade", "OEKO-TEX Standard 100"]'::jsonb,
    'contact@coimbatoreorganic.in',
    true
),
(
    'c3f3e3d0-0003-4000-8000-000000000002',
    'Natural Dye House Bagru',
    'Bagru, Rajasthan',
    'dyeing',
    '["Natural Dyes", "Fair Trade"]'::jsonb,
    'info@naturaldyebagru.com',
    true
),
(
    'c3f3e3d0-0003-4000-8000-000000000003',
    'Pochampally Handloom Park',
    'Pochampally, Telangana',
    'weaving',
    '["GI Tag", "Handloom Mark"]'::jsonb,
    'info@pochampallyhandloom.in',
    true
),
(
    'c3f3e3d0-0003-4000-8000-000000000004',
    'Khadi Gramodyog',
    'Multiple Locations',
    'weaving',
    '["Khadi Mark", "Make in India"]'::jsonb,
    'contact@khadigramodyog.gov.in',
    true
),
(
    'c3f3e3d0-0003-4000-8000-000000000005',
    'Eco Fabric Finishers',
    'Tirupur, Tamil Nadu',
    'finishing',
    '["GOTS", "OEKO-TEX"]'::jsonb,
    'eco@fabricfinishers.in',
    true
);
