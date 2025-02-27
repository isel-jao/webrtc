import { Outlet, useNavigate } from "react-router";
import Upbar from "@/components/upbar";
import useSWR from "swr";
import { User } from "@/lib/api/types";
import { useGlobalContext } from "@/context";

export default function PrivateLayout() {
  const navigate = useNavigate();
  const setUser = useGlobalContext((state) => state.setUser);
  const backendApi = useGlobalContext((state) => state.backendApi);
  const { isLoading, error, data } = useSWR(
    "current-user",
    async () => {
      if (!backendApi.isReady()) return null;
      const result = await backendApi.getMe();
      console.log(result);
      return result;
    },
    {
      onSuccess: (data) => {
        setUser(data as unknown as User);
      },
    },
  );
  if (isLoading)
    return (
      <main className="flex items-center justify-center p-20">
        <h1 className="animate-pulse text-6xl">Loading...</h1>
      </main>
    );
  if (error)
    return (
      <main className="flex items-center justify-center p-20">
        <p>An error occurred. Please try again later or contact</p>
      </main>
    );
  if (data === null) {
    navigate("/login");
    return null;
  }
  return (
    <main className="pt-upbar [&>*:nth-child(2)]:container [&>*:nth-child(2)]:py-6">
      <Upbar className="fixed inset-x-0 top-0 h-upbar" />
      <Outlet />
    </main>
  );
}
