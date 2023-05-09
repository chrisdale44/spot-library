import Redis from "ioredis";

// TODO: reuse any existing redis connection or this isn't an issue in production?

const connectToRedis = () => new Redis(process.env.REDIS_URL);

export default connectToRedis;
