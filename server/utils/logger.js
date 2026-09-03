import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  serializers: {
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
    err: pino.stdSerializers.err,
  },
  // transport: {
  //   targets: [
  //     {
  //       target: "pino/file",
  //       options: { destination: "./app.log" },
  //       level: "info",
  //     },
  //     {
  //       target: "pino-pretty",
  //       options: { colorize: true },
  //       level: ''
  //     },
  //   ],
  // },
});

export default logger;
