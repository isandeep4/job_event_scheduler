"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = require("./events/router");
const Redis_1 = require("./redis/Redis");
const maxmind_1 = __importDefault(require("maxmind"));
const path_1 = __importDefault(require("path"));
const dbPath = path_1.default.join(__dirname, "..", "GeoLite2-Country_20230217", "GeoLite2-Country.mmdb");
async function main() {
    const redis = await Redis_1.Redis.CreateAndConnect("redis://localhost:6379");
    const app = (0, express_1.default)();
    app.use(async (req, res, next) => {
        let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        if (Array.isArray(ip)) {
            ip = ip[0];
        }
        console.log("ip", ip);
        try {
            const lookup = await maxmind_1.default.open(dbPath);
            // req.countryCode = lookup.get(ip).clientLocation.country.iso_code;
            console.log(req);
        }
        catch (err) {
            console.log("Error opening Maxmind database:", err);
            req.countryCode = null;
        }
        next();
    });
    app.use(express_1.default.json());
    app.use("/events", await (0, router_1.createEventsRouter)(redis));
    const port = 4000;
    app.listen(port, () => {
        console.log("Web service started on port " + port);
    });
}
main();
//# sourceMappingURL=app.js.map