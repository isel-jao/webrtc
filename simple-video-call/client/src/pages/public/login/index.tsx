import { useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigate("/");
  }

  return (
    <main className="container flex items-center justify-center">
      <form
        className="flex flex-col rounded-lg border bg-card p-6"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center">LOGO</h1>
        <label htmlFor="email">email</label>
        <input
          className="rounded bg-foreground/10 px-3 py-1.5"
          id="email"
          type="email"
        />
        <label htmlFor="password" className="mt-4 inline-block">
          password
        </label>
        <input
          id="password"
          className="rounded bg-foreground/10 px-3 py-1.5"
          type="password"
        />
        <button className="mt-4 rounded bg-primary px-3 py-1.5 text-primary-foreground">
          submit
        </button>
      </form>
    </main>
  );
}
