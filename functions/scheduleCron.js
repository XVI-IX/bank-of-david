const cron = require("node-cron");
const Redis = require("ioredis");
const redis = new Redis();

const { send } = require("./sendFunds");
const { Account } = require("../models");
const job = require("./cronJob");

const paymentCron = async () => {
  const schedules = await redis.get("payment_schedules")
  const data = JSON.parse(schedules);

  for (let schedule in data) {
    if (schedule.frequency === "daily") {
      cron.schedule("* * */23 * *", job)
    } else if (schedule.frequency === "weekly") {
      cron.schedule("")
    }
  }
}