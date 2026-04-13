import { z } from 'zod';

export function parseResult(schema: z.ZodTypeAny, data: unknown) {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true as const, data: result.data };
  }
  const errors = result.error.issues.map((e) => ({
    path: e.path.join('.'),
    message: e.message,
  }));
  return { success: false as const, errors };
}
