export type ActionRes<T> =
  | { type: "init"; data: null }
  | { type: "success"; data: T }
  | { type: "error"; error: { message: string; code: string | number } };

export type UserList = {
  id: number;
  email: string;
  name: string | null;
  bio: string | null;
  userId: number;
};

export type UserOptionList = {
  id: number;
  email: string;
  name: string | null;
};

export type PostList = {
  createdAt: Date;
  title: string;
  id: number;
  content: string | null;
  author: string | null;
};
