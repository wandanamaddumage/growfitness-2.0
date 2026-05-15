import { z } from 'zod';
import { CreateFreeSessionRequestSchema } from '@grow-fitness/shared-schemas';
import type { CreateFreeSessionRequestDto } from '@grow-fitness/shared-schemas';

/** Wizard fields only — avoids validating sessionType/locationId before they exist. */
export const FreeSessionFormSchema = CreateFreeSessionRequestSchema.pick({
  parentName: true,
  phone: true,
  email: true,
  kidName: true,
  selectedSessionId: true,
}).extend({
  selectedSessionId: z.string().min(1, 'Select an available session.'),
});

export type FreeSessionFormValues = z.infer<typeof FreeSessionFormSchema>;

/** Per-step field validators for the Book a Free Session flow. */
export const freeSessionStepSchemas = {
  parentName: FreeSessionFormSchema.shape.parentName,
  phone: FreeSessionFormSchema.shape.phone,
  email: FreeSessionFormSchema.shape.email,
  kidName: FreeSessionFormSchema.shape.kidName,
  selectedSessionId: FreeSessionFormSchema.shape.selectedSessionId,
} as const satisfies Record<
  keyof Pick<
    CreateFreeSessionRequestDto,
    'parentName' | 'phone' | 'email' | 'kidName' | 'selectedSessionId'
  >,
  z.ZodTypeAny
>;

export type FreeSessionStepField = keyof typeof freeSessionStepSchemas;

export function validateFreeSessionStepField(
  field: FreeSessionStepField,
  value: unknown
): { success: true } | { success: false; message: string } {
  const schema = freeSessionStepSchemas[field];
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true };
  }
  const message = result.error.issues[0]?.message ?? 'This field is invalid.';
  return { success: false, message };
}
