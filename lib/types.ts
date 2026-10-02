export type ProspectStatus = "new" | "qualified" | "contacted" | "responded" | "meeting" | "partnership" | "not_interested";
export type OpportunityType = "customer_acquisition" | "brand_partnership";

export type Prospect = {
  id: string;
  name: string;
  category: string;
  subcategory?: string | null;
  distance_meters: number;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  status: ProspectStatus;
  customerPotential: "high" | "medium" | "low";
  partnershipPotential: "high" | "medium" | "low";
  signalCount: number;
};

export type PipelineRecord = {
  id: string;
  prospectId: string;
  opportunityType: OpportunityType;
  status: ProspectStatus;
  lastContactedAt?: string | null;
  nextFollowupAt?: string | null;
  notes?: string;
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
