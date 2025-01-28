import { db } from "@/lib/database";
import React from "react";
import UsersPage from "./UsersPage";

const Page = async () => {
  const users = await db
    .selectFrom("User")
    .innerJoin("Profile", "Profile.userId", "User.id")
    .selectAll()
    .orderBy("name", "asc")
    .execute();
  return <UsersPage data={users} />;
};

export default Page;
