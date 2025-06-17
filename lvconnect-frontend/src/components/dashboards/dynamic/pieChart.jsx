import { Pie, PieChart } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import {
  ChartContainer,
  ChartLegend,
  // ChartLegendContent,
} from "@/components/ui/chart"
import ChartLegendContent from "./pieChartLegend";

function ChartPieLegendCard({ stat }) {
  const Icon = stat?.icon || TrendingUp;
  const title = stat?.title || "Pie Chart";
  const subtitle = stat?.subtitle || "Data";
  const data = stat?.data || [];
  const labelKey = stat?.labelKey || "label";
  const valueKey = stat?.valueKey || "value";

  const colorPalette = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
    "var(--chart-7)",
  ];

  const chartData = data.map((item, i) => ({
    ...item,
    fill: colorPalette[i % colorPalette.length],
  }));

  const chartConfig = data.reduce((acc, item, i) => {
    acc[item[labelKey]] = {
      label: item[labelKey],
      color: colorPalette[i % colorPalette.length],
    };
    return acc;
  }, {});

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className="p-3 rounded-xl shadow-lg bg-gradient-to-br from-slate-500 to-slate-700 transform transition-transform duration-200 hover:scale-110">
            <Icon className="h-6 w-6 text-white drop-shadow-sm" />
          </div>
        </div>

        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <Pie data={chartData} dataKey={valueKey} nameKey={labelKey} />
            <ChartLegend
              content={<ChartLegendContent nameKey={labelKey} valueKey={valueKey} />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>

        <div className="mt-4 h-1 w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full opacity-50" />
      </CardContent>
    </Card>
  );
}

export default ChartPieLegendCard;

