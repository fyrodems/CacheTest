import { AppProvider } from "../providers/AppProvider";
import { StrategySelector } from "../test/StrategySelector";
import { NetworkConditionSelector } from "../test/NetworkConditionSelector";
import { ResetCacheButton } from "../test/ResetCacheButton";

export default function NavHeaderWrapper() {
  return (
    <AppProvider>
      <StrategySelector />
      <NetworkConditionSelector />
      <ResetCacheButton />
    </AppProvider>
  );
}
