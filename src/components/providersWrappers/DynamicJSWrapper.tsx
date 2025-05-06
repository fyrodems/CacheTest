import { AppProvider } from "../providers/AppProvider";
import { DynamicJSPage } from "../test/DynamicJSPage";

export default function DynamicJSWrapper() {
  return (
    <AppProvider>
      <DynamicJSPage />
    </AppProvider>
  );
}
