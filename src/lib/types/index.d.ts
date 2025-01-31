import { Post, Profile, User } from "@prisma/client";

export type ActionRes<T> =
  | { type: "init"; data: null }
  | { type: "success"; data: T }
  | { type: "error"; error: { message: string; code: string | number } };

export type UserList = User & Omit<Profile, "id">

export type PostList = Post & {
  author: string | null;
};
