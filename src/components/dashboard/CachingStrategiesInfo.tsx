import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CachingStrategyInfoViewModel } from "@/lib/types/dashboard";

interface CachingStrategiesInfoProps {
  strategies: CachingStrategyInfoViewModel[];
}

interface StrategyCardProps {
  strategy: CachingStrategyInfoViewModel;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{strategy.name}</CardTitle>
        <CardDescription>{strategy.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <h4 className="text-sm font-medium mb-1">Zastosowanie:</h4>
        <p className="text-sm text-muted-foreground">{strategy.useCase}</p>
      </CardContent>
    </Card>
  );
};

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
