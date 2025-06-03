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
import { useState } from "react";
import axios from "axios";

interface CreateSegmentDialogProps {
  onSegmentCreated: () => void;
}

export default function CreateSegmentDialog({ onSegmentCreated }: CreateSegmentDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    audienceSize: '',
    rules: [{ field: '', operator: '', value: '' }],
  });
  const [loading, setLoading] = useState(false);

  const handleRuleChange = (index: number, key: string, value: string) => {
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
        value: Number(rule.value)
      })),
      isActive: true
    };
  
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/segments`,
        payload,
        { withCredentials: true }
      );
  
      if (response.data.success) {
        alert('Segment created successfully!');
        setFormData({
          name: '',
          audienceSize: '',
          rules: [{ field: '', operator: '', value: '' }],
        });
        onSegmentCreated();
      } else {
        throw new Error(response.data.message || 'Failed to create segment');
      }
    } catch (err: unknown) {
      console.error("Error creating segment:", err);
    
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || err.message || 'Failed to create segment');
      } else if (err instanceof Error) {
        alert(err.message || 'Failed to create segment');
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-[#A9DFD8] text-black hover:bg-[#61c9bb]">
          Create New Segment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-[#02675a]">Create Segment</DialogTitle>
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
                  placeholder="Value (e.g. 18)"
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
              {loading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}