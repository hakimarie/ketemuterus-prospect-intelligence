export type Prospect = {
  id: string;
  name: string;
  category: string;
  subcategory?: string | null;
  distance_meters: number;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  status: string;
  customerPotential: "high" | "medium" | "low";
  partnershipPotential: "high" | "medium" | "low";
  signalCount: number;
};

export type ProjectSummary = {
  clientName: string;
  outletName: string;
  projectName: string;
  radiusMeters: number;
  prospects: number;
  customerAcquisition: number;
  brandPartnership: number;
  highPotential: number;
};