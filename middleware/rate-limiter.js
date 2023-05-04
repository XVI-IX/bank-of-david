const { StatusCodes } = require("http-status-codes");

const Redis = require('ioredis');
const redis = new Redis();

const limiter = async (req, res, next) => {
  try {
    const token = req.headers.token;
    const exists = await redis.exists(token);

    if (exists === 1) {
      const result = await redis.get(token);
      const data = JSON.parse(result);
      const currentTime = new Date().getTime();
      const timeDiff = (currentTime - data.timeStamp) / 60000;

      if (timeDiff >= 1) {
        // if time limit exceeded
        const body = {
          count: 1,
          timeStamp: new Date().getTime()
        };

        await redis.set(token, JSON.stringify(body));
        return next();
      }
      if (timeDiff < 1) {
        // if within time limit
        if (data.count > 3) {
          // if allowed access times exceeded
          return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
            error: -1,
            msg: "API access limit exceeded"
          });
        }
      }
      data.count++;
      await redis.set(token, JSON.stringify(data));
      return next();

    } else {
      // Create new redis key:value pair
      const body = {
        count: 1,
        timeStamp: new Date().getTime()
      }

      await redis.set(token, JSON.stringify(body));
      next();
    }
  } catch (error) {
    res.status(StatusCodes.BAD_GATEWAY).json({
      error: -1,
      msg: "Redis could not connect"
    })
  }
}

module.exports = limiter;