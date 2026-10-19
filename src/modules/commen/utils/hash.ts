import { compare, hash } from "bcrypt";

export const generateHash = async (plainText: string, saltRound = 12) => {
  return hash(plainText, saltRound);
};

export const compareHash = async (plainText: string, hashed: string) => {
  return compare(plainText, hashed);
};