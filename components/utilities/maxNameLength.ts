export const maxNameLength = (name: string, length: number) => {
  if (length < 4) return name;
  return name.length > length ? name.slice(0, length - 3) + '...' : name;
};
