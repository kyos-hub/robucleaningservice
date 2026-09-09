import imgFloorCleaningTeam from "@/assets/photos/robu-floor-cleaning-team.jpg";
import imgVehiclesMessenger from "@/assets/photos/robu-vehicles-messenger.jpg";
import imgOfficeMopping from "@/assets/photos/robu-office-mopping.jpg";
import imgPestControlGarden from "@/assets/photos/robu-pest-control-garden.jpg";
import imgShowerCleaning from "@/assets/photos/robu-shower-cleaning.jpg";
import imgWasteBins from "@/assets/photos/robu-waste-bins.jpg";
import imgOfficeReception from "@/assets/photos/robu-office-reception.jpg";
import imgSuppliesStore from "@/assets/photos/robu-supplies-store.jpg";

export type ServiceCategory =
  "Cleaning" | "Pest Control & Fumigation" | "Grounds & Waste" | "Support Staffing" | "Supplies";

export type Service = {
  slug: string;
  name: string;
  category: ServiceCategory;
  tagline: string;
  description: string;
  image: string;
  /** What the client actually gets on site. */
  includes: string[];
  /** Typical sites we run this service at. */
  idealFor: string[];
  /** How we run the job, step by step. */
  process: { title: string; body: string }[];
  schedule: string;
  coverage: string;
  availability: "Year-round" | "Seasonal";
};

export type Product = Pick<
  Service,
  "slug" | "name" | "category" | "description" | "image" | "availability"
>;

export const serviceCategories = [
  "All",
  "Cleaning",
  "Pest Control & Fumigation",
  "Grounds & Waste",
  "Support Staffing",
  "Supplies",
] as const;

const COVERAGE =
  "North Rift, South Rift, Central Rift, Western, Nyanza, Nairobi and Mombasa regions";

