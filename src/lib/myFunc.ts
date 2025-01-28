import { z } from "zod";

export const zodErrToString = (errors: z.ZodIssue[]): string => {
  const values = errors.map((val) => {
    const path = val.path.length === 0 ? "[General]" : val.path[0];
    return `[${path}] - ${val.message}`;
  });
  return values.join(", ");
};
