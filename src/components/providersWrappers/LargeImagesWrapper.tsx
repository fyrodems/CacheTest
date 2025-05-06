import { AppProvider } from "../providers/AppProvider";
import { LargeImagesPage } from "../test/LargeImagesPage";

export default function LargeImagesWrapper() {
  return (
    <AppProvider>
      <LargeImagesPage />
    </AppProvider>
  );
}
