import dgram from "dgram";
import {CoreConfig} from "gate-core";
import express from 'express';

let serverIp: string | undefined;
let discoveryRunning = false;
let discoveryTimeout: NodeJS.Timeout | undefined;

interface DiscoveryService {
    initialize: () => void,
    getServerIp: () => string | undefined
}

const initialize = () => {
    if (!discoveryRunning) {
        const app = express();
        const port = CoreConfig.hubDiscoveryPort;
        app.get('/', function(req, res) {
            if (serverIp !== undefined) {
                res.send(serverIp);
            } else {
                res.sendStatus(204);
            }
        });
        app.listen(port);

        discoveryRunning = true;
        serverIp = undefined;
        const socket = dgram.createSocket('udp4');

        socket.on('message', function (message, remote) {
            if (message.toString() === CoreConfig.discoveryKeyword) {
                if (serverIp === undefined) {
                    console.log("Server detected at " + remote.address);
                }
                if (discoveryTimeout) {
                    clearTimeout(discoveryTimeout);
                }
                serverIp = remote.address;
                discoveryTimeout = setTimeout(() => {
                    serverIp = undefined;
                    console.log("Server offline");
                }, 2 * CoreConfig.discoveryInterval);
            }
        });

        socket.on('error', () => {
            console.log('Discovery socket failed. Retrying...');
            setTimeout(() => socket.bind(CoreConfig.discoveryPort), CoreConfig.discoveryInterval);
        });
        socket.bind(CoreConfig.discoveryPort);
    }
}

const getServerIp = () => {
    return serverIp;
}

const discoveryService: DiscoveryService = {
    initialize,
    getServerIp
}

export default discoveryService;
