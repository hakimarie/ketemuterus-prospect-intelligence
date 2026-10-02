import type { PipelineRecord, Prospect, ProjectSummary } from "./types";

export const mockSummary: ProjectSummary = {
  clientName: "Six Hands",
  outletName: "Six Hands — PIM 3",
  projectName: "Local Ecosystem & Partnership Intelligence",
  radiusMeters: 3000,
  prospects: 10,
  customerAcquisition: 10,
  brandPartnership: 10,
  highPotential: 8,
};

export const mockProspects: Prospect[] = [
  { id:"1", name:"PIM Premium Pilates", category:"Pilates", distance_meters:700, status:"qualified", customerPotential:"high", partnershipPotential:"high", signalCount:2 },
  { id:"2", name:"South Jakarta Wellness Club", category:"Gym", distance_meters:1100, status:"qualified", customerPotential:"high", partnershipPotential:"medium", signalCount:2 },
  { id:"3", name:"Urban Yoga House", category:"Yoga", distance_meters:1500, status:"new", customerPotential:"medium", partnershipPotential:"medium", signalCount:2 },
  { id:"4", name:"Jakarta Wellness Clinic", category:"Wellness Clinic", distance_meters:1800, status:"new", customerPotential:"medium", partnershipPotential:"high", signalCount:2 },
  { id:"5", name:"South Jakarta Coworking", category:"Coworking", distance_meters:2100, status:"contacted", customerPotential:"high", partnershipPotential:"medium", signalCount:2 },
  { id:"6", name:"Jakarta Creative Studio", category:"Creative Agency", distance_meters:2400, status:"new", customerPotential:"medium", partnershipPotential:"medium", signalCount:1 },
  { id:"7", name:"Premium Lifestyle Store", category:"Premium Retail", distance_meters:900, status:"new", customerPotential:"medium", partnershipPotential:"medium", signalCount:2 },
  { id:"8", name:"Pondok Indah Business Hotel", category:"Hotel", distance_meters:1300, status:"new", customerPotential:"medium", partnershipPotential:"high", signalCount:1 },
  { id:"9", name:"South Jakarta Running Community", category:"Running Community", distance_meters:2700, status:"new", customerPotential:"medium", partnershipPotential:"high", signalCount:1 },
  { id:"10", name:"Healthy Lifestyle Community", category:"Community", distance_meters:2900, status:"new", customerPotential:"low", partnershipPotential:"low", signalCount:1 },
];

export const mockPipeline: PipelineRecord[] = [
  { id:"pl-1", prospectId:"1", opportunityType:"customer_acquisition", status:"qualified", notes:"Explore member referral offer." },
  { id:"pl-2", prospectId:"1", opportunityType:"brand_partnership", status:"contacted", lastContactedAt:"2026-09-29", nextFollowupAt:"2026-10-06", notes:"Initial partnership outreach." },
  { id:"pl-3", prospectId:"2", opportunityType:"customer_acquisition", status:"qualified", notes:"Potential post-workout dining offer." },
  { id:"pl-4", prospectId:"4", opportunityType:"brand_partnership", status:"new", notes:"Research clinic partnership contact." },
  { id:"pl-5", prospectId:"5", opportunityType:"customer_acquisition", status:"contacted", lastContactedAt:"2026-09-30", nextFollowupAt:"2026-10-07", notes:"Corporate lunch hypothesis." },
  { id:"pl-6", prospectId:"9", opportunityType:"brand_partnership", status:"meeting", nextFollowupAt:"2026-10-08", notes:"Discuss community activation." },
];
