export const getId = (size: number = 8) => crypto.randomUUID().slice(0, size);
