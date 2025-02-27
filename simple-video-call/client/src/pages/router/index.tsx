import { BrowserRouter, Route, Routes } from "react-router";
import PrivateLayout from "@/pages/private/layout";
import HomePage from "@/pages/private/home";
import DevPage from "@/pages/public/dev";
import NotfoundPage from "@/pages/public/notfound";
import LoginPage from "../public/login";
import RoomsPage from "../private/rooms";
import RoomIdPage from "../private/room-id";
import GlobalLayout from "../layout";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GlobalLayout />}>
          <Route element={<PrivateLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="rooms">
              <Route index element={<RoomsPage />} />
              <Route path=":roomId" element={<RoomIdPage />} />
            </Route>
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dev" element={<DevPage />} />
          <Route path="*" element={<NotfoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
