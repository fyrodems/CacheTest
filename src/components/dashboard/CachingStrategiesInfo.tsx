import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StrategyCard from "./StrategyCard";
import type { CachingStrategyInfoViewModel } from "@/lib/types/dashboard";

interface CachingStrategiesInfoProps {
  strategies: CachingStrategyInfoViewModel[];
}

const CachingStrategiesInfo: React.FC<CachingStrategiesInfoProps> = ({
  strategies,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Strategie cachowania</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map((strategy) => (
            <StrategyCard key={strategy.name} strategy={strategy} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CachingStrategiesInfo;
