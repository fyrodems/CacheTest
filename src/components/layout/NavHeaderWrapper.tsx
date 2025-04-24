// components/AppWrapper.tsx
import { AppProvider } from "../providers/AppProvider";
import { StrategySelector } from "../test/StrategySelector";
import { NetworkConditionSelector } from "../test/NetworkConditionSelector";
import { OnlineIndicator } from "../test/OnlineIndicator";
import { ResetCacheButton } from "../test/ResetCacheButton";

export default function NavHeaderWrapper() {
  return (
    <AppProvider>
      <StrategySelector />
      <NetworkConditionSelector />
      <OnlineIndicator />
      <ResetCacheButton />
    </AppProvider>
  );
}
