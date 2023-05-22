require("dotenv").config();
const { REDIS_URL } = process.env

const cron = require("node-cron");
const Redis = require("ioredis");
const redis = new Redis();

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