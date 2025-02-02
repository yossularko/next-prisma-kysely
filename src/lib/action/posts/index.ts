"use server";

import { z } from "zod";
import { ActionRes, PostList } from "@/lib/types";
import { postSchema } from "./schema";
import { zodErrToString } from "@/lib/myFunc";
import { db } from "@/lib/database";
import dayjs from "dayjs";
import { revalidatePath } from "next/cache";

export const createPost = async (
  initState: ActionRes<PostList>,
  body: FormData
): Promise<ActionRes<PostList>> => {
  try {
    const unvalidates: z.infer<typeof postSchema> = {
      title: body.get("title") as string,
      content: body.get("content") as string,
      authorId: body.get("authorId") as unknown as number,
    };

    const validated = postSchema.safeParse(unvalidates);

    if (!validated.success) {
      const msg = zodErrToString(validated.error.issues);
      return (initState = {
        type: "error",
        error: { message: msg, code: 400 },
      });
    }

    const { title, content, authorId } = validated.data;

    if (!authorId) {
      return (initState = {
        type: "error",
        error: { message: "Author Id could not be empty", code: 400 },
      });
    }

    const post = await db
      .insertInto("Post")
      .values({
        title,
        content,
        authorId,
        updatedAt: dayjs().format("YYYY-MM-DD"),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const response: PostList = {
      id: post.id,
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      author: String(post.authorId),
      published: post.published,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };

    revalidatePath("/");

    return (initState = { type: "success", data: response });
  } catch (error) {
    return (initState = {
      type: "error",
      error: { message: String(error), code: 500 },
    });
  }
};
