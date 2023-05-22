require("dotenv").config();

const cron = require("node-cron");
const Redis = require("ioredis");

const {
  REDIS_SERVICE_NAME,
  REDIS_PORT
} = process.env;

// This will only work on Render hosted services
const redis = new Redis({
  // Use Render Redis service name as host, red-xxxxxxxxxxxxxxxxxxxx
  host: REDIS_SERVICE_NAME,
  // Default Redis port
  port: REDIS_PORT || 6379,
});


const job = require("./cronJob");

const paymentCron = async () => {
  const schedules = await redis.get("payment_schedules")
  const data = JSON.parse(schedules);

  for (let schedule in data) {
    if (schedule.frequency === "daily") {
      cron.schedule("* */23 * *", job)
    } else if (schedule.frequency === "weekly") {
      cron.schedule(`* * * * */${schedule.day}`, job)
    } else if (schedule.frequency === "monthly") {
      cron.schedule(`* * */${schedule.date} * *`, job)
    } else {
      return res.json({
        msg: "Invalid frequency",
        error: -1
      });
    }
  }
}

module.exports = paymentCron;