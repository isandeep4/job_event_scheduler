import express from "express";

import { createEventsRouter } from "./events/router";
import { Redis } from "./redis/Redis";
import maxmind, { CountryResponse } from "maxmind";
import path from "path";

const dbPath = path.join(
  __dirname,
  "..",
  "GeoLite2-Country_20230217",
  "GeoLite2-Country.mmdb"
);

async function main() {
  const redis = await Redis.CreateAndConnect("redis://localhost:6379");

  const app = express();
  app.use(express.json());

  // Middleware to capture the client's IP address and geolocation info
  app.use(async (req, res, next) => {
    let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    if (Array.isArray(ip)) {
      ip = ip[0];
    }
    // Handle localhost case
    if (ip === "::1" || ip === "127.0.0.1") {
      (req.body.countryCode = "Localhost"), next();
      return;
    }
    try {
      const lookup = await maxmind.open<CountryResponse>(dbPath);
      const location = lookup.get(ip);
      if (location && location.country && location.country.iso_code) {
        if (!req.body) {
          req.body = {};
        }
        req.body.countryCode = location.country.iso_code;
      }
    } catch (err) {
      console.log("Error opening Maxmind database:", err);
      req.body.countryCode = null;
    }
    next();
  });

  app.use("/events", await createEventsRouter(redis));

  const port = 4000;
  app.listen(port, () => {
    console.log("Web service started on port " + port);
  });
}

main();
