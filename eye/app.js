import { createServer } from "http";
import { Server, Socket } from "socket.io";
import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import logger from "morgan";
import "dotenv/config";
import axios from "axios";
import { RedisClient } from "redis";
import { createAdapter } from "socket.io-redis";
const { PORT } = process.env || 8081;

const eye = express();

eye.use(helmet());
eye.use(compression());
eye.use(cors());
eye.use(logger("dev"));

const eye_synapse = createServer(eye);
const nerve = new Server(eye_synapse, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  pingTimeout: 15000,
  pingInterval: 20000,
  maxHttpBufferSize: 1e8,
  transports: ["polling", "websocket"],
  allowUpgrades: true,
  perMessageDeflate: false,
  httpCompression: {
    threshold: 1024,

    chunkSize: 12 * 1024,
    windowBits: 14,
    memLevel: 7,
  },
  allowEIO3: true,
});
/*
const pubClient = new RedisClient({
  host: "localhost",
  port: 6379,
});
const subClient = pubClient.duplicate();

pubClient.on("error", (error) => {
  console.log("redis output : ", error);
});

nerve.adapter(createAdapter({ pubClient, subClient }));

const redisSetValue = async (key, value) => {
  return new Promise((resolve, reject) => {
    pubClient.set(key, value, (err, reply) => {
      if (err) return false;
      return true;
    });
  });
};

const redisGetValue = async (key) => {
  return new Promise((resolve, reject) => {
    pubClient.get(key, (err, reply) => {
      if (err) return false;
      return resolve(reply);
    });
  });
};
*/
const object_nerve = nerve.of("/look_object");
const brain_url = "http://localhost:8082";

object_nerve.on("connection", async (visual_info) => {
  visual_info.on("look_object", async (visual_object) => {
    try {
      let reply_data = "";
      await axios
        .post(`${brain_url}/synapse/object_data`, {
          visual_object: visual_object,
        })
        .then((res) => {
          reply_data: res.data.result;
        });
      await object_nerve.emit("look_object", reply_data);
    } catch (error) {
      console.log(error);
    }
  });
});
