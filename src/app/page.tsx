import { db } from "@/lib/database";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import HomePage from "./HomePage";

export default async function Home() {
  const [posts, users] = await Promise.all([
    db
      .selectFrom("Post")
      .innerJoin("User", "User.id", "Post.authorId")
      .selectAll("Post")
      .select(["User.name as author"])
      .orderBy("createdAt", "desc")
      .execute(),
    db.selectFrom("User").selectAll().execute(),
  ]);

  const postByUser = await db
    .selectFrom("User")
    .selectAll("User")
    .select((eb) => {
      return [
        jsonArrayFrom(
          eb
            .selectFrom("Post")
            .selectAll("Post")
            .whereRef("Post.authorId", "=", "User.id")
        ).as("posts"),
      ];
    })
    .execute();

  console.log("post by user: ", JSON.stringify(postByUser, null, 2));

  return <HomePage posts={posts} users={users} />;
}
