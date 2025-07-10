import { HttpResponse } from "msw";

const loginHandler = async ({ request }: { request: Request }) => {
  const { id, password } = await request.json();

  if (id === "admin" && password === "1234") {
    const token = "mock-jwt-token";

    return HttpResponse.json(
      {
        message: "Login successful",
        token,
        user: {
          id: "1",
          username: "admin",
        },
      },
      {
        status: 200,
      }
    );
  }

  return HttpResponse.json({ message: "Invalid credentials" }, { status: 401 });
};

export default loginHandler;
