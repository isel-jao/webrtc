import { BackendApi } from "@/lib/api/backend-api";
import { Outlet } from "react-router";
import { Toaster } from "sonner";
import { GlobalProvider } from "@/context";

export default function GlobalLayout() {
  const logoutCallback = () => {
    console.log("logoutCallback");
    window.location.href = "/login";
    console.log("redirected");
  };
  const backendApi = new BackendApi(logoutCallback);
  console.log("GlobalLayout");

  return (
    <GlobalProvider value={{ backendApi, user: null }}>
      <Outlet />
      <Toaster />
    </GlobalProvider>
  );
}
