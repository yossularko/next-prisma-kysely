"use server";
import { ActionRes, UserList } from "@/lib/types";
import { z } from "zod";
import { userSchema } from "./schema";
import { zodErrToString } from "@/lib/myFunc";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/database";

export const createUser = async (
  initState: ActionRes<UserList>,
  body: FormData
): Promise<ActionRes<UserList>> => {
  try {
    const unvalidates: z.infer<typeof userSchema> = {
      name: body.get("name") as string,
      email: body.get("email") as string,
      bio: body.get("bio") as string,
    };

    const validated = userSchema.safeParse(unvalidates);

    if (!validated.success) {
      const msg = zodErrToString(validated.error.issues);
      return (initState = {
        type: "error",
        error: { message: msg, code: 400 },
      });
    }

    const { name, email, bio } = validated.data;

    const user = await db
      .insertInto("User")
      .values({ name, email })
      .returningAll()
      .executeTakeFirstOrThrow();

    const profile = await db
      .insertInto("Profile")
      .values({ userId: user.id, bio })
      .returningAll()
      .executeTakeFirstOrThrow();

    const response: UserList = {
      ...user,
      bio: profile.bio,
      userId: profile.userId,
    };

    revalidatePath("/users");

    return (initState = { type: "success", data: response });
  } catch (error) {
    return (initState = {
      type: "error",
      error: { message: String(error), code: 500 },
    });
  }
};

export const updateUser = async (
  initState: ActionRes<UserList>,
  body: FormData
): Promise<ActionRes<UserList>> => {
  try {
    const id = body.get("id") as string;

    if (!id) {
      return (initState = {
        type: "error",
        error: {
          message: "Id is not found!",
          code: 400,
        },
      });
    }

    const unvalidates: z.infer<typeof userSchema> = {
      name: body.get("name") as string,
      email: body.get("email") as string,
      bio: body.get("bio") as string,
    };

    const validated = userSchema.safeParse(unvalidates);

    if (!validated.success) {
      const msg = zodErrToString(validated.error.issues);
      return (initState = {
        type: "error",
        error: { message: msg, code: 400 },
      });
    }

    const { name, email, bio } = validated.data;

    const user = await db
      .updateTable("User")
      .set({ name, email })
      .where("id", "=", Number(id))
      .returningAll()
      .executeTakeFirstOrThrow();

    const profile = await db
      .updateTable("Profile")
      .set({ bio })
      .where("userId", "=", Number(id))
      .returningAll()
      .executeTakeFirstOrThrow();

    const response: UserList = {
      ...user,
      bio: profile.bio,
      userId: profile.userId,
    };

    revalidatePath("/users");

    return (initState = { type: "success", data: response });
  } catch (error) {
    return (initState = {
      type: "error",
      error: { message: String(error), code: 500 },
    });
  }
};

export const deleteUser = async (
  initState: ActionRes<{ message: string }>,
  id: number
): Promise<ActionRes<{ message: string }>> => {
  try {
    if (!id) {
      return (initState = {
        type: "error",
        error: { message: "Id is could not be empty", code: 400 },
      });
    }

    await db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom("Profile")
        .where("userId", "=", Number(id))
        .executeTakeFirstOrThrow();
      await trx
        .deleteFrom("User")
        .where("id", "=", Number(id))
        .executeTakeFirstOrThrow();
    });

    revalidatePath("/users");

    return (initState = {
      type: "success",
      data: { message: `success delete user #${id}` },
    });
  } catch (error) {
    return (initState = {
      type: "error",
      error: { message: String(error), code: 500 },
    });
  }
};
