import dotenv from 'dotenv';
dotenv.config();

type EnvConfig = {
  PORT: number | string;
  MONGODB_URI: string | undefined;
  JWT_SECRET: string | undefined;
  NODE_ENV: string;
  EXTRNEL_API_URL: string | undefined;
};
export const env: EnvConfig = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
  EXTRNEL_API_URL: process.env.EXTRNEL_API_URL,

};
