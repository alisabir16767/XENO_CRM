'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

export const description = "A radial chart showing total earnings";

export function ChartRadialText() {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalEarnings = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/order/total/earnings`
        );
        if (res.data.success) {
          setTotalEarnings(res.data.data.totalEarnings);
        }
      } catch (err) {
        console.error('Failed to fetch total earnings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalEarnings();
  }, []);

  const chartData = [
    {
      name: 'earnings',
      value: totalEarnings,
      fill: '#A9DFD8',
    },
  ];

  const chartConfig: ChartConfig = {
    value: {
      label: 'Value',
    },
    earnings: {
      label: 'Earnings',
      color: '#FFFFFF',
    },
  };

  if (loading) {
    return (
      <Card className="flex flex-col bg-[#2B2B36]">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-white text-xl">Total Earnings</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center h-[250px]">
          <div className="text-white">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col bg-[#2B2B36]">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-white text-xl">Total Earnings</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
  content={({ viewBox }) => {
    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
      return (
        <text
          x={viewBox.cx}
          y={viewBox.cy}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          <tspan
            x={viewBox.cx}
            y={viewBox.cy}
            fontSize="20"
            fontWeight="600"
            fill="white"
          >
            ${totalEarnings.toLocaleString()}
          </tspan>
          <tspan
            x={viewBox.cx}
            y={(viewBox.cy || 0) + 24}
            fontSize="12"
            fill="#A0A0A0"
          >
            Total Revenue
          </tspan>
        </text>
      );
    }
    return null;
  }}
/>

            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
          Showing total revenue from all orders
        </div>
      </CardFooter>
    </Card>
  );
}