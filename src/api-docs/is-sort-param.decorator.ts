import { ValidateIf, ValidationOptions } from 'class-validator';

export function IsSortParam<T extends Record<string, any>>(
  keys: (keyof T)[],
  validationOptions?: ValidationOptions,
) {
  function validator(value: string) {
    /** Remove sort operator */
    const field = value.replace(/^[-+]/, '');
    /** Check if acceptable sort fields */
    return keys.includes(field);
  }

  return ValidateIf((_, value) => validator(value), validationOptions);
}
