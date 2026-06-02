export type PropertyType = "sale" | "let" | "shortlet";
export type TitleType =
  | "C of O"
  | "Deed of Assignment"
  | "Governor's Consent"
  | "Deed of Conveyance";

export interface PriceBreakdown {
  rent: number;
  agencyFee: number;
  legalFee: number;
  cautionDeposit: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  phone: string;
  whatsapp: string;
  photo: string;
  specialisation: string;
  bio: string;
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  price: number;
  priceBreakdown?: PriceBreakdown;
  location: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  titleType: TitleType;
  features: string[];
  description: string;
  images: string[];
  agentId: string;
  featured: boolean;
}

export const agents: Agent[] = [
  {
    id: "agent-1",
    name: "Meridian Sales Team — GRA",
    role: "Residential Sales",
    phone: "2340000000000",
    whatsapp: "2340000000000",
    photo: "/images/agents/agent-1.jpg",
    specialisation: "GRA & Peter Odili Road",
    bio: "Our GRA desk handles residential sales and rentals across GRA Phases 1–3 and Peter Odili Road. Every listing comes with verified title documents and transparent, all-in pricing.",
  },
  {
    id: "agent-2",
    name: "Meridian Sales Team — Woji & Eliozu",
    role: "Residential Sales",
    phone: "2340000000000",
    whatsapp: "2340000000000",
    photo: "/images/agents/agent-2.jpg",
    specialisation: "Woji, Eliozu & Ada George",
    bio: "Our mainland desk covers mid-market homes and rentals across Woji, Eliozu, and Ada George — honest guidance, verified titles, and no hidden fees.",
  },
  {
    id: "agent-3",
    name: "Meridian Sales Team — Commercial",
    role: "Commercial & Investment",
    phone: "2340000000000",
    whatsapp: "2340000000000",
    photo: "/images/agents/agent-3.jpg",
    specialisation: "Trans-Amadi & Investment Properties",
    bio: "Our commercial desk focuses on investment-grade and commercial property across Trans-Amadi and Rumuola, working with developers and diaspora investors.",
  },
];

