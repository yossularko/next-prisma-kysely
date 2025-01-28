import { Button } from "@/components/ui/button";
import { db } from "@/lib/database";

export default async function Home() {
  const users = await db
    .selectFrom("User")
    .innerJoin("Profile", "Profile.userId", "User.id")
    .selectAll()
    .orderBy("name", "asc")
    .execute();

  return (
    <div>
      <Button>Click Me</Button>
      <div>
        <pre>
          <code>{JSON.stringify(users, null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
