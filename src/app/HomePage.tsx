"use client";

import { createPost } from "@/lib/action/posts";
import { postSchema } from "@/lib/action/posts/schema";
import { PostList, UserOptionList } from "@/lib/types";
import React, { useActionState, useCallback, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useHandleActionState from "@/hooks/useHandleActionState";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";

interface Props {
  posts: PostList[];
  users: UserOptionList[];
}

const HomePage = ({ posts, users }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [createState, createAction] = useActionState(createPost, {
    type: "init",
    data: null,
  });

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  function onSubmit(values: z.infer<typeof postSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const dataCreate = new FormData();
    dataCreate.append("title", values.title);
    dataCreate.append("content", values.content);
    dataCreate.append("authorId", String(values.authorId));

    startTransition(() => createAction(dataCreate));
  }

  const handleCancle = useCallback(() => {
    form.reset();
  }, [form]);

  useHandleActionState(
    createState,
    (dataSuccess) => `Success create post #${dataSuccess.id}`,
    () => {
      form.reset();
    }
  );
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="enter title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="enter content"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="authorId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users.map((item) => {
                      return (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              Submit
            </Button>
            <Button type="button" variant="outline" onClick={handleCancle}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
      <hr className="my-8" />
      <div className="grid grid-cols-1 gap-4">
        {posts.map((item) => {
          return (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>
                  {item.author} | {dayjs(item.createdAt).format("DD MMM YYYY")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{item.content}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
