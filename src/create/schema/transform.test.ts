import { oas31 } from 'openapi3-ts';
import { z } from 'zod';

import { extendZodWithOpenApi } from '../../extendZod';
import { createInputState, createOutputState } from '../../testing/state';

import { createTransformSchema } from './transform';

extendZodWithOpenApi(z);

describe('createTransformSchema', () => {
  describe('input', () => {
    it('creates a schema from transform', () => {
      const expected: oas31.SchemaObject = {
        type: 'string',
      };
      const schema = z.string().transform((str) => str.length);

      const result = createTransformSchema(schema, createInputState());

      expect(result).toStrictEqual(expected);
    });

    it('changes the state effectType to input', () => {
      const schema = z.string().transform((str) => str.length);
      const state = createInputState();

      createTransformSchema(schema, state);

      expect(state.effectType).toBe('input');
    });

    it('throws an error if the effectType is output', () => {
      const schema = z.string().transform((str) => str.length);

      const state = createInputState();
      state.effectType = 'output';

      expect(() => createTransformSchema(schema, state)).toThrow(
        '{"_def":{"schema":{"_def":{"checks":[],"typeName":"ZodString","coerce":false}},"typeName":"ZodEffects","effect":{"type":"transform"}}} contains a transform but is used in both an input and an output. This is likely a mistake. Set an `effectType` to resolve',
      );
    });

    it('does not throw an error if the effectType is output and effectType is set in openapi', () => {
      const schema = z
        .string()
        .transform((str) => str.length)
        .openapi({ effectType: 'input' });

      const state = createInputState();
      state.effectType = 'output';

      createTransformSchema(schema, state);
    });
  });

  describe('output', () => {
    it('throws an error with a schema with transform', () => {
      const schema = z.string().transform((str) => str.length);

      expect(() =>
        createTransformSchema(schema, createOutputState()),
      ).toThrow();
    });

    it('creates a schema with the manual type when a type is manually specified', () => {
      const expected: oas31.SchemaObject = {
        type: 'number',
      };
      const schema = z
        .string()
        .transform((str) => str.length)
        .openapi({ type: 'number' });

      const result = createTransformSchema(schema, createOutputState());

      expect(result).toStrictEqual(expected);
    });

    it('returns a schema when creating a schema with transform when openapi effectType is set', () => {
      const expected: oas31.SchemaObject = {
        type: 'string',
      };
      const schema = z
        .string()
        .transform((str) => str.length)
        .openapi({ effectType: 'input' });

      const result = createTransformSchema(schema, createOutputState());

      expect(result).toStrictEqual(expected);
    });

    it('does not change the state effectType when openapi effectType is set', () => {
      const schema = z
        .string()
        .transform((str) => str.length)
        .openapi({ effectType: 'input' });

      const state = createOutputState();

      createTransformSchema(schema, state);

      expect(state.effectType).toBeUndefined();
    });
  });
});
