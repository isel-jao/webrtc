import { Outlet } from "react-router";
import Upbar from "@/components/upbar";

export default function PrivateLayout() {
  return (
    <main className="pt-upbar [&>*:nth-child(2)]:container [&>*:nth-child(2)]:py-6">
      <Upbar className="h-upbar fixed inset-x-0 top-0" />
      <Outlet />
    </main>
  );
}
