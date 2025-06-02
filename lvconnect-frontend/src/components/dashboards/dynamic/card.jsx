import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

function StatsCard({ stat }) {
  // Fallback values
  const Icon = stat?.icon || TrendingUp
  const value = stat?.value != null ? new Intl.NumberFormat().format(stat.value) : "0";
  const label = stat?.label || "No Label"
  const color = stat?.color || "bg-gradient-to-br from-blue-500 to-blue-600"

  return (
    <Card className="w-full transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-0 shadow-sm bg-gradient-to-br from-white to-gray-50/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-3xl font-bold tracking-tight text-gray-900 leading-none">{value}</p>
            <p className="text-sm font-medium text-gray-600 leading-relaxed py-2">{label}</p>
          </div>
          <div
            className={`p-3 rounded-xl shadow-lg ${color} transform transition-transform duration-200 hover:scale-110`}
          >
            <Icon className="h-6 w-6 text-white drop-shadow-sm" />
          </div>
        </div>

        {/* Subtle decorative element */}
        <div className="mt-4 h-1 w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent rounded-full opacity-50" />
      </CardContent>
    </Card>
  )
}

export default StatsCard
