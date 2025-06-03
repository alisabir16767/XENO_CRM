"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import axios from 'axios';

// TypeScript Interfaces
interface Customer {
  id: string;
  name: string;
  investments: number;
  orders: number;
}

interface ChartDataItem {
  month: string;
  desktop: number;
  mobile: number;
  customers: Customer[];
}

// Chart config with TypeScript assertion
const chartConfig = {
  desktop: {
    label: "Investments",
    color: "#F2C8ED",
  },
  mobile: {
    label: "Orders",
    color: "#A9DFD8",
  },
} satisfies ChartConfig;

interface CustomLegendPayloadItem {
  dataKey: keyof typeof chartConfig;
  value?: number;
  color?: string;
}

function CustomChartLegendContent(props: { payload?: CustomLegendPayloadItem[] }) {
  const { payload } = props;
  
  if (!payload || payload.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-4 mt-4">
      {payload.map((entry, index) => {
        const config = chartConfig[entry.dataKey];
        return (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
            />
            <span style={{ color: config.color }}>{config.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

export function ChartAreaLegend() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<ChartDataItem[]>(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/customer/investments`
        );
        setChartData(response.data);
        setLoading(false);
      } catch (err) {
        const errorMessage = axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : 'An unknown error occurred';
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card className="bg-[#2B2B36] mt-6.5 border-none">
        <CardHeader>
          <CardTitle className="text-white text-xl">Customer Investments</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="text-white">Loading chart data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#2B2B36] mt-6.5 border-none">
        <CardHeader>
          <CardTitle className="text-white text-xl">Customer Investments</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="text-red-400">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#2B2B36] mt-6.5 border-none">
      <CardHeader>
        <CardTitle className="text-white text-xl">Customer Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
            height={280}
          >
            <CartesianGrid vertical={false} stroke="#3E3E4A" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
              tick={{ fill: "#D1D5DB" }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill={chartConfig.mobile.color}
              fillOpacity={0.6}
              stroke={chartConfig.mobile.color}
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill={chartConfig.desktop.color}
              fillOpacity={0.6}
              stroke={chartConfig.desktop.color}
              stackId="a"
            />
            <ChartLegend content={<CustomChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}