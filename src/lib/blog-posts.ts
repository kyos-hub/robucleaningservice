import imgWelcomeToRobu from "@/assets/photos/robu-office-reception.jpg";
import imgCarpetUpholsteryCleaning from "@/assets/photos/robu-floor-cleaning-team.jpg";
import imgNewTeamMembers from "@/assets/photos/robu-hospital-corridor.jpg";
import imgSanitizationBestPractices from "@/assets/photos/robu-waste-bins.jpg";
import imgCompanyMilestone from "@/assets/photos/robu-hospital-hallway.jpg";
import imgGardenGroundMaintenance from "@/assets/photos/robu-pest-control-garden.jpg";

export type PostCategory = "News" | "Tips";

export const categories: PostCategory[] = ["News", "Tips"];

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: PostCategory;
  featured?: boolean;
  content?: string;
  /** Full article paragraphs. Falls back to `content` / `excerpt`. */
  body?: string[];
  readMinutes?: number;
}

export const posts: BlogPost[] = [
  {
    slug: "welcome-to-robu",
    title: "29 Years On: The Story of Robu Cleaning Services",
    excerpt:
      "Registered in 1997 with three employees, Robu Cleaning Services now runs a workforce of over 415 across six regions of Kenya.",
    image: imgWelcomeToRobu,
    date: "2026-08-15",
    category: "News",
    featured: true,
    content:
      "Robu Cleaning Services Limited was registered on 17th February 1997 under the Companies Registration of Business Names, Cap 499, Section 14, and was later incorporated on 4th February 2009 under Certificate No. 168246. What began with an initial workforce of just three employees has grown into a company of over 415 staff.\n\nToday, Robu is counted among the leading service providers in the North Rift, South Rift, Central Rift, Western, Nairobi, Mombasa and Nyanza regions. Our head office remains in Eldoret, on Elgeyo Road next to Wells Fargo, with a second office in Nairobi at Verdic House.\n\nThat growth has come from a simple discipline: every site is surveyed before we price it, every crew is trained in-house, and every day's work is reviewed. Our Team Leaders and Area Supervisors inspect the work on site and brief the Operations Manager by phone daily, so issues are caught and resolved the same day rather than at the end of the month.\n\nWe offer cleaning, pest control and fumigation, ground maintenance, messengerial and tea making services, and sanitary services to major banks, commercial buildings, learning institutions, private and public hospitals, religious institutions and private homes across Kenya. This blog will carry updates on our services, practical hygiene tips, and news from our teams on the ground.",
  },
  {
    slug: "how-we-keep-office-cleaning-standards-consistent",
    title: "How We Keep Cleaning Standards Consistent Across Every Site",
    excerpt:
      "A look at the daily supervision structure, team leaders, area supervisors and a Training & Quality Control Manager, that keeps our cleaning standards consistent site to site.",
    image: imgCarpetUpholsteryCleaning,
    date: "2026-08-20",
    category: "Tips",
    content:
      "Consistent cleaning standards across many different sites, banks, hospitals, offices, schools, don't happen by accident. They come from a supervision structure we've built and refined since 1997.\n\nEvery cleaning schedule is customised per site before crews are deployed. We look at floor types, traffic levels, dusting and window cleaning needs, and any problem areas specific to that building, and agree a written cleaning schedule with the client before work begins.\n\nOn site, cleaners report to a Team Leader, who in turn reports to an Area Supervisor. Both inspect the work daily. Any complaint raised by a client is captured and resolved, and the Team Leader or Area Supervisor briefs the Operations Manager by phone every single day, not weekly, not monthly. This is how problems get fixed before they become patterns.\n\nBehind this sits a dedicated Training and Quality Control Manager, responsible for the standards our cleaners are trained to and for auditing that those standards are actually being met on the ground. We also run a fully equipped in-house training unit at our Eldoret head office, so every cleaner, new or experienced, is trained the same way, to the same standard, regardless of which site they're placed at.\n\nWe use modern equipment, including floor cleaning machines and brush cutters, and we source all cleaning materials and detergents from licensed, reputable suppliers only, expired or defective stock is never accepted for use on a client site.",
  },
  {
    slug: "new-team-members",
    title: "Growing Our Team to Serve More of Kenya",
    excerpt:
      "From an initial team of three in 1997 to over 415 staff today, our growth has been driven by continuous in-house training and careful vetting of every new hire.",
    image: imgNewTeamMembers,
    date: "2026-08-18",
    category: "News",
    content:
      "Robu Cleaning Services started in 1997 with three employees. Today we employ over 415 people across our branch network in the North Rift, South Rift, Central Rift, Western, Nairobi, Mombasa and Nyanza regions, and that number keeps growing as we take on new sites and new clients.\n\nEvery new hire goes through the same vetting process, regardless of role. We collect national ID and academic testimonials, we call and verify reference letters from past employers ourselves rather than taking them at face value, and every employee is required to obtain a certificate of good conduct from the C.I.D. before they're placed on any client site.\n\nOnce hired, staff go through continuous training at our fully equipped in-house training unit at the Eldoret head office. We also involve our employees directly in drafting our workplace policies, and every employee reads and signs our rules and regulations, covering dress code, respect, punctuality and honesty, which we review annually.\n\nThis is the same standard whether someone is joining as a cleaner, a messenger, a tea-service attendant, a groundsman, or a pest control technician. It's how we've been able to grow the way we have while keeping the standards our clients expect.",
  },
  {
    slug: "sanitization-best-practices",
    title: "Sanitization Best Practices for Your Workplace",
    excerpt:
      "Practical guidance on washroom hygiene and sanitary bin servicing, drawn from decades of experience running sanitary services for banks and hospitals.",
    image: imgSanitizationBestPractices,
    date: "2026-08-12",
    category: "Tips",
    content:
      "Washroom hygiene is one of the most visible signals of how seriously a business takes cleanliness, and one of the easiest things to get wrong if it isn't run on a proper schedule.\n\nOur Sanitary Services division supplies and services sanitary bins, air fresheners, soap and tissue dispensers, and urinal sanitisers on a fixed servicing cycle, with a service record card kept in each washroom so the schedule is visible and accountable. For sites that need it, we also provide daily washroom attendant cover.\n\nA few practical principles we apply on every site: warning signage or section isolation is always displayed when floors are wet or slippery, to prevent falls. All our equipment and delivery vehicles are kept serviced, maintained and clean. Staff are issued proper personal protective equipment to protect them from both injury and health exposure while they work. And every cleaning material or detergent we use is sourced from a licensed, reputable supplier, we do not use expired or defective stock, on any site.\n\nWaste from washroom servicing is disposed of in line with local authority and NEMA regulations, not just tipped wherever is convenient. It's a detail that's easy to skip and important not to.\n\nThese aren't abstract policies for us, they're the same standards our Head of Sanitary Services has applied over more than 25 years running sanitary hygiene programmes at scale, before joining Robu.",
  },
  {
    slug: "company-milestone",
    title: "From Three Employees to a National Service Provider",
    excerpt:
      "Robu Cleaning Services has grown from a three-person team in 1997 to a workforce of over 415, serving banks, hospitals, and institutions across six regions of Kenya.",
    image: imgCompanyMilestone,
    date: "2026-08-10",
    category: "News",
    content:
      "When Robu Cleaning Services Limited was registered in February 1997, the entire company was three people. Incorporated formally in 2009 under Certificate No. 168246, the company has since grown to a workforce of over 415 employees, serving clients across the North Rift, South Rift, Central Rift, Western, Nairobi, Mombasa and Nyanza regions.\n\nThat growth has largely tracked the range of services we offer. What started as a cleaning company has expanded into pest control and fumigation, ground maintenance, garbage collection and disposal, messengerial services, tea making services, and full sanitary services, all delivered through the same supervision structure and in-house training standards, regardless of which service a client contracts us for.\n\nOur leadership team has brought deep sector experience into the business: our Head of Sanitary Services previously ran Rentokil Initial's Nakuru branch for over 25 years; our Head of Pest Control trained in chemical engineering at Kenya Polytechnic and worked with Antipest in Mombasa and Pestlab in Kitale before joining Robu; and our Head of Ground Maintenance spent eleven years as Head Gardener at Palm Beach Hotel Mombasa. That experience, combined with a training unit that runs continuously at our Eldoret head office, is what has let us scale without losing consistency on site.\n\nWe're proud of the growth, but more proud that the same daily-inspection, daily-phone-briefing discipline we started with in 1997 is still how every site is run today.",
  },
  {
    slug: "pest-control-technician-behind-our-fumigation-service",
    title: "Meet the Technician Behind Our Pest Control & Fumigation Service",
    excerpt:
      "Trained in chemical engineering with experience at Antipest and Pestlab, our Head of Pest Control explains how a proper treatment plan actually prevents pests, not just knocks them down once.",
    image: imgGardenGroundMaintenance,
    date: "2026-08-08",
    category: "Tips",
    content:
      "Effective pest control isn't a single spray visit, it's a plan, applied correctly and followed up on. Our pest control and fumigation service is headed by a technician trained in chemical engineering at Kenya Polytechnic, with prior experience at Antipest in Mombasa and Pestlab in Kitale, and over six years working specifically in pest control.\n\nEvery job starts with an inspection, not a quote. We identify the pest, the entry points, and the harbourage areas on the property before deciding on a treatment. From there, a written treatment plan sets out the chemical to be used, the correct dosage, the re-entry period for occupants, and the follow-up interval, because a plan that isn't followed up on rarely solves the underlying problem.\n\nAll products used are sourced from licensed suppliers only, and technicians work in full personal protective equipment, with signage and isolation where the site requires it for occupant safety. After treatment, we carry out a monitoring visit to confirm the pest activity has actually been knocked down, and adjust the plan if it hasn't.\n\nWe treat cockroaches, ants, bedbugs, fleas, termites, rodents, mosquitoes and flies, and provide warehouse and store fumigation, across hospitals, food handling areas, warehouses, schools, banks, offices and private homes, with a treatment certificate issued after every visit.",
  },
];

const WORDS_PER_MINUTE = 200;

/** Fills in derived fields so article pages always have body copy + read time. */
function hydrate(post: BlogPost): Required<Pick<BlogPost, "body" | "readMinutes">> & BlogPost {
  const body =
    post.body ??
    (post.content ? post.content.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean) : [post.excerpt]);
  const words = [post.excerpt, ...body].join(" ").split(/\s+/).length;
  return { ...post, body, readMinutes: post.readMinutes ?? Math.max(1, Math.round(words / WORDS_PER_MINUTE)) };
}

export function getPostBySlug(slug: string) {
  const post = posts.find((p) => p.slug === slug);
  return post ? hydrate(post) : undefined;
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = posts.find((p) => p.slug === slug);
  if (!current) return posts.slice(0, limit);
  const sameCat = posts.filter((p) => p.slug !== slug && p.category === current.category);
  const rest = posts.filter((p) => p.slug !== slug && p.category !== current.category);
  return [...sameCat, ...rest].slice(0, limit);
}