import { Link } from "react-router";

export default function NotfoundPage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <h1>404</h1>
      <p className="text-2xl">Page not found.</p>
      <Link className="text-info underline" to="/">
        Go back to home
      </Link>
    </main>
  );
}
