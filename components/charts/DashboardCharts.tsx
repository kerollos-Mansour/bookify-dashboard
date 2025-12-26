"use client";
import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RevenueChartProps {
  data: { date: string; revenue: number }[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 300,
      toolbar: {
        show: false,
      },
      background: "transparent",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: data.map((d) => {
        const date = new Date(d.date);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }),
      labels: {
        style: {
          colors: "#9ca3af",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9ca3af",
        },
        formatter: (value) => `$${value.toFixed(0)}`,
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    colors: ["#465fff"],
    grid: {
      borderColor: "#374151",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `$${value.toFixed(2)}`,
      },
    },
  };

  const series = [
    {
      name: "Revenue",
      data: data.map((d) => d.revenue),
    },
  ];

  return (
    <div className="w-full h-64">
      <Chart options={options} series={series} type="area" height={256} />
    </div>
  );
};

interface BookingStatusChartProps {
  data: { status: string; count: number }[];
}

export const BookingStatusChart: React.FC<BookingStatusChartProps> = ({
  data,
}) => {
  const options: ApexOptions = {
    chart: {
      type: "donut",
      height: 300,
      background: "transparent",
    },
    labels: data.map((d) => d.status),
    colors: ["#465fff", "#10b981", "#f59e0b", "#ef4444"],
    legend: {
      position: "bottom",
      labels: {
        colors: "#9ca3af",
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => `${val.toFixed(0)}%`,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Bookings",
              color: "#9ca3af",
              formatter: () => {
                const total = data.reduce((sum, d) => sum + d.count, 0);
                return total.toString();
              },
            },
          },
        },
      },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `${value} bookings`,
      },
    },
  };

  const series = data.map((d) => d.count);

  return (
    <div className="w-full h-64">
      <Chart options={options} series={series} type="donut" height={256} />
    </div>
  );
};
