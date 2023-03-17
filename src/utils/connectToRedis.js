import Redis from "ioredis";

// TODO: reuse any existing redis connection or this isn't an issue in production?

const connectToRedis = () =>
  new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_URL,
    password: process.env.REDIS_PASSWORD,
  });

export default connectToRedis;
