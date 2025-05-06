import { AppProvider } from "../providers/AppProvider";
import { SmallResourcesPage } from "../test/SmallResourcesPage";

export default function SmallResourcesWrapper() {
  return (
    <AppProvider>
      <SmallResourcesPage />
    </AppProvider>
  );
}
