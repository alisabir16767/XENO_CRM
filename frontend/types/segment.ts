// types/segment.ts
export type RuleValue = string | number | boolean | null;

export type SegmentRule = {
  field: string;
  operator: string;
  value: RuleValue;
};

export interface Segment {
  _id: string;
  name: string;
  isActive: boolean;
  createdBy: string | null;
  segmentRule: SegmentRule[]; // Array of SegmentRule objects
  audienceSize: number;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSegmentDialogProps {
  segment: Segment;
  onSegmentUpdated: () => void;
}

export interface CreateSegmentDialogProps {
  onSegmentCreated: () => void;
}