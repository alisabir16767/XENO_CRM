'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import axios from "axios";

// FIX 1: Correct SegmentRule typing
interface SegmentRule {
  field: string;
  operator: string;
  value: string | number | boolean | null;
}

interface Segment {
  _id: string;
  name: string;
  audienceSize: number;
  segmentRule: SegmentRule[];
}

interface UpdateSegmentDialogProps {
  segment: Segment;
  onSegmentUpdated: () => void;
}

// FIX 2: FormRule.value now supports all types as strings (form input is string)
interface FormRule {
  field: string;
  operator: string;
  value: string;
}

interface FormData {
  name: string;
  audienceSize: string;
  rules: FormRule[];
}

export default function UpdateSegmentDialog({ segment, onSegmentUpdated }: UpdateSegmentDialogProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    audienceSize: '',
    rules: [{ field: '', operator: '', value: '' }],
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (segment && open) {
      setFormData({
        name: segment.name,
        audienceSize: segment.audienceSize.toString(),
        rules: segment.segmentRule.map(rule => ({
          field: rule.field || '',
          operator: rule.operator ? rule.operator.replace('$', '') : '',
          value:
            typeof rule.value === 'boolean'
              ? rule.value.toString()
              : rule.value !== null
              ? rule.value.toString()
              : '',
        })),
      });
    }
  }, [segment, open]);

  const handleRuleChange = (index: number, key: keyof FormRule, value: string) => {
    const updatedRules = [...formData.rules];
    updatedRules[index] = { ...updatedRules[index], [key]: value };
    setFormData({ ...formData, rules: updatedRules });
  };

  const addRule = () => {
    setFormData({
      ...formData,
      rules: [...formData.rules, { field: '', operator: '', value: '' }],
    });
  };

  const removeRule = (index: number) => {
    const updatedRules = formData.rules.filter((_, i) => i !== index);
    setFormData({ ...formData, rules: updatedRules });
  };

  const isNumericString = (value: string): boolean => {
    return !isNaN(Number(value)) && !isNaN(parseFloat(value));
  };

  // FIX 3: Convert string "true"/"false" to boolean, numbers to number
  const parseValue = (value: string): string | number | boolean => {
    const lower = value.toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
    if (isNumericString(value)) return Number(value);
    return value;
  };

  const handleSubmit = async () => {
    const { name, audienceSize, rules } = formData;

    if (!name.trim() || !audienceSize.trim()) {
      alert('Please fill out name and audience size.');
      return;
    }

    const invalidRule = rules.some(rule =>
      !rule.field.trim() || !rule.operator.trim() || !rule.value.trim()
    );

    if (invalidRule) {
      alert('Please complete all rule fields.');
      return;
    }

    const payload = {
      name,
      audienceSize: Number(audienceSize),
      segmentRule: rules.map(rule => ({
        field: rule.field,
        operator: `$${rule.operator}`,
        value: parseValue(rule.value),
      })),
    };

    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/segments/${segment._id}`,
        payload,
        { withCredentials: true }
      );

      if (response.data.success) {
        alert('Segment updated successfully!');
        setOpen(false);
        onSegmentUpdated();
      } else {
        throw new Error(response.data.message || 'Failed to update segment');
      }
    } catch (err: unknown) {
      console.error("Error updating segment:", err);
      const error = err as { response?: { data?: { message?: string } }, message?: string };
      alert(error.response?.data?.message || error.message || 'Failed to update segment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 bg-[#A9DFD8] text-black hover:bg-[#61c9bb]">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#02675a]">Update Segment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={formData.name}
              placeholder="e.g. Students from India"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label>Audience Size</Label>
            <Input
              type="number"
              value={formData.audienceSize}
              placeholder="e.g. 5000"
              onChange={(e) =>
                setFormData({ ...formData, audienceSize: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Rules</Label>
            {formData.rules.map((rule, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Field (e.g. age)"
                  value={rule.field}
                  onChange={(e) => handleRuleChange(index, 'field', e.target.value)}
                />
                <Input
                  placeholder="Operator (e.g. >)"
                  value={rule.operator}
                  onChange={(e) => handleRuleChange(index, 'operator', e.target.value)}
                />
                <Input
                  placeholder="Value (e.g. 18, true, India)"
                  value={rule.value}
                  onChange={(e) => handleRuleChange(index, 'value', e.target.value)}
                />
                <Button variant="destructive" onClick={() => removeRule(index)}>
                  X
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={addRule}>
              + Add Rule
            </Button>
          </div>

          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              className="bg-[#A9DFD8] text-black hover:bg-[#61c9bb]"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}