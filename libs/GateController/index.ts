import config from "./config.js";
import {getSystemModel} from "./src/GateController";
import {LocalServerConnector} from "./src/LocalServerConnector";

if (process.env.HUB_DISCOVERY_PORT) {
    config.hubDiscoveryPort = Number.parseInt(process.env.HUB_DISCOVERY_PORT);
}
if (process.env.DISCOVERY_KEYWORD) {
    config.discoveryKeyword = process.env.DISCOVERY_KEYWORD;
}
if (process.env.DISCOVERY_PORT) {
    config.discoveryPort = Number.parseInt(process.env.DISCOVERY_PORT);
}
if (process.env.DISCOVERY_INTERVAL) {
    config.discoveryInterval = Number.parseInt(process.env.DISCOVERY_INTERVAL);
}
if (process.env.QUERY_TIMEOUT) {
    config.queryTimeout = Number.parseInt(process.env.QUERY_TIMEOUT);
}
if (process.env.HANDSHAKE_TIMEOUT) {
    config.handshakeTimeout = Number.parseInt(process.env.HANDSHAKE_TIMEOUT);
}
if (process.env.USE_FIXED_URL) {
    config.useFixedUrl = process.env.USE_FIXED_URL.toLowerCase() === 'true';
}
if (process.env.FIXED_URL) {
    config.fixedUrl = process.env.FIXED_URL;
}

export {
    LocalServerConnector,
    getSystemModel,
    config
};
