import { Transform } from 'class-transformer';

export function ArrayType() {
  return Transform(({ value }) => {
    if (Array.isArray(value)) return value;
    if (value) return [value];
    return value;
  });
}
