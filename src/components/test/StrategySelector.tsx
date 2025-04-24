import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "../providers/AppProvider";
import { CachingStrategy } from "../../lib/types/cache";

interface StrategySelectorProps {
  disabled?: boolean;
}

export const StrategySelector = ({
  disabled = false,
}: StrategySelectorProps) => {
  const { currentStrategy, setStrategy } = useAppContext();
  const labelId = useId();

  const handleChange = (value: string) => {
    setStrategy(value as CachingStrategy);
  };

  return (
    <div className="flex items-center">
      <label id={labelId} className="mr-2 text-sm font-medium">
        Strategia cache:
      </label>
      <Select
        value={currentStrategy}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[200px]" aria-labelledby={labelId}>
          <SelectValue placeholder="Wybierz strategię" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={CachingStrategy.NETWORK_FIRST}>
            Network First
          </SelectItem>
          <SelectItem value={CachingStrategy.CACHE_FIRST}>
            Cache First
          </SelectItem>
          <SelectItem value={CachingStrategy.STALE_WHILE_REVALIDATE}>
            Stale While Revalidate
          </SelectItem>
          <SelectItem value={CachingStrategy.CACHE_THEN_NETWORK}>
            Cache Then Network
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
