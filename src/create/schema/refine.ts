import { oas31 } from 'openapi3-ts';
import { ZodEffects, ZodType } from 'zod';

import { SchemaState, createSchemaOrRef } from '.';

export const createRefineSchema = (
  zodRefine: ZodEffects<any, any, any>,
  state: SchemaState,
): oas31.SchemaObject | oas31.ReferenceObject =>
  createSchemaOrRef(zodRefine._def.schema as ZodType, state);