import { http } from "msw";
import loginHandler from "./handlers/login.handler";

export const handlers = [http.post("/api/auth/login", loginHandler)];
