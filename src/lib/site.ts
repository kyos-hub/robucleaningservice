export const site = {
  name: "Robu Cleaning Services",
  legalName: "Robu Cleaning Services Ltd.",
  registrationNo: "C168246",
  tagline: "Professional Cleaning, Sanitation & Pest Management Solutions Across Kenya",
  phone: "+254 722 762 198",
  phoneHref: "tel:+254722762198",
  phoneAlt: "053 2060334",
  phoneAltHref: "tel:+254532060334",
  email: "robu.cleaning@yahoo.com",
  emailHref: "mailto:robu.cleaning@yahoo.com",
  emailAlt: "robu.cleaning@gmail.com",
  emailAltHref: "mailto:robu.cleaning@gmail.com",
  whatsapp: "+254722762198",
  whatsappHref: "https://wa.me/254722762198",
  address:
    "Head Office: Elgeyo Road, next to Wells Fargo, Eldoret · Branch: Verdic House, 3rd Floor, Room 315, Nairobi",
  postal: "P.O. Box 7843 – 30100 GPO, Eldoret, Kenya",
  farm: "Robu Cleaning Services Ltd, Head Office – Eldoret",
  hours: "Mon – Sat: 8:00 – 17:00 EAT",
  pin: "P051301262N",
  vat: "0124252A",
} as const;

// Canonical company block – import this anywhere you need to display the
// legal company identity (footers, invoices, PDF documents, contact pages).
export const COMPANY = {
  name: site.legalName,
  email: site.email,
  emailHref: site.emailHref,
  emailAlt: site.emailAlt,
  emailAltHref: site.emailAltHref,
  phone: site.phone,
  phoneAlt: site.phoneAlt,
  phoneAltHref: site.phoneAltHref,
  address: site.address,
} as const;

export const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Our Services" },
  { to: "/careers", label: "Careers" },
  { to: "/blog", label: "Blog" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

// Sub-pages shown inside the "About Us" dropdown in the header.
export const aboutDropdown = [
  { to: "/export-services", label: "Corporate Contracts" },
  { to: "/quality-compliance", label: "Quality & Compliance" },
] as const;

export const services = [
  { slug: "commercial-cleaning", name: "Commercial Cleaning" },
  { slug: "post-construction-cleaning", name: "Post-Construction Cleaning" },
  { slug: "upholstery-cleaning", name: "Upholstery Cleaning" },
  { slug: "carpet-cleaning", name: "Carpet Cleaning" },
  { slug: "waste-management", name: "Waste Management" },
  { slug: "sanitary-bin-services", name: "Sanitary Bin Services" },
  { slug: "facility-maintenance", name: "Facility Maintenance" },
  { slug: "hygiene-solutions", name: "Hygiene Solutions" },
] as const;
