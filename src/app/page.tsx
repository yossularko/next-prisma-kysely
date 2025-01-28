import { db } from "@/lib/database";
import HomePage from "./HomePage";

export default async function Home() {
  const [posts, users] = await Promise.all([
    db
      .selectFrom("Post")
      .innerJoin("User", "User.id", "Post.authorId")
      .select([
        "Post.id",
        "title",
        "Post.content",
        "createdAt",
        "User.name as author",
      ])
      .orderBy("createdAt", "desc")
      .execute(),
    db.selectFrom("User").selectAll().execute(),
  ]);

  return <HomePage posts={posts} users={users} />;
}
