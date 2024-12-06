import redis from "redis";

export const client = redis.createClient({
  url: process.env.REDIS_PORT, // Default Redis connection
});
client.on("connect", () => {
  console.log("Connected to Redis");
});
client.on("error", (err) => {
  console.error("Redis connection error:", err);
});
