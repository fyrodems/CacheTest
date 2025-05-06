// components/dashboard/DashboardWithProviders.tsx
import { RootProvider } from "../providers/RootProvider";
import Dashboard from "../../components/dashboard/Dashboard";

const RootProviderWrapper = () => {
  return (
    <RootProvider>
      <Dashboard />
    </RootProvider>
  );
};

export default RootProviderWrapper;
