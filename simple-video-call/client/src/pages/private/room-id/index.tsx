import { useParams } from "react-router";

export default function RoomIdPage() {
  const { roomId } = useParams<{ roomId: string }>();
  return <main>RoomIdPage: {roomId}</main>;
}
