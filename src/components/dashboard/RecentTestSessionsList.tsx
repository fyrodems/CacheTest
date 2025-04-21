import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TestSessionItem from "./TestSessionItem";
import type { TestSessionViewModel } from "@/lib/types/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RecentTestSessionsListProps {
  sessions: TestSessionViewModel[] | null;
  isLoading: boolean;
  error: Error | null;
}

const RecentTestSessionsList: React.FC<RecentTestSessionsListProps> = ({
  sessions,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Ostatnie sesje testowe</CardTitle>
        </CardHeader>
        <CardContent>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-16 mb-2" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Ostatnie sesje testowe</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Nie udało się załadować sesji testowych: {error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Ostatnie sesje testowe</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-12">
            Brak sesji testowych. Uruchom testy, aby zobaczyć wyniki.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Ostatnie sesje testowe</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.map((session) => (
          <TestSessionItem key={session.id} session={session} />
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentTestSessionsList;
