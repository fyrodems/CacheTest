import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAppContext } from "../providers/AppProvider";
import { Loader2 } from "lucide-react";

interface ResetCacheButtonProps {
  disabled?: boolean;
}

export const ResetCacheButton = ({
  disabled = false,
}: ResetCacheButtonProps) => {
  const { resetCache, cacheSize } = useAppContext();
  const [isResetting, setIsResetting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = async () => {
    setIsResetting(true);
    try {
      await resetCache();
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to reset cache:", error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled || isResetting}>
          {isResetting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetowanie...
            </>
          ) : (
            <>Resetuj cache ({cacheSize} MB)</>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resetowanie cache'a</AlertDialogTitle>
          <AlertDialogDescription>
            Ta akcja usunie wszystkie dane z cache'a przeglądarki. Czy na pewno
            chcesz kontynuować?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Anuluj</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset} disabled={isResetting}>
            {isResetting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetowanie...
              </>
            ) : (
              "Resetuj"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
