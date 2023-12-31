import {
    GateValue,
    ConnectionState,
    ValueMessage,
    EventName,
    SystemImage
} from "gate-core";

export interface SystemConnector {
    state: ConnectionState,
    sendValue: (gateValue: GateValue<any>) => void,
    unsubscribe: (id: string) => void,
    subscribe: (id: string) => void,
    sendDeviceEvent: (event: string, params: string[]) => void,
    joinSystem: () => void,
    disconnect: () => void,
    getCurrentPing: () => number | undefined
    addStateChangeListener: (callback: (state: ConnectionState) => void) => string,
    removeStateChangeListener: (listenerKey: string) => void,
    onDeviceEvent?: (event: EventName, data: string[]) => void,
    onValueMessage?: (message: ValueMessage) => void,
    onJoinEvent: (systemImage: SystemImage, connectedDevices: Array<string>) => void,
}