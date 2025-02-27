import { useGlobalContext } from "@/context";
import { Room, User } from "@/lib/api/types";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import useSWR from "swr";
import React from "react";
import { twMerge } from "tailwind-merge";
import Peer from "peerjs";

interface VideoCallProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  user: User;
}

export function VideoCall({ className, user, ...props }: VideoCallProps) {
  const me = useGlobalContext((state) => state.user);
  const isMe = me?.id === user.id;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const myPeer = new Peer();
    const myVideo = videoRef.current!;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideo.srcObject = stream;
        myVideo.play();
        myPeer.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (userVideoStream) => {
            const userVideo = document.createElement("video");
            userVideo.srcObject = userVideoStream;
            userVideo.play();
            document.body.append(userVideo);
          });
        });
        myPeer.on("open", (id) => {
          console.log("myPeer open", id);
          myPeer.call(user.id, stream);
        });
      });
  }, []);

  return (
    <div
      className={twMerge(
        "relative overflow-hidden rounded-lg border bg-card",
        className,
      )}
      {...props}
    >
      <video
        ref={videoRef}
        className="h-full w-full rounded-lg object-cover"
      ></video>
      <div className="absolute bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2 text-center capitalize opacity-50 drop-shadow-lg">
        <h3>{user.name}</h3>
        {isMe && <h4>{"(You)"}</h4>}
      </div>
    </div>
  );
}

export default function RoomIdPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const navigate = useNavigate();
  const backendApi = useGlobalContext((state) => state.backendApi);
  const { socket } = backendApi;
  const { isLoading, error } = useSWR(
    `room-${roomId}`,
    async () => {
      const res = await backendApi.getRoom(roomId!);
      return res;
    },
    {
      onSuccess: (data) => {
        setRoom(data);
      },
    },
  );
  useEffect(() => {
    socket.emit("join-room", roomId);
    socket.on("room-not-found", () => {
      navigate("/rooms");
    });
    socket.on("user-joined", (user) => {
      setRoom((prev) => {
        if (!prev) return prev;
        return { ...prev, users: [...prev.users, user] };
      });
    });
    socket.on("user-left", (user) => {
      setRoom((prev) => {
        if (!prev) return prev;
        const index = prev.users.findIndex((u) => u.id === user.id);
        if (index === -1) return prev;
        const users = [...prev.users];
        users.splice(index, 1);
        return { ...prev, users };
      });
    });
    return () => {
      socket.emit("leave-room", roomId);
      socket.off("room-not-found");
      socket.off("user-joined");
    };
  }, []);
  if (isLoading) return <main>Loading...</main>;
  if (error) return <main>Error: {error.message}</main>;
  if (!room) return null;
  return (
    <main className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="font-bold">{room.name}</div>
        <div>{room.id}</div>
        <div>{`users (${room.users.length})`}</div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4 [&>*]:h-[16rem]">
        {room.users.map((user) => (
          <VideoCall key={user.id} user={user} />
        ))}
      </div>
    </main>
  );
}
