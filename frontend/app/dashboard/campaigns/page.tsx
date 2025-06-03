'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import CreateCampaignDialog from '@/components/CreateCampaignDialog';
import UpdateCampaignDialog from '@/components/UpdateCampaignDialog';

type Segment = {
  _id: string;
  name: string;
  audienceSize: number;
};

type Campaign = {
  _id: string;
  name: string;
  status: string;
  message: string;
  created_at?: string;
  createdAt?: string;
  updatedAt?: string;
  segmentId: Segment | string;
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingCampaignId, setEditingCampaignId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/campaigns`);
      setCampaigns(res.data.data);
    } catch (err: any) {
      console.error('Error fetching campaigns:', err);
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to load campaign data'
      );
      alert('Failed to fetch campaigns. Check console for details.');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      setDeletingId(id);
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/campaigns/${id}`);
      setCampaigns((prev) => prev.filter((c) => c._id !== id));
      alert('Campaign deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete the campaign');
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateClick = (id: string) => {
    setEditingCampaignId(id);
    setDialogOpen(true);
  };

  const handleCampaignUpdated = (updatedCampaign: Campaign) => {
    setCampaigns((prev) =>
      prev.map((c) => (c._id === updatedCampaign._id ? updatedCampaign : c))
    );
    alert('Campaign updated successfully');
  };

  const handleCampaignCreated = (newCampaign: Campaign) => {
    setCampaigns((prev) => [newCampaign, ...prev]);
    alert('Campaign created successfully');
  };

  if (loading) return <div className="p-4 text-center">Loading campaigns...</div>;
  if (error) return <div className="p-4 text-center text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 bg-[#2B2B36] rounded-2xl min-h-screen">
     <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
  {/* Left side - Title */}
  <h1 className="text-3xl font-bold text-white">Campaigns</h1>

  {/* Right side - Buttons */}
  <div className="flex gap-4">
    <Button
       onClick={()=>location.href='/ai/generate'}
      type="button"
      className="bg-[#A9DFD8] text-black hover:bg-[#61c9bb] transition-colors duration-200"
    >
      Generate message 
    </Button>
    <CreateCampaignDialog onCampaignCreated={handleCampaignCreated} />
  </div>
</div>


      <UpdateCampaignDialog
        campaignId={editingCampaignId}
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setEditingCampaignId(null);
          setDialogOpen(open);
        }}
        onUpdated={handleCampaignUpdated}
      />

      {campaigns.length === 0 ? (
        <div className="text-center text-white py-8">
          <p>No campaigns found.</p>
          <CreateCampaignDialog 
            onCampaignCreated={handleCampaignCreated} 
            triggerText="Create your first campaign" 
          />
        </div>
      ) : (
        <ScrollArea className="h-[80vh] pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const createdAt = campaign.createdAt || campaign.created_at;
              const segmentName = typeof campaign.segmentId === 'object' 
                ? campaign.segmentId.name 
                : 'Unknown Segment';
              const audienceSize = typeof campaign.segmentId === 'object' 
                ? campaign.segmentId.audienceSize 
                : 0;

              return (
                <Card
                  key={campaign._id}
                  className="bg-[#171821] text-white border-none flex flex-col h-full"
                >
                  <div className="flex-grow">
                    <CardHeader>
                      <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p>
                        <strong>Status:</strong>{' '}
                        <Badge variant={
                          campaign.status === 'sent' ? 'default' :
                          campaign.status === 'delivered' ? 'secondary' :
                          campaign.status === 'failed' ? 'destructive' : 'success'
                        }>
                          {campaign.status}
                        </Badge>
                      </p>
                      <p>
                        <strong>Segment:</strong> {segmentName} ({audienceSize})
                      </p>
                      <div className="mt-2 space-y-1 text-sm">
                        <p>
                          <strong>Message:</strong> {campaign.message}
                        </p>
                        <p>
                          <strong>Created At:</strong>{' '}
                          {createdAt
                            ? new Date(createdAt).toLocaleString()
                            : 'N/A'}
                        </p>
                        {campaign.updatedAt && (
                          <p>
                            <strong>Updated At:</strong>{' '}
                            {new Date(campaign.updatedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className="mt-auto flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-[#A9DFD8] text-black hover:bg-[#45988d] border-none"
                      onClick={() => handleUpdateClick(campaign._id)}
                    >
                      Update
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-[#FCB859] text-black hover:bg-red-600 border-none"
                      onClick={() => handleDelete(campaign._id)}
                      disabled={deletingId === campaign._id}
                    >
                      {deletingId === campaign._id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}