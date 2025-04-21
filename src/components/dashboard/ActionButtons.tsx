import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Settings, Database } from "lucide-react";
import CacheResetButton from "./CacheResetButton";

interface ActionButtonsProps {
  onRunTest: () => void;
  onOpenSettings: () => void;
  isRunningTest: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onRunTest,
  onOpenSettings,
  isRunningTest,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Akcje</CardTitle>
        <CardDescription>
          Uruchom testy wydajnościowe lub zarządzaj ustawieniami
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          onClick={onRunTest}
          disabled={isRunningTest}
          className="w-full h-12"
        >
          <PlayCircle className="mr-2 h-4 w-4" />
          {isRunningTest ? "Trwa test..." : "Uruchom test"}
        </Button>
        <Button
          variant="outline"
          onClick={onOpenSettings}
          className="w-full h-12"
        >
          <Settings className="mr-2 h-4 w-4" />
          Ustawienia
        </Button>
        <CacheResetButton className="w-full h-12 col-span-1 md:col-span-2">
          <Database className="mr-2 h-4 w-4" />
          Wyczyść cache
        </CacheResetButton>
      </CardContent>
    </Card>
  );
};

export default ActionButtons;
