import React from "react";
import { NavLink, useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { cn } from "../../utils/functions";
import { useGlobalContext } from "@/context";

const links = [
  {
    name: "home",
    to: "/",
  },
  {
    name: "rooms",
    to: "/rooms",
  },
];

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface UpbarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {}

export default function Upbar({ className, ...props }: UpbarProps) {
  const navigate = useNavigate();
  const user = useGlobalContext((state) => state.user);
  function SignOut() {
    // sign out logic
    navigate("/login");
  }
  return (
    <header
      className={twMerge("bg-card/50 shadow backdrop-blur", className)}
      {...props}
    >
      <nav className="container flex h-full items-center gap-4 px-container">
        {links.map(({ name, to }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive, isPending, isTransitioning }) =>
              cn("capitalize transition-colors hover:text-primary", {
                "text-primary": isActive,
                "animate-pulse": isPending || isTransitioning,
              })
            }
          >
            {name}
          </NavLink>
        ))}
        <div className="ml-auto flex items-center gap-4">
          {user && <span className="font-bold capitalize">{user.name}</span>}
          <button
            onClick={SignOut}
            className="rounded border px-2 py-1 capitalize hover:bg-foreground/10"
          >
            sign out
          </button>
        </div>
      </nav>
    </header>
  );
}
