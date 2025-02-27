/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "../env";
import axios from "axios";
import { Room, User } from "./types";
import { io } from "socket.io-client";

export class BackendApi {
  private readonly api = axios.create({
    baseURL: env.VITE_BACKEND_URL,
  });

  private logoutCallback: () => any | Promise<any>;
  public readonly socket = io(env.VITE_BACKEND_URL, {});
  private accessToken = "";

  constructor(logoutCallback: () => any | Promise<any>) {
    this.accessToken = localStorage.getItem("accessToken") || "";
    this.api.defaults.headers.common.Authorization = `Bearer ${this.accessToken}`;
    this.socket.auth = { token: this.accessToken };

    this.socket.connect();
    this.logoutCallback = logoutCallback;

    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.log("response interceptor", error.response?.status);

        if (error.response?.status === 401) {
          await this.logoutCallback();
        }
        return Promise.reject(error);
      },
    );
  }

  isReady() {
    return this.accessToken !== "";
  }

  async login(data: { email: string; password: string }): Promise<{
    user: User;
    accessToken: string;
  }> {
    const res = await this.api.post("/auth/login", data);
    const { accessToken } = res.data;
    this.accessToken = accessToken;
    this.api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    localStorage.setItem("accessToken", accessToken);
    return res.data;
  }
  async register(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<{
    user: User;
    accessToken: string;
  }> {
    const res = await this.api.post("/auth/register", data);
    const { accessToken } = res.data;
    this.accessToken = accessToken;
    this.api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    this.socket.auth = { token: accessToken };
    localStorage.setItem("accessToken", accessToken);
    return res.data;
  }

  async getMe(): Promise<User> {
    const res = await this.api.get("/auth/me");
    return res.data;
  }

  async getRooms(): Promise<Room[]> {
    const res = await this.api.get("/rooms");
    return res.data;
  }
  async getRoom(id: string): Promise<Room> {
    const res = await this.api.get(`/rooms/${id}`);
    return res.data;
  }
}
