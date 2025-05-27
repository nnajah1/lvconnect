import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Mail, Calendar } from "lucide-react"

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Coming Soon</CardTitle>
          <CardDescription className="text-gray-600">
            We're working hard to bring you something amazing. Stay tuned!
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
