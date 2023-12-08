import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import configs from "../configs/configs";

export const encryptPassword = async (password: string) => {
  const encryptedPassword = await bcrypt.hash(password, 8);
  return encryptedPassword;
};

export const isPasswordMatch = async (password: string, userPassword: string) => {
  return bcrypt.compare(password, userPassword);
};

export const generateFakeJwt = async (): Promise<string> => {
  const fakeUser = {
    userId: 'testUser',
    scopes: ['read', 'write']
  };
  return jwt.sign(fakeUser, configs.jwt.secret, { expiresIn: '1h' });
};
