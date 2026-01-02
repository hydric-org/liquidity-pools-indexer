export const String = {
  lowercasedEquals: (a: string, b: string): boolean => a.toLowerCase() === b.toLowerCase(),
  sanitize: (value: string): string => value.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim(),
};
