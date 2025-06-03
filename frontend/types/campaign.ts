export type CampaignStatus = "pending" | "sent" | "delivered" | "failed";

export type Segment = {
  _id: string;
  name: string;
  audienceSize?: number;
};

export type Campaign = {
  _id: string;
  name: string;
  status: CampaignStatus;
  message: string;
  created_at?: string;
  createdAt?: string;
  updatedAt?: string;
  segmentId: string | Segment;
};

export type CampaignFormData = {
  name: string;
  segmentId: string;
  message: string;
  status: CampaignStatus; 
};