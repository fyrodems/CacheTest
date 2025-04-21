import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CachingStrategyInfoViewModel } from "@/lib/types/dashboard";
import { ArrowUpRight } from "lucide-react";

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
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" asChild>
          <a
            href={strategy.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Dowiedz się więcej
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StrategyCard;
