import dotenv from 'dotenv';
dotenv.config();

type EnvConfig = {
  PORT: number | string;
  MONGODB_URI: string | undefined;
  JWT_SECRET: string | undefined;
  NODE_ENV: string;
  GROQ_API_KEY:string | undefined,
  Model:string | undefined

};
export const env: EnvConfig = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development',
  GROQ_API_KEY:process.env.GROQ_API_KEY,
  Model:process.env.Model
};