export const properties: Property[] = [
  {
    id: "prop-001",
    title: "5-Bedroom Fully Detached Duplex with BQ",
    type: "sale",
    price: 280000000,
    location: "GRA Phase 2, Port Harcourt",
    area: "gra",
    bedrooms: 5,
    bathrooms: 6,
    size: 650,
    titleType: "C of O",
    features: [
      "All rooms ensuite",
      "Boys Quarters (BQ)",
      "POP ceiling throughout",
      "Italian floor tiles",
      "Fitted kitchen with modern appliances",
      "Federal light (Band A)",
      "32KVA soundproof Mikano generator",
      "Inverter + solar backup",
      "CCTV surveillance system",
      "Gated estate with 24/7 security",
      "Ample parking for 4 cars",
      "Landscaped garden",
      "100% privacy",
      "Tarred road access",
    ],
    description:
      "This exquisitely built 5-bedroom fully detached duplex is nestled in the heart of GRA Phase 2, Port Harcourt's most prestigious residential address. Tastefully finished to the highest standard, the property sits on a generous 650sqm plot within a serene, highly secured environment. Ideal for oil and gas executives, diplomats, and top-tier professionals seeking luxury living in a highbrow neighbourhood. The property features a spacious family lounge, a study room, a home office, and a separate boys quarters — perfect for corporate staffers and families requiring maximum comfort and privacy. Title is Governor's Consent, available for inspection. Serious buyers only.",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    agentId: "agent-1",
    featured: true,
  },
  {
    id: "prop-002",
    title: "4-Bedroom Semi-Detached Duplex",
    type: "let",
    price: 8000000,
    priceBreakdown: {
      rent: 8000000,
      agencyFee: 800000,
      legalFee: 800000,
      cautionDeposit: 500000,
    },
    location: "Woji, Port Harcourt",
    area: "woji",
    bedrooms: 4,
    bathrooms: 4,
    size: 420,
    titleType: "Deed of Assignment",
    features: [
      "All rooms ensuite",
      "POP ceiling",
      "Fitted kitchen",
      "Federal light",
      "Inverter backup",
      "Gated estate",
      "24/7 security",
      "CCTV",
      "Tarred road",
      "Borehole",
      "Ample parking",
      "Serene environment",
    ],
    description:
      "Well-finished 4-bedroom semi-detached duplex located in a serene, gated estate in Woji. This tastefully finished property is ideal for mid-senior oil and gas staff, bank executives, and business owners seeking a comfortable, secure family home in a highbrow neighbourhood with easy accessibility to Trans-Amadi, Peter Odili Road, and the Port Harcourt city centre. All rooms are ensuite with quality fittings throughout. Available immediately. Serious tenants only — company staff, executives, and business owners preferred.",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=800",
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800",
    ],
    agentId: "agent-2",
    featured: true,
  },
  {
    id: "prop-003",
    title: "3-Bedroom Flat — Fully Furnished",
    type: "shortlet",
    price: 120000,
    location: "GRA Phase 3, Port Harcourt",
    area: "gra",
    bedrooms: 3,
    bathrooms: 3,
    size: 220,
    titleType: "C of O",
    features: [
      "Fully furnished",
      "All rooms ensuite",
      "Wi-Fi internet",
      "24/7 power supply",
      "Air conditioning in all rooms",
      "Smart TV",
      "Fully equipped kitchen",
      "Washing machine",
      "CCTV",
      "Secure estate",
      "Dedicated parking",
      "Daily housekeeping available",
    ],
    description:
      "Luxuriously furnished 3-bedroom serviced apartment in the prestigious GRA Phase 3. Perfect for corporate travellers, oil and gas contractors, expatriates, and diaspora returnees seeking premium short-let accommodation in Port Harcourt's most exclusive neighbourhood. The apartment features a fully equipped kitchen, smart TVs in every room, high-speed Wi-Fi, and 24/7 uninterrupted power supply. Minimum stay 2 nights. Weekly and monthly rates available on request.",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    agentId: "agent-1",
    featured: true,
  },
  {
    id: "prop-004",
    title: "6-Bedroom Fully Detached Mansion",
    type: "sale",
    price: 550000000,
    location: "Old GRA, Port Harcourt",
    area: "gra",
    bedrooms: 6,
    bathrooms: 7,
    size: 900,
    titleType: "C of O",
    features: [
      "All rooms ensuite",
      "2 Boys Quarters",
      "Swimming pool",
      "Home cinema",
      "Smart home automation",
      "POP ceiling throughout",
      "Italian marble floors",
      "Fitted kitchen with island",
      "Federal light (Band A)",
      "45KVA soundproof generator",
      "Solar power system",
      "CCTV surveillance",
      "Electric perimeter fence",
      "Gated with guard house",
      "Landscaped compound",
      "4-car garage",
    ],
    description:
      "A rare opportunity to acquire this magnificent 6-bedroom fully detached mansion in Old GRA — Port Harcourt's most exclusive and prestigious address. Exquisitely built and finished to international standards, this property represents the pinnacle of luxury living in Rivers State. Suitable for top oil company executives, government officials, diplomats, and high-net-worth individuals. The property features a swimming pool, home cinema, smart home automation, and two separate boys quarters. Title is C of O. Viewing strictly by appointment. Serious buyers with proof of funds only.",
    images: [
      "/properties/propertyimg1.jpg",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    agentId: "agent-1",
    featured: true,
  },
  {
    id: "prop-005",
    title: "3-Bedroom Terraced Duplex",
    type: "let",
    price: 3500000,
    priceBreakdown: {
      rent: 3500000,
      agencyFee: 350000,
      legalFee: 350000,
      cautionDeposit: 300000,
    },
    location: "Eliozu, Port Harcourt",
    area: "eliozu",
    bedrooms: 3,
    bathrooms: 3,
    size: 280,
    titleType: "Deed of Assignment",
    features: [
      "All rooms ensuite",
      "POP ceiling",
      "Fitted kitchen",
      "Inverter backup",
      "Gated estate",
      "Security",
      "Borehole",
      "Good road network",
      "Easy accessibility",
    ],
    description:
      "Tastefully finished 3-bedroom terraced duplex in a well-secured estate in Eliozu. Ideal for young professionals, mid-level oil services workers, and families seeking a comfortable, affordable home in a rapidly developing neighbourhood with excellent road network and easy access to major Port Harcourt business districts.",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800",
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    ],
    agentId: "agent-2",
    featured: false,
  },
  {
    id: "prop-006",
    title: "2-Bedroom Serviced Apartment",
    type: "shortlet",
    price: 85000,
    location: "Woji, Port Harcourt",
    area: "woji",
    bedrooms: 2,
    bathrooms: 2,
    size: 140,
    titleType: "Deed of Conveyance",
    features: [
      "Fully furnished",
      "All rooms ensuite",
      "Wi-Fi internet",
      "24/7 power supply",
      "Air conditioning",
      "Smart TV",
      "Fully equipped kitchen",
      "CCTV",
      "Secure compound",
      "Parking space",
    ],
    description:
      "Tastefully furnished 2-bedroom serviced apartment in Woji. Perfect for corporate travellers, contractors, and weekend guests. Features 24/7 power supply, high-speed Wi-Fi, and a fully equipped kitchen. Minimum 2-night stay. Monthly rates available for long-stay guests.",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800",
    ],
    agentId: "agent-2",
    featured: false,
  },
  {
    id: "prop-007",
    title: "Commercial Office Space — Open Plan",
    type: "let",
    price: 12000000,
    priceBreakdown: {
      rent: 12000000,
      agencyFee: 1200000,
      legalFee: 1200000,
      cautionDeposit: 1000000,
    },
    location: "Trans-Amadi, Port Harcourt",
    area: "trans-amadi",
    bedrooms: 0,
    bathrooms: 4,
    size: 500,
    titleType: "C of O",
    features: [
      "Open plan layout",
      "4 executive offices",
      "Conference room",
      "Reception area",
      "Federal light",
      "Generator backup",
      "Central air conditioning",
      "Fibre internet ready",
      "CCTV",
      "Ample parking",
      "24/7 security",
      "Tarred road",
    ],
    description:
      "Premium open-plan commercial office space on the Trans-Amadi industrial corridor — Port Harcourt's primary commercial and oil services hub. Ideal for oil and gas servicing companies, engineering firms, logistics operators, and corporate headquarters seeking a highly strategic, accessible location. The space features 4 executive offices, a conference room, reception area, central air conditioning, and ample parking. Available immediately.",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800",
      "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800",
    ],
    agentId: "agent-3",
    featured: true,
  },
  {
    id: "prop-008",
    title: "4-Bedroom Detached Bungalow",
    type: "sale",
    price: 95000000,
    location: "Ada George, Port Harcourt",
    area: "ada-george",
    bedrooms: 4,
    bathrooms: 4,
    size: 380,
    titleType: "Deed of Assignment",
    features: [
      "All rooms ensuite",
      "POP ceiling",
      "Fitted kitchen",
      "Borehole",
      "Inverter backup",
      "Gated compound",
      "Ample parking",
      "Good road network",
      "Tarred road access",
    ],
    description:
      "Well-finished 4-bedroom detached bungalow in a serene neighbourhood in Ada George. Suitable for families, young professionals, and first-time buyers seeking a quality home in a rapidly developing area with good road network and easy access to major Port Harcourt districts. Title is Deed of Assignment. Priced for a quick sale.",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      "https://images.unsplash.com/photo-1575517111478-7f6afd0973db?w=800",
      "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
    ],
    agentId: "agent-2",
    featured: false,
  },
  {
    id: "prop-009",
    title: "Land — 2 Plots, Dry Land",
    type: "sale",
    price: 45000000,
    location: "Eneka, Port Harcourt",
    area: "eneka",
    bedrooms: 0,
    bathrooms: 0,
    size: 1200,
    titleType: "Governor's Consent",
    features: [
      "Dry land — no flooding",
      "Gazette excision",
      "Tarred road frontage",
      "Electricity available",
      "Survey plan available",
      "2 plots (600sqm each)",
      "Good for residential development",
      "Fast-appreciating area",
      "Easy accessibility",
    ],
    description:
      "Rare opportunity to acquire 2 plots of dry, gazette-excised land in the rapidly developing Eneka corridor — one of Port Harcourt's fastest-appreciating real estate markets. Ideal for residential development, land banking, or investment. Title is Governor's Consent with survey plan available. No flooding history. Tarred road frontage. This is a distress sale — serious buyers only. You blink, you miss.",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800",
      "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=800",
      "https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800",
    ],
    agentId: "agent-3",
    featured: false,
  },
  {
    id: "prop-010",
    title: "5-Bedroom Terrace Duplex with Pool",
    type: "sale",
    price: 420000000,
    location: "Peter Odili Road, Port Harcourt",
    area: "peter-odili",
    bedrooms: 5,
    bathrooms: 6,
    size: 580,
    titleType: "C of O",
    features: [
      "Swimming pool",
      "All rooms ensuite",
      "Boys Quarters",
      "POP ceiling",
      "Italian tiles",
      "Fitted kitchen",
      "Federal light (Band A)",
      "40KVA generator",
      "Inverter + solar",
      "Smart home features",
      "CCTV",
      "Electric fence",
      "Gated estate",
      "3-car garage",
    ],
    description:
      "Exquisitely built 5-bedroom terrace duplex with a private swimming pool, located in a prestigious gated estate on Peter Odili Road — one of Port Harcourt's most sought-after addresses. Finished to international standards with Italian tiles, smart home features, and premium fittings throughout. Suitable for top executives, corporate bodies, expatriates, and diaspora buyers seeking a world-class home in Port Harcourt. Title is C of O. Viewing by appointment only.",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=800",
    ],
    agentId: "agent-1",
    featured: true,
  },
  {
    id: "prop-011",
    title: "3-Bedroom Flat — For Rent",
    type: "let",
    price: 1800000,
    priceBreakdown: {
      rent: 1800000,
      agencyFee: 180000,
      legalFee: 180000,
      cautionDeposit: 200000,
    },
    location: "Rumuola, Port Harcourt",
    area: "rumuola",
    bedrooms: 3,
    bathrooms: 2,
    size: 180,
    titleType: "Deed of Conveyance",
    features: [
      "Spacious rooms",
      "Fitted kitchen",
      "Borehole",
      "Prepaid meter",
      "Secure compound",
      "Parking space",
      "Good road network",
    ],
    description:
      "Spacious 3-bedroom flat in a well-maintained compound in Rumuola. Ideal for young families and professionals seeking affordable, comfortable accommodation with good road network and easy access to Port Harcourt city centre, GRA, and Trans-Amadi.",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      "https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?w=800",
      "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800",
      "https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800",
    ],
    agentId: "agent-2",
    featured: false,
  },
  {
    id: "prop-012",
    title: "Warehouse — 800sqm with Office Block",
    type: "let",
    price: 18000000,
    priceBreakdown: {
      rent: 18000000,
      agencyFee: 1800000,
      legalFee: 1800000,
      cautionDeposit: 2000000,
    },
    location: "Trans-Amadi Industrial Layout, Port Harcourt",
    area: "trans-amadi",
    bedrooms: 0,
    bathrooms: 3,
    size: 800,
    titleType: "C of O",
    features: [
      "800sqm warehouse floor",
      "Attached office block",
      "Heavy-duty roller doors",
      "3-phase electricity",
      "Borehole",
      "Ample truck parking",
      "24/7 security",
      "CCTV",
      "Tarred road",
      "Easy truck access",
      "Highly strategic location",
    ],
    description:
      "Premium 800sqm warehouse with attached office block on the Trans-Amadi Industrial Layout — Port Harcourt's primary oil services and logistics hub. Ideal for oil and gas servicing companies, engineering firms, logistics operators, and manufacturing businesses requiring large storage and operational space with excellent truck access and highly strategic location. Available immediately. Title C of O.",
    images: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
      "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800",
      "https://images.unsplash.com/photo-1565793979732-c87ffdf551ba?w=800",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
    ],
    agentId: "agent-3",
    featured: false,
  },
];

export const getPropertyById = (id: string): Property | undefined => {
  return properties.find((p) => p.id === id);
};

export const getFeaturedProperties = (): Property[] => {
  return properties.filter((p) => p.featured);
};

export const getPropertiesByArea = (area: string): Property[] => {
  return properties.filter((p) => p.area === area);
};

export const getPropertiesByType = (type: PropertyType): Property[] => {
  return properties.filter((p) => p.type === type);
};

export const getAgentById = (id: string): Agent | undefined => {
  return agents.find((a) => a.id === id);
};

export const formatPrice = (price: number, type: PropertyType): string => {
  const formatted = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  if (type === "let") return `${formatted}/year`;
  if (type === "shortlet") return `${formatted}/night`;
  return formatted;
};
