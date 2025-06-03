'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardTitle
} from "@/components/ui/card";
import { Users, Send, Activity, Percent } from "lucide-react";

import CreateCampaignDialog from "@/components/CreateCampaignDialog";
import RecentCampaignTable from '@/components/RecentCampaignTable';
import {ChartAreaLegend} from "@/components/customerInvestmentsCharts";
import {ChartRadialText} from "@/components/totalEarnings";
import {MonthlyEarningsChart} from "@/components/earningPerMonth";



interface User {
  name: string;
  avatar?: string;
}

export default function DashboardPage() {
  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [campaignCount, setCampaignCount] = useState<number | null>(null);
  const [activeSegmentCount, setActiveSegmentCount] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [orderCount, setOrderCount] = useState<number | null>(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
          withCredentials: true,
        });
        setUser(res.data); // expecting res.data = { name, avatar }
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    };

    const fetchCustomerCount = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer`, {
          withCredentials: true,
        });
        setCustomerCount(res.data.customers.length);
      } catch (error) {
        console.error('Failed to fetch customer count', error);
      }
    };

    const fetchCampaignCount = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/campaigns`, {
          withCredentials: true,
        });
        setCampaignCount(res.data.data.length);
      } catch (error) {
        console.error('Failed to fetch campaign count', error);
      }
    };

    const fetchActiveSegmentCount = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/segments`, {
          withCredentials: true,
        });
        const activeSegments = res.data.data.filter((segment: { isActive: boolean }) => segment.isActive === true);
        setActiveSegmentCount(activeSegments.length);
      } catch (error) {
        console.error("Failed to fetch active segment count", error);
      }
    };

   

   
    const fetchOrderCount = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/order/total-count`, {
          withCredentials: true,
        });
        setOrderCount(res.data.data.orderCount);
      } catch (error) {
        console.error('Failed to fetch order count', error);
      }
    };

    fetchUser();
    fetchCustomerCount();
    fetchCampaignCount();
    fetchActiveSegmentCount();
    fetchOrderCount();
  }, []);

  return (
    <div className="w-full min-h-screen px-6 py-8 bg-[#171821] text-white space-y-8">
      <h1 className="text-4xl font-bold text-white">📊 Dashboard</h1>
      <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-semibold text-gray-400">
    Welcome, {user?.name || "User"}
  </h2>
  <div>
    <CreateCampaignDialog />
  </div>
</div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-[#2B2B36] p-6 rounded-xl">
        {/* Customers */}
        <Card className="bg-[#171821] shadow-lg rounded-xl border-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Users className="text-[#FEB002]" />
              <CardTitle className="text-white text-sm">Total Customers</CardTitle>
            </div>
            <p className="text-2xl font-semibold text-white">{customerCount ?? "Loading..."}</p>
          </CardContent>
        </Card>

        {/* Campaigns */}
        <Card className="bg-[#171821] shadow-lg rounded-xl border-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Send className="text-[#029F04]" />
              <CardTitle className="text-white text-sm">Total Campaigns Sent</CardTitle>
            </div>
            <p className="text-2xl font-semibold text-white">{campaignCount ?? "Loading..."}</p>
          </CardContent>
        </Card>

        {/* Active Segments */}
        <Card className="bg-[#171821] shadow-lg rounded-xl border-none">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="text-[#EA1701]" />
              <CardTitle className="text-white text-sm">Active Segments</CardTitle>
            </div>
            <p className="text-2xl font-semibold text-white">{activeSegmentCount ?? "Loading..."}</p>
          </CardContent>
        </Card>

{/* Order Count */}
<Card className="bg-[#171821] shadow-lg rounded-xl border-none">
  <CardContent className="p-4 space-y-2">
    <div className="flex items-center gap-2">
      <Percent className="text-[#20AEF3]" />
      <CardTitle className="text-white text-sm">Total Orders</CardTitle>
    </div>
    <p className="text-2xl font-semibold text-white">
      {orderCount !== null ? orderCount : "Loading..."}
    </p>
  </CardContent>
</Card>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-stretch min-h-[400px]">
  <div className="w-full md:w-2/3 h-full">
    <RecentCampaignTable />
  </div>
  <div className="w-full md:w-1/3 h-full">
    <ChartAreaLegend />
  </div>
</div>

<div className="flex flex-col md:flex-row gap-6 items-stretch h-[400px]">
  <div className="w-full md:w-1/3 h-full">
    <ChartRadialText />
  </div>
  <div className="w-full md:w-2/3 h-full">
    < MonthlyEarningsChart />
  </div>
</div>





      
    </div>
  );
}