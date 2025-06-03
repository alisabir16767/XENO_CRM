'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {Button} from "@/components/ui/button";

interface Segment {
  name: string;
  audienceSize: number;
}

interface Campaign {
  _id: string;
  name: string;
  message: string;
  status: string;
  createdAt: string;
  segmentId: Segment;
}

export default function RecentCampaignTable() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchRecentCampaigns = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/campaigns/recent-performance`,
          { withCredentials: true }
        );
        setCampaigns(res.data.data);
      } catch (err) {
        console.error('Failed to fetch recent campaigns:', err);
      }
    };

    fetchRecentCampaigns();
  }, []);

  // Determine badge variant based on status
  const getBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'default'; // green
      case 'pending':
        return 'secondary'; // gray
      case 'failed':
        return 'destructive'; // red
      default:
        return 'outline';
    }
  };

  const getProgressColor = (size: number) => {
    if (size >= 70) return 'bg-green-500';
    if (size >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="mt-6 bg-[#2B2B36] p-5 rounded-2xl">

<div className="flex items-center justify-between mb-6">
<h3 className="text-xl font-semibold mb-4">Recent Campaigns</h3>
     
     <Button
       onClick={() => window.location.href = '/dashboard/campaigns'}
       variant="outline"
       className="bg-[#A9DFD8] text-black hover:bg-[#61c9bb] transition-colors duration-200"
     >
       View All
     </Button>
      </div>
      
      

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-[#87888C]">Campaign Name</TableHead>
            <TableHead className="text-[#87888C]">Segment</TableHead>
            <TableHead className="text-[#87888C]">Status</TableHead>
            <TableHead className="text-[#87888C]">Audience Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>No recent campaigns found.</TableCell>
            </TableRow>
          ) : (
            campaigns.map((campaign) => {
              const audienceSize = campaign.segmentId?.audienceSize ?? 0;
              return (
                <TableRow key={campaign._id}>
                  <TableCell>{campaign.name}</TableCell>
                  <TableCell>{campaign.segmentId?.name || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <Progress
                        value={audienceSize}
                        className="h-2 bg-gray-300"
                      />
                      <div
                        className={`absolute top-0 left-0 h-2 ${getProgressColor(
                          audienceSize
                        )}`}
                        style={{ width: `${audienceSize}%` }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