export const services: Service[] = [
  {
    slug: "comprehensive-cleaning",
    name: "Comprehensive Cleaning Services",
    category: "Cleaning",
    tagline: "Daily housekeeping for banks, offices, hospitals and institutions.",
    description:
      "Full contract cleaning for banks, commercial buildings, learning institutions, private and public hospitals, religious institutions and private homes, registered since 1997 and grown to a workforce of over 415 staff. Cleaners work under a Team Leader who inspects the site daily and briefs the Operations Manager by phone every day, so issues are caught the same day rather than at month end.",
    image:
      imgFloorCleaningTeam,
    includes: [
      "Floor cleaning procedures and sequences customised per site",
      "Dusting of tables, chairs, seats and other furniture",
      "Internal and external window cleaning",
      "External cleaning of the premises and walkways",
      "Washroom and common-area cleaning",
      "Machine scrubbing and polishing of hard floors",
      "Warning signage or section isolation displayed on wet or slippery floors",
    ],
    idealFor: [
      "Bank branches",
      "Commercial office buildings",
      "Hospitals & clinics",
      "Schools & colleges",
      "Churches and mosques",
    ],
    process: [
      {
        title: "Site survey",
        body: "We visit the premises, note the floor types, traffic levels and problem areas, then price against what the site actually needs.",
      },
      {
        title: "Custom schedule",
        body: "A cleaning schedule and task standard is agreed with you in writing before crews are deployed.",
      },
      {
        title: "Deployment",
        body: "Vetted, in-house trained cleaners are placed under a Team Leader with the correct machines, materials and PPE. All materials are sourced from licensed, reputable suppliers, expired or defective stock is never used.",
      },
      {
        title: "Daily inspection",
        body: "Team Leaders and Area Supervisors inspect the work and brief the Operations Manager by phone every day; complaints are captured and resolved with dispatch.",
      },
    ],
    schedule: "Daily, weekly or a custom schedule agreed per site",
    coverage: COVERAGE,
    availability: "Year-round",
  },
  {
    slug: "car-wash",
    name: "Car Wash, Interior & Exterior",
    category: "Cleaning",
    tagline: "On-site washing for corporate fleets and staff parking.",
    description:
      "Interior and exterior vehicle washing carried out at your compound. Usually bundled into an existing facility contract for banks and institutions with pool vehicles, but available as a standalone arrangement where the vehicle count justifies it.",
    image:
      imgVehiclesMessenger,
    includes: [
      "Exterior body wash, rims and tyre dressing",
      "Interior vacuuming of seats, carpets and boot",
      "Dashboard and console wipe-down",
      "Glass and mirror cleaning",
      "Scheduled fleet rounds with a wash register",
    ],
    idealFor: [
      "Bank and corporate fleets",
      "Institutional pool vehicles",
      "Staff parking bays",
      "Hotel and hospital vehicles",
    ],
    process: [
      {
        title: "Fleet count",
        body: "We confirm the number of vehicles, wash frequency and where water and drainage are available.",
      },
      {
        title: "Rota agreed",
        body: "A wash rota is set so vehicles are cleaned without disrupting operations.",
      },
      {
        title: "On-site washing",
        body: "Attendants wash on your premises using licensed, reputable products that are safe on paintwork and upholstery.",
      },
      {
        title: "Register signed",
        body: "Each wash is logged and signed off by your transport or admin officer.",
      },
    ],
    schedule: "Scheduled rounds or on demand",
    coverage: COVERAGE,
    availability: "Year-round",
  },
  {
    slug: "carpet-upholstery-cleaning",
    name: "Carpet & Upholstery Cleaning",
    category: "Cleaning",
    tagline: "Deep extraction cleaning for carpets and soft furnishings.",
    description:
      "Deep cleaning for wall-to-wall carpets, rugs, office seating and other soft furnishings using extraction machines and licensed products only. Booked either inside a routine cleaning contract or as a one-off ahead of an inspection, audit or handover.",
    image:
      imgOfficeMopping,
    includes: [
      "Pre-inspection of fibres and stain types",
      "Vacuuming, pre-spray and agitation",
      "Hot water extraction with industrial machines",
      "Spot and stain treatment",
      "Upholstery, workstation panels and chair cleaning",
      "Controlled drying with warning signage displayed while floors dry",
    ],
    idealFor: [
      "Boardrooms",
      "Banking halls",
      "Hotel rooms",
      "Offices ahead of audits",
      "Residences",
    ],
    process: [
      {
        title: "Assessment",
        body: "We check fibre type and soiling so the right chemical and dwell time are used.",
      },
      {
        title: "Scheduling",
        body: "Work is normally booked after hours or over a weekend to avoid downtime.",
      },
      {
        title: "Extraction",
        body: "Carpets and seats are cleaned with machine extraction, not surface wiping.",
      },
      {
        title: "Drying & handover",
        body: "Areas are ventilated, signage displayed while surfaces are wet, and the space handed back once safe to walk on.",
      },
    ],
    schedule: "One-off or periodic, usually quarterly",
    coverage: COVERAGE,
    availability: "Seasonal",
  },
  {
    slug: "pest-control-fumigation",
    name: "Pest Control & Fumigation Services",
    category: "Pest Control & Fumigation",
    tagline: "Licensed treatment plans set per site, not applied blanket-wide.",
    description:
      "Pest control and fumigation headed by a technician trained in chemical engineering at Kenya Polytechnic, with prior experience at Antipest (Mombasa) and Pestlab (Kitale) and over six years in the field. All products are sourced from licensed suppliers and treatment plans are written for each individual site, never a blanket spray.",
    image:
      imgPestControlGarden,
    includes: [
      "Cockroach, ant, bedbug, flea and termite treatment",
      "Rodent control, baiting and bait-station mapping",
      "Mosquito and fly control including residual spraying",
      "Snake and crawling-pest deterrent treatment",
      "Warehouse and store fumigation",
      "Full PPE for technicians and site signage/isolation where required",
      "Treatment certificate issued after every visit",
    ],
    idealFor: [
      "Hospitals",
      "Food handling areas and canteens",
      "Warehouses and stores",
      "Schools and hostels",
      "Banks and offices",
      "Private homes",
    ],
    process: [
      {
        title: "Inspection",
        body: "The technician identifies the pest, entry points and harbourage areas before quoting.",
      },
      {
        title: "Treatment plan",
        body: "A written plan sets the chemical, dosage, re-entry period and follow-up interval for your site.",
      },
      {
        title: "Application",
        body: "Technicians work in full PPE, with signage and isolation where required for occupant safety, using only licensed products.",
      },
      {
        title: "Follow-up",
        body: "A monitoring visit confirms the knock-down and the plan is adjusted if activity persists.",
      },
    ],
    schedule: "One-off treatment or a maintenance contract with scheduled visits",
    coverage: COVERAGE,
    availability: "Year-round",
  },
  {
    slug: "sanitary-services",
    name: "Sanitary Services",
    category: "Cleaning",
    tagline: "Washroom hygiene and sanitary bin cover with attendant support.",
    description:
      "Washroom hygiene, sanitary bin servicing and attendant cover for banks, hospitals and commercial buildings. Overseen by a Head of Sanitary Services who spent over 25 years running Rentokil Initial's Nakuru branch and has attended various sanitary hygiene courses.",
    image:
      imgShowerCleaning,
    includes: [
      "Sanitary bin supply, exchange and hygienic disposal",
      "Air fresheners and dispenser servicing",
      "Soap, tissue and hand-towel replenishment",
      "Urinal sanitisers and drain treatment",
      "Daily washroom attendant cover where required",
      "Service record card kept in each washroom",
      "Waste disposed of in line with local authority and NEMA regulations",
    ],
    idealFor: [
      "Bank branches",
      "Hospitals",
      "Shopping and office complexes",
      "Learning institutions",
      "Government offices",
    ],
    process: [
      {
        title: "Unit count",
        body: "We count washrooms, cubicles and dispensers to size the service correctly.",
      },
      { title: "Installation", body: "Bins, dispensers and sanitisers are fitted and dated." },
      {
        title: "Scheduled servicing",
        body: "Units are exchanged and washrooms serviced on a fixed cycle, signed off on the record card.",
      },
      {
        title: "Compliant disposal",
        body: "Waste is removed and disposed of in line with local authority and NEMA requirements.",
      },
    ],
    schedule: "Fixed servicing cycle, with daily attendant cover available",
    coverage: COVERAGE,
    availability: "Year-round",
  },
  {
    slug: "garden-ground-maintenance",
    name: "Garden & Ground Maintenance",
    category: "Grounds & Waste",
    tagline: "Grass cutting, fence trimming and compound upkeep.",
    description:
      "Compound upkeep led by a team head who worked eleven years as Head Gardener at Palm Beach Hotel Mombasa and later as a caretaker at Khamis High School. Work covers grass cutting, hedge and fence trimming, flower beds and general external presentation, keeping every client site free from litter and with grass properly maintained.",
    image:
      imgPestControlGarden,
    includes: [
      "Grass cutting with brush cutters and mowers",
      "Hedge, fence line and shrub trimming",
      "Flower bed preparation, planting and weeding",
      "Pruning of trees and removal of cuttings",
      "Driveway, walkway and parking-area sweeping",
      "Seasonal replanting and lawn recovery",
    ],
    idealFor: [
      "Institutional compounds",
      "Bank and office grounds",
      "Hospital grounds",
      "Schools",
      "Private residences",
    ],
    process: [
      {
        title: "Walk-through",
        body: "We measure the grounds and note tree lines, hedges and problem patches.",
      },
      {
        title: "Visit frequency",
        body: "A visit cycle is agreed based on how fast the grounds grow through the season.",
      },
      {
        title: "Groundsmen deployed",
        body: "Trained groundsmen work with serviced machinery and correct protective equipment.",
      },
      {
        title: "Clean removal",
        body: "All cuttings are cleared and disposed of, leaving the compound free from litter and presentable.",
      },
    ],
    schedule: "Regular scheduled visits under contract",
    coverage: COVERAGE,
    availability: "Year-round",
  },
  {
    slug: "garbage-collection-disposal",
    name: "Garbage Collection & Disposal",
    category: "Grounds & Waste",
    tagline: "Scheduled waste collection handled to NEMA requirements.",
    description:
      "Scheduled collection and disposal of general waste from client sites, handled in line with local authority and NEMA regulations so premises stay compliant, not just tidy. Waste storage areas are kept clean, leak-free and correctly signed, and any leakage is handled and disposed of properly.",
    image:
      imgWasteBins,
    includes: [
      "Supply and servicing of waste bins and liners",
      "Scheduled collection rounds from your site",
      "Segregation of general and hazardous streams where applicable",
      "Cleaning and disinfection of bin storage areas",
      "Disposal at approved sites in line with NEMA rules",
      "Collection log maintained for your records",
    ],
    idealFor: [
      "Hospitals and clinics",
      "Commercial buildings",
      "Learning institutions",
      "Restaurants and canteens",
      "Residential estates",
    ],
    process: [
      {
        title: "Volume assessment",
        body: "We estimate waste volumes and identify where bins should be positioned.",
      },
      {
        title: "Collection plan",
        body: "Round days and times are set so waste never accumulates on site.",
      },
      {
        title: "Collection",
        body: "Crews collect, replace liners and clean the storage area on each visit.",
      },
      {
        title: "Compliant disposal",
        body: "Waste is transported and disposed of at approved sites in line with local authority and NEMA regulations; the log is available on request.",
      },
    ],
    schedule: "Fixed weekly or daily collection rounds",
    coverage: COVERAGE,
    availability: "Year-round",
  },
  {
    slug: "messengerial-services",
    name: "Messengerial Services",
    category: "Support Staffing",
    tagline: "Vetted messengers placed for deliveries and office logistics.",
    description:
      "Screened messengers placed with corporate and institutional clients for deliveries, bank runs, errands and internal office logistics. Every candidate provides a national ID, academic testimonials and reference letters we personally call to verify, plus a certificate of good conduct from the C.I.D. before placement.",
    image:
      imgVehiclesMessenger,
    includes: [
      "Recruitment, vetting and reference verification by phone",
      "Certificate of good conduct from the C.I.D. on file",
      "Uniformed, supervised placement on your site",
      "Document dispatch, collection and bank runs",
      "Internal mail and office logistics support",
      "Cover arranged during leave or absence",
    ],
    idealFor: [
      "Banks",
      "Law firms and corporates",
      "Government offices",
      "Learning institutions",
      "NGOs",
    ],
    process: [
      {
        title: "Role brief",
        body: "We agree the duties, working hours and the level of trust the role requires.",
      },
      {
        title: "Vetting",
        body: "Candidates are screened on national ID, academic testimonials, verified references and a C.I.D. certificate of good conduct.",
      },
      {
        title: "Placement",
        body: "The messenger reports to your office under our supervision structure.",
      },
      {
        title: "Supervision",
        body: "Area Supervisors review performance and replace or retrain where needed.",
      },
    ],
    schedule: "Full-time or part-time placement per client agreement",
    coverage: COVERAGE,
    availability: "Year-round",
  },
  {
    slug: "tea-making-services",
    name: "Tea Making Services",
    category: "Support Staffing",
    tagline: "Trained tea and kitchen staff placed in offices and institutions.",
    description:
      "Tea-girls and tea-boys placed in offices, banks and institutions as part of facility support staffing. They are trained in hygiene and service standards at our in-house training unit and supervised through the same Team Leader structure as our cleaning crews.",
    image:
      imgOfficeReception,
    includes: [
      "Preparation and service of tea, coffee and refreshments",
      "Kitchenette cleaning and utensil hygiene",
      "Boardroom and meeting service support",
      "Stock control of kitchen consumables",
      "Food-handling hygiene training",
      "Same national ID, reference and C.I.D. vetting standard as all other staff",
    ],
    idealFor: [
      "Bank branches",
      "Corporate offices",
      "Boardrooms",
      "Government departments",
      "Colleges",
    ],
    process: [
      {
        title: "Requirement",
        body: "We confirm headcount, service times and any boardroom or meeting duties.",
      },
      {
        title: "Selection",
        body: "Candidates are selected for hygiene training and vetted before placement.",
      },
      { title: "Placement", body: "Staff report on site in uniform under a named Team Leader." },
      {
        title: "Review",
        body: "Supervisors check standards and handle cover during leave or sickness.",
      },
    ],
    schedule: "Full-time placement per client agreement",
    coverage: COVERAGE,
    availability: "Year-round",
  },
  {
    slug: "cleaning-materials-supply",
    name: "Supply of Cleaning Materials & Detergents",
    category: "Supplies",
    tagline: "Licensed detergents, consumables and equipment delivered to site.",
    description:
      "Supply of all types of cleaning materials, detergents and washroom consumables, purchased only from licensed and reputable sources. Expired or defective stock is never accepted. Useful for clients who want one supplier for both labour and consumables.",
    image:
      imgSuppliesStore,
    includes: [
      "Floor cleaners, disinfectants and degreasers",
      "Hand wash, sanitiser, tissue and hand towels",
      "Mops, buckets, brooms, dusters and microfibre cloths",
      "Bin liners and waste handling consumables",
      "Machines: scrubbers, vacuums and brush cutters",
      "Scheduled delivery through our store-keeping team",
    ],
    idealFor: [
      "Facilities running their own crews",
      "Institutions with central stores",
      "Hotels and hospitals",
      "Estate managers",
    ],
    process: [
      {
        title: "Requisition",
        body: "You send your list, or we build one from a survey of the site.",
      },
      {
        title: "Quotation",
        body: "We quote per item with pack sizes and bulk rates where volume allows.",
      },
      {
        title: "Delivery",
        body: "Stock is dispatched from our store to your site with a delivery note.",
      },
      {
        title: "Replenishment",
        body: "Recurring deliveries are scheduled so you never run dry mid-month.",
      },
    ],
    schedule: "One-off or scheduled bulk supply",
    coverage: COVERAGE,
    availability: "Year-round",
  },
  {
    slug: "commercial-cleaning",
    name: "Commercial Cleaning",
    category: "Cleaning",
    tagline: "Contract cleaning built around how your business actually runs.",
    description:
      "Commercial cleaning for offices, retail premises, banks and corporate buildings, staffed by vetted crews under a Team Leader and priced against your traffic levels, floor types and operating hours rather than a fixed package.",
    image:
      imgFloorCleaningTeam,
    includes: [
      "Daily or scheduled office and floor cleaning",
      "Reception, boardroom and common-area upkeep",
      "Washroom servicing",
      "Window and glass cleaning",
      "Machine scrubbing and polishing of hard floors",
      "Warning signage on wet or slippery floors",
    ],
    idealFor: [
      "Corporate offices",
      "Bank branches",
      "Retail premises",
      "Business parks",
    ],
    process: [
      {
        title: "Site survey",
        body: "We walk the premises, note floor types and traffic, then price against what the site needs.",
      },
      {
        title: "Custom schedule",
        body: "A cleaning schedule and task standard is agreed in writing before crews are deployed.",
      },
      {
        title: "Deployment",
        body: "Vetted, in-house trained cleaners are placed under a Team Leader with the correct machines and materials.",
      },
      {
        title: "Daily inspection",
        body: "Team Leaders inspect the work and brief the Operations Manager daily.",
      },
    ],
    schedule: "Daily, weekly or a custom schedule agreed per site",
    coverage: COVERAGE,
    availability: "Year-round",
  },
  {
    slug: "facility-maintenance",
    name: "Facility Maintenance",
    category: "Grounds & Waste",
    tagline: "Day-to-day upkeep so a facility keeps running without anyone noticing.",
    description:
      "Ongoing facility upkeep covering grounds, waste handling and general site presentation, run by supervisors who check standards on a fixed schedule and report issues before they become bigger problems.",
    image:
      imgWasteBins,
    includes: [
      "Grounds and compound upkeep",
      "Scheduled waste collection and bin servicing",
      "Routine site walk-throughs and issue reporting",
      "Coordination with cleaning and pest control crews on the same site",
      "Compliant waste disposal in line with NEMA rules",
    ],
    idealFor: [
      "Institutional compounds",
      "Corporate campuses",
      "Hospitals",
      "Schools",
    ],
    process: [
      {
        title: "Walk-through",
        body: "We assess the site and agree what falls under routine maintenance.",
      },
      {
        title: "Schedule agreed",
        body: "A visit and reporting cycle is set so the site is checked regularly, not reactively.",
      },
      {
        title: "Crews deployed",
        body: "Grounds, waste and general upkeep tasks are carried out by trained staff.",
      },
      {
        title: "Reporting",
        body: "Supervisors log completed work and flag anything needing separate attention.",
      },
    ],
    schedule: "Regular scheduled visits under contract",
    coverage: COVERAGE,
    availability: "Year-round",
  },
  {
    slug: "specialized-services",
    name: "Specialized Services",
    category: "Supplies",
    tagline: "One-off and custom jobs outside the standard service list.",
    description:
      "Specialized, one-off or custom-scoped jobs for clients whose needs don't fit neatly into a standard package, quoted individually against the site visit and the client's brief.",
    image:
      imgSuppliesStore,
    includes: [
      "Custom-scoped cleaning or maintenance jobs",
      "Pre-event or post-event deep cleaning",
      "Handover and move-in/move-out cleaning",
      "Ad hoc supply of materials and equipment",
      "Combined labour and consumables arrangements",
    ],
    idealFor: [
      "One-off projects",
      "Clients with non-standard requirements",
      "Event organisers",
      "Property handovers",
    ],
    process: [
      {
        title: "Brief",
        body: "You describe the job and any deadline; we confirm scope on a site visit where needed.",
      },
      {
        title: "Quotation",
        body: "We price the job against the brief rather than a fixed package.",
      },
      {
        title: "Execution",
        body: "The right crew and materials are deployed for the specific job.",
      },
      {
        title: "Sign-off",
        body: "Work is inspected and handed over against the agreed brief.",
      },
    ],
    schedule: "One-off or as agreed per job",
    coverage: COVERAGE,
    availability: "Year-round",
  },
];

export const serviceNames = services.map((s) => s.name);

export const products: Product[] = services.map(
  ({ slug, name, category, description, image, availability }) => ({
    slug,
    name,
    category,
    description,
    image,
    availability,
  }),
);

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export const getServiceBySlug = getService;

export function getRelatedServices(slug: string, limit = 4): Service[] {
  const current = getService(slug);
  const others = services.filter((s) => s.slug !== slug);
  if (!current) return others.slice(0, limit);
  const sameCat = others.filter((s) => s.category === current.category);
  const rest = others.filter((s) => s.category !== current.category);
  return [...sameCat, ...rest].slice(0, limit);
}