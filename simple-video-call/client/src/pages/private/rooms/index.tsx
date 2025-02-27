import { useGlobalContext } from "@/context";
import { Room } from "@/lib/api/types";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import useSWR from "swr";

export default function RoomsPage() {
  const backendApi = useGlobalContext((state) => state.backendApi);
  const { isLoading, error } = useSWR(
    "rooms",
    async () => {
      const result = await backendApi.getRooms();
      return result;
    },
    {
      onSuccess: (data) => {
        setRooms(data);
      },
    },
  );
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    backendApi.socket.on("room-created", (room: Room) => {
      setRooms((prev) => [...prev, room]);
    });
    return () => {
      backendApi.socket.off("room-created");
    };
  }, []);

  async function handleAddRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    backendApi.socket.emit("create-room", name);
    e.currentTarget.reset();
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return (
    <main className="container flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <span>{`Rooms (${rooms.length})`}</span>
        <form className="flex items-center gap-4" onSubmit={handleAddRoom}>
          <input
            required
            minLength={3}
            className="rounded border bg-foreground/5 px-4 py-2"
          />
          <button className="rounded bg-primary px-4 py-2 text-primary-foreground hover:brightness-105 active:brightness-100">
            Create Room
          </button>
        </form>
      </div>
      <div className="flex h-1 flex-1 flex-col gap-4 rounded border p-4">
        {rooms.map((room) => (
          <div key={room.id} className="flex items-center gap-4 border-b py-2">
            <div>{room.name}</div>
            <div>{room.id}</div>
            <Link
              to={room.id}
              className="ml-auto min-w-32 rounded border px-4 py-2 text-center"
            >
              join
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
