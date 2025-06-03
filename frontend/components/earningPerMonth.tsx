"use client"

import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface ApiResponse {
  success: boolean
  data: {
    month: string
    earnings: number
  }[]
}

const chartConfig = {
  earnings: {
    label: "Earnings",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function MonthlyEarningsChart() {
  const [chartData, setChartData] = useState<{month: string, earnings: number}[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/order/monthly`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data: ApiResponse = await response.json()
        const transformedData = data.data.map(item => ({
          month: item.month,
          earnings: item.earnings
        }))
        setChartData(transformedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        console.error('Error fetching data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <Card className="bg-[#2B2B36] h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-xl">Monthly Earnings</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-white">Loading data...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-[#2B2B36] h-full flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-xl">Monthly Earnings</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <p className="text-red-400">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#2B2B36] h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-xl">Monthly Earnings</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[200px] p-0">
        <ChartContainer config={chartConfig} className="h-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid vertical={false} stroke="#3E3E4D" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: '#A9DFD8', fontSize: 12 }}
                tickFormatter={(value) => value.slice(0, 3)}
                interval={0} // Ensure all ticks are shown
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar 
                dataKey="earnings" 
                fill="#A9DFD8" 
                radius={[8, 8, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="px-4 pb-2 text-sm text-muted-foreground">
        Showing total earnings of each month
      </CardFooter>
    </Card>
  )
}