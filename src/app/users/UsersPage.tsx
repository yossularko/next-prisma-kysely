"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, {
  useActionState,
  useCallback,
  useState,
  useTransition,
} from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { userSchema } from "@/lib/action/users/schema";
import { UserList } from "@/lib/types";
import { createUser, deleteUser, updateUser } from "@/lib/action/users";
import useHandleActionState from "@/hooks/useHandleActionState";
import { useToast } from "@/hooks/use-toast";

interface Props {
  data: UserList[];
}

const UsersPage = ({ data }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [createState, createAction] = useActionState(createUser, {
    type: "init",
    data: null,
  });

  const [updateState, updateAction] = useActionState(updateUser, {
    type: "init",
    data: null,
  });

  const [delState, delAction] = useActionState(deleteUser, {
    type: "init",
    data: null,
  });

  const [recordId, setRecordId] = useState<number | null>(null);
  const [isFormUpdate, setIsFormUpdate] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
    },
  });

  function onSubmit(values: z.infer<typeof userSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    if (isFormUpdate) {
      if (!recordId) {
        toast({
          title: "Error",
          description: "User id is not found!",
          variant: "destructive",
        });
        return;
      }

      const dataUpdate = new FormData();
      dataUpdate.append("id", String(recordId));
      dataUpdate.append("name", values.name);
      dataUpdate.append("email", values.email);
      dataUpdate.append("bio", values.bio);

      startTransition(() => updateAction(dataUpdate));
      return;
    }

    const dataCreate = new FormData();
    dataCreate.append("name", values.name);
    dataCreate.append("email", values.email);
    dataCreate.append("bio", values.bio);

    startTransition(() => createAction(dataCreate));
  }

  const handleCancle = useCallback(() => {
    setRecordId(null);
    setIsFormUpdate(false);
    form.reset();
  }, [form]);

  const handleSetUpdate = useCallback(
    (record: UserList) => {
      setRecordId(record.id);
      setIsFormUpdate(true);
      form.setValue("name", record.name || "");
      form.setValue("email", record.email || "");
      form.setValue("bio", record.bio || "");
    },
    [form]
  );

  const handleDelItem = useCallback((record: UserList) => {
    startTransition(() => delAction(record.id));
  }, []);

  useHandleActionState(
    createState,
    (dataSuccess) => `Success create user #${dataSuccess.id}`,
    () => {
      setRecordId(null);
      setIsFormUpdate(false);
      form.reset();
    }
  );

  useHandleActionState(
    updateState,
    (dataSuccess) => `Success update user #${dataSuccess.id}`,
    () => {
      setRecordId(null);
      setIsFormUpdate(false);
      form.reset();
    }
  );

  useHandleActionState(
    delState,
    () => "Success delete user",
    () => {
      setRecordId(null);
      setIsFormUpdate(false);
      form.reset();
    }
  );

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 items-end"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input placeholder="enter bio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending}>
              {isFormUpdate ? "Update" : "Submit"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancle}>
              Cancel
            </Button>
          </div>
        </form>
      </Form>
      <Table className="mt-6">
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Bio</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell
                  className="font-bold cursor-pointer"
                  onClick={() => handleSetUpdate(item)}
                >
                  {item.id}
                </TableCell>
                <TableCell
                  className="font-bold cursor-pointer"
                  onClick={() => handleSetUpdate(item)}
                >
                  {item.name}
                </TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell className="text-xs font-light line-clamp-2">
                  {item.bio}
                </TableCell>
                <TableCell className="w-[80px]">
                  <Button
                    size="icon"
                    variant="destructive"
                    disabled={isPending}
                    onClick={() => handleDelItem(item)}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersPage;
