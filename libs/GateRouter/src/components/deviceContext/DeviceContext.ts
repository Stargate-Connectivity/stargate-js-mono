import {DeviceConnector} from "../../api/DeviceConnector";
import {Registry, ValueMessage} from "gate-core";
import {Device} from "./Device";
import Router from "../../api/Router";
import {ValueMessageConsumer} from "../../interfaces/ValueMessageConsumer";

const deviceRegistry = new Registry<Device>();

const addDevice = async (deviceConnector: DeviceConnector) => {
    new Device(deviceConnector);
}

const forwardValueMessage = (valueMessage: ValueMessage) => {
    valueMessage.forEach((message) => {
        const [deviceId, valueId] = Router.extractTargetId(message[0]);
        const device = deviceRegistry.getByKey(deviceId);
        if (device) {
            device.sendValue([valueId, message[1]]);
        }
    });
}

const handleSubscription = (ids: string[], source: ValueMessageConsumer | string) => {
    const devicesMap = new Map<string, string[]>();
    ids.forEach((idWithParent) => {
        const [parentId, valueId] = Router.extractTargetId(idWithParent);
        let message = devicesMap.get(parentId);
        if (message) {
            message.push(valueId);
        } else {
            devicesMap.set(parentId, [valueId]);
        }
    });
    devicesMap.forEach((message, deviceId) => {
        const targetDevice = deviceRegistry.getByKey(deviceId);
        if (targetDevice) {
            if (typeof source === 'string') {
                message.forEach((id) => {
                    targetDevice.unsubscribe(id, source);
                });
            } else {
                message.forEach((id) => {
                    targetDevice.subscribe(id, source);
                });
            }
        }
    });
}

const forwardSubscribed = (ids: string[], source: ValueMessageConsumer) => {
    handleSubscription(ids, source);
}

const forwardUnsubscribed = (ids: string[], sourceId: string) => {
    handleSubscription(ids, sourceId);
}

const getActiveDeviceIds = (): string[] => {
    return deviceRegistry.getValues().map((device) => device.id);
}

const unsubscribeConsumer = (consumerId: string) => {
    deviceRegistry.getValues().forEach((device) => device.unsubscribeConsumer(consumerId));
}

const DeviceContext = {
    deviceRegistry,
    addDevice,
    forwardValueMessage,
    forwardSubscribed,
    forwardUnsubscribed,
    getActiveDeviceIds,
    unsubscribeConsumer
}

export default DeviceContext;
