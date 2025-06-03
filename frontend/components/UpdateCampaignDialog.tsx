'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UpdateCampaignDialogProps {
  campaignId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (updatedCampaign: {
    _id: string;
    name: string;
    segmentId: string | { _id: string };
    message: string;
    status: 'pending' | 'sent' | 'delivered' | 'failed';
  }) => void;
}

export default function UpdateCampaignDialog({
  campaignId,
  open,
  onOpenChange,
  onUpdated,
}: UpdateCampaignDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    segmentId: '',
    message: '',
    status: 'pending',
  });
  const [segments, setSegments] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    // Fetch segments on mount
    const fetchSegments = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/segments`);
        setSegments(res.data.data);
      } catch (err) {
        console.error('Failed to load segments:', err);
        alert('Failed to load segments');
      }
    };

    fetchSegments();
  }, []);

  useEffect(() => {
    if (!open || !campaignId) {
      setFormData({
        name: '',
        segmentId: '',
        message: '',
        status: 'pending',
      });
      return;
    }

    const fetchCampaign = async () => {
      setFetching(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/campaigns/${campaignId}`);
        const campaign = res.data.data;
        setFormData({
          name: campaign.name,
          segmentId: campaign.segmentId._id || campaign.segmentId,
          message: campaign.message,
          status: campaign.status,
        });
      } catch (err) {
        console.error('Failed to load campaign data:', err);
        alert('Failed to load campaign data. Check console for details.');
      } finally {
        setFetching(false);
      }
    };

    fetchCampaign();
  }, [campaignId, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, segmentId, message, status } = formData;

    if (!name || !segmentId || !message || !status) {
      alert('Please fill out all fields');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/campaigns/${campaignId}`,
        { name, segmentId, message, status }
      );
      alert('Campaign updated successfully!');
      onUpdated(res.data.data);
      onOpenChange(false);
    } catch (err) {
      console.error('Failed to update campaign:', err);
      alert('Failed to update campaign. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Campaign</DialogTitle>
        </DialogHeader>

        {fetching ? (
          <div className="py-4 text-center">Loading campaign data...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="segmentId">Segment</Label>
              <Select
                value={formData.segmentId}
                onValueChange={(value) => setFormData({ ...formData, segmentId: value })}
              >
                <SelectTrigger id="segmentId">
                  <SelectValue placeholder="Select a segment" />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((segment) => (
                    <SelectItem key={segment._id} value={segment._id}>
                      {segment.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline" type="button" disabled={loading}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
