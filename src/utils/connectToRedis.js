import Redis from "ioredis";

const connectToRedis = () =>
  new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  });

export default connectToRedis;
