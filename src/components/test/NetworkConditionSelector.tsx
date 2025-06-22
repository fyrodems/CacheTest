/* eslint-disable jsx-a11y/label-has-associated-control */
import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "../providers/AppProvider";
import { NetworkCondition } from "../../lib/types/cache";

interface NetworkConditionSelectorProps {
  disabled?: boolean;
}

export const NetworkConditionSelector = ({
  disabled = false,
}: NetworkConditionSelectorProps) => {
  const { currentNetworkCondition, setNetworkCondition } = useAppContext();
  const labelId = useId();

  const handleChange = (value: string) => {
    setNetworkCondition(value as NetworkCondition);
  };

  return (
    <div className="flex items-center">
      <label id={labelId} className="mr-2 text-sm font-medium">
        Warunki sieciowe:
      </label>
      <Select
        value={currentNetworkCondition}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-[160px]" aria-labelledby={labelId}>
          <SelectValue placeholder="Wybierz warunki" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NetworkCondition.GOOD}>Dobre</SelectItem>
          <SelectItem value={NetworkCondition.SLOW}>Wolne</SelectItem>
          <SelectItem value={NetworkCondition.FLAKY}>Przerywane</SelectItem>
          {/* <SelectItem value={NetworkCondition.OFFLINE}>Offline</SelectItem> */}
        </SelectContent>
      </Select>
    </div>
  );
};
