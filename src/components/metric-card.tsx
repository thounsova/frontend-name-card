import type { LucideIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { iconMap } from "@/lib/icon-map";
import { useDashboardStore } from "@/store/dashboard-store";

export function MetricsCards() {
  const summary = useDashboardStore((state) => state.summary);

  if (!summary.length) return "Loading metrics...";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summary.map((metric) => {
        const Icon: LucideIcon = iconMap[metric.icon] || iconMap["user"];
        return (
          <Card
            key={metric.title}
            className="border-orange-500 hover:border-orange-600 transition-colors"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">
                {metric.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {metric.value}
              </div>
              <div className="flex items-center text-xs text-orange-400">
                {/* Optional change/percentage */}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
