"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

// const chartData = [
//   { month: "January", Major: 186, Minor: 80 },
//   { month: "February", Major: 305, Minor: 200 },
//   { month: "March", Major: 237, Minor: 120 },
//   { month: "April", Major: 73, Minore: 190 },
//   { month: "May", Major: 209, Minor: 130 },
//   { month: "June", Major: 214, Minor: 140 },
// ];

type OffenseType = "Major" | "Minor";

type ChartData = {
  month: string;
  Major: number;
  Minor: number;
  Ongoing: number;
};

const chartConfig = {
  Major: {
    label: "Major",
    color: "hsl(var(--chart-1))",
  },
  Minor: {
    label: "Minor",
    color: "hsl(var(--chart-2))",
  },
  Ongoing: {
    label: "Ongoing",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function DashboardChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("created_at, offenseType, incidentStatus");

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        const processedData = processChartData(data);
        setChartData(processedData);
      }
    };

    fetchData();
  }, []);

  const processChartData = (data: any[]): ChartData[] => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const groupedData = data.reduce(
      (acc: { [key: string]: ChartData }, curr) => {
        const date = new Date(curr.created_at);
        const month = months[date.getMonth()];
        const offenseType = curr.offenseType as OffenseType;
        const status = curr.incidentStatus;

        if (!acc[month]) {
          acc[month] = { month, Major: 0, Minor: 0, Ongoing: 0 };
        }

        if (status === "Ongoing") {
          acc[month].Ongoing += 1;
        }

        if (offenseType === "Major") {
          acc[month].Major += 1;
        } else if (offenseType === "Minor") {
          acc[month].Minor += 1;
        }

        return acc;
      },
      {}
    );

    // Ensure all months are present and ordered
    const finalData = months.map((month) => {
      return groupedData[month] || { month, Major: 0, Minor: 0, Ongoing: 0 };
    });

    return finalData;
  };

  return (
    <Card>
  <CardHeader>
    <CardTitle>Case Chart</CardTitle>
    <CardDescription>January - Dec 2024</CardDescription>
  </CardHeader>
  <CardContent className="flex justify-center items-center h-[290px] mt-5">
    <ChartContainer config={chartConfig} className="w-full">
      <LineChart
        width={400}
        height={250}
        data={chartData}
        margin={{
          top: 20,
          bottom: 20,
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, "dataMax"]}
          tickFormatter={(value) => value.toString()}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="Major"
          type="monotone"
          stroke="black"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="Minor"
          type="monotone"
          stroke="orange"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="Ongoing"
          type="monotone"
          stroke="green"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  </CardContent>
  <CardFooter>
    <div className="flex flex-row justify-center m-auto">
      <div className="flex mx-2">
        <div className="rounded-full bg-green-900 w-3 h-3 m-auto mr-2"></div>
        Ongoing Cases
      </div>
      <div className="flex mx-2">
        <span className="rounded-full bg-orange-700 w-3 h-3 m-auto mr-2"></span>
        Minor Cases
      </div>
      <div className="flex mx-2">
        <span className="rounded-full bg-black w-3 h-3 m-auto mr-2"></span>
        Major Cases
      </div>
    </div>
  </CardFooter>
</Card>
  );
}
