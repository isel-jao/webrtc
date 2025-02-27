import { useGlobalContext } from "@/context";
import { AxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function LoginPage() {
  const [formType, setFormType] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const backendApi = useGlobalContext((state) => state.backendApi);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      if (formType === "login") {
        await backendApi.login({ email, password });
      } else {
        await backendApi.register({ name, email, password });
      }
      navigate("/");
    } catch (error) {
      if (
        error instanceof AxiosError &&
        error.response?.status &&
        [401, 404, 403].includes(error.response.status)
      ) {
        toast.error("Invalid email or password");
      } else {
        toast.error(
          "An error occurred. Please try again later or contact support.",
        );
      }
    }
  }

  function switchFormType() {
    setFormType((prev) => (prev === "login" ? "register" : "login"));
  }

  return (
    <main className="container flex items-center justify-center">
      <form
        className="flex flex-col rounded-lg border bg-card p-6 [&>label]:mt-4 [&>label]:inline-block"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-3xl font-bold uppercase">
          {formType === "login" ? "login" : "register"}
        </h1>
        {formType === "register" && (
          <>
            <label htmlFor="name" className="mt-4 inline-block">
              name
            </label>
            <input
              id="name"
              className="rounded bg-foreground/10 px-3 py-1.5"
              name="name"
              required
            />
          </>
        )}
        <label htmlFor="email" className="mt-4 inline-block">
          email
        </label>
        <input
          className="rounded bg-foreground/10 px-3 py-1.5"
          id="email"
          type="email"
          name="email"
          required
        />
        <label htmlFor="password" className="mt-4 inline-block">
          password
        </label>
        <input
          id="password"
          className="rounded bg-foreground/10 px-3 py-1.5"
          type="password"
          name="password"
          required
        />
        <button className="mt-4 rounded bg-primary px-3 py-1.5 text-primary-foreground">
          submit
        </button>
        <button className="mt-4 hover:underline" onClick={switchFormType}>
          {formType === "login" ? "register" : "login"}
        </button>
      </form>
    </main>
  );
}
