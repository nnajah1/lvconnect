"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer, Cell } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Users } from "lucide-react"
import { colors } from "@/utils/statsDashboard"

export default function DemographicsChart({ demographics }) {
  const [filters, setFilters] = useState({
    province: "All Provinces",
    city_municipality: "All Cities",
    barangay: "All Barangays",
    street: "All Streets",
  })

  const [filteredChartData, setFilteredChartData] = useState([])

  // Extract all addresses
  const allAddresses = demographics.flatMap((d) => d.addresses)

  // Utility to get unique values based on current filter
  const unique = (arr, key) => [...new Set(arr.map((item) => item[key]).filter(Boolean))]

  const provinces = unique(allAddresses, "province")
  const cities = unique(
    allAddresses.filter((a) => (filters.province !== "All Provinces" ? a.province === filters.province : true)),
    "city_municipality",
  )
  const barangays = unique(
    allAddresses.filter((a) =>
      filters.city_municipality !== "All Cities" ? a.city_municipality === filters.city_municipality : true,
    ),
    "barangay",
  )
  const streets = unique(
    allAddresses.filter((a) => (filters.barangay !== "All Barangays" ? a.barangay === filters.barangay : true)),
    "street",
  )

  // Update chart data whenever filters or demographics change
  useEffect(() => {
    const result = demographics
      .map((program) => {
        const matching = program.addresses.filter(
          (addr) =>
            (filters.province === "All Provinces" || addr.province === filters.province) &&
            (filters.city_municipality === "All Cities" || addr.city_municipality === filters.city_municipality) &&
            (filters.barangay === "All Barangays" || addr.barangay === filters.barangay) &&
            (filters.street === "All Streets" || addr.street === filters.street),
        )

        const total = matching.reduce((sum, a) => sum + a.student_count, 0)

        return {
          label: program.program_name,
          value: total,
        }
      })
      .filter((p) => p.value > 0)

    setFilteredChartData(result)
  }, [filters, demographics])

  const totalStudents = filteredChartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="w-full border-0 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Users className="h-5 w-5 text-primary" />
          Students Population
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>Total Students: {totalStudents}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Province</label>
            <Select
              value={filters.province}
              onValueChange={(value) =>
                setFilters({
                  province: value || "All Provinces",
                  city_municipality: "All Cities",
                  barangay: "All Barangays",
                  street: "All Streets",
                })
              }
            >
              <SelectTrigger className="w-full bg-white border-gray-200 relative z-20">
                <SelectValue placeholder="All Provinces" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                <SelectItem value="All Provinces">All Provinces</SelectItem>
                {provinces.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">City/Municipality</label>
            <Select
              value={filters.city_municipality}
              disabled={filters.province === "All Provinces"}
              onValueChange={(value) =>
                setFilters({
                  ...filters,
                  city_municipality: value || "All Cities",
                  barangay: "All Barangays",
                  street: "All Streets",
                })
              }
            >
              <SelectTrigger className="w-full bg-white border-gray-200 relative z-20">
                <SelectValue placeholder="All Cities" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                <SelectItem value="All Cities">All Cities</SelectItem>
                {cities.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Barangay</label>
            <Select
              value={filters.barangay}
              disabled={filters.city_municipality === "All Cities"}
              onValueChange={(value) =>
                setFilters({ ...filters, barangay: value || "All Barangays", street: "All Streets" })
              }
            >
              <SelectTrigger className="w-full bg-white border-gray-200 relative z-20">
                <SelectValue placeholder="All Barangays" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                <SelectItem value="All Barangays">All Barangays</SelectItem>
                {barangays.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Street</label>
            <Select
              value={filters.street}
              disabled={filters.barangay === "All Barangays"}
              onValueChange={(value) => setFilters({ ...filters, street: value || "All Streets" })}
            >
              <SelectTrigger className="w-full bg-white border-gray-200 relative z-20">
                <SelectValue placeholder="All Streets" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                <SelectItem value="All Streets">All Streets</SelectItem>
                {streets.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={{ stroke: "#d1d5db" }}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={{ stroke: "#d1d5db" }}
                axisLine={{ stroke: "#d1d5db" }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} className="drop-shadow-sm">
                <LabelList dataKey="value" position="top" fontSize={12} fill="#374151" fontWeight="500" />
                {
                  filteredChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {filteredChartData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No data available for the selected filters</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
