import {GateValue} from "../../values/components/GateValue.js";
import {ValueMessage} from "../../../interfaces/ValueMessage.js";
import MessageMapper from "./MessageMapper.js";

export class OutputBuffer {
    private _buffer: Map<string, string> = new Map<string, string>();
    private _functionalBuffer = '';
    private _sendFunction: ((message: string) => void) | undefined;
    private _lastMessageTimestamp?: number;
    private readonly _onPingChange: (ping: number) => void;

    constructor(onPingChange: (ping: number) => void) {
        this._onPingChange = onPingChange;
    }

    sendGateValue = (gateValue: GateValue<any>) => {
        if (this._sendFunction && gateValue.id) {
            this._buffer.set(gateValue.id, gateValue.toString());
            this._flushLater();
        }
    }

    sendValue = (value: [string, string]) => {
        if (this._sendFunction) {
            this._buffer.set(value[0], value[1]);
            this._flushLater();
        }
    }

    sendFunctionalMessage = (message: string) => {
        this._functionalBuffer += message;
        this._flushLater();
    }

    sendAcknowledge = () => {
        this._functionalBuffer += MessageMapper.acknowledge();
        this._flush();
    }

    acknowledgeReceived = () => {
        if (this._lastMessageTimestamp) {
            this._onPingChange(Math.round((Date.now() - this._lastMessageTimestamp)/2));
        }
        this._lastMessageTimestamp = undefined;
        if (this._hasContent()) {
            this._flushLater();
        }
    }

    setConnected = (sendFunction: ((message: string) => void) | undefined) => {
        this._clear();
        this._sendFunction = sendFunction;
        this._lastMessageTimestamp = undefined;
    }

    close = () => {
        this._clear();
        this._sendFunction = undefined;
        this._lastMessageTimestamp = undefined;
    }

    private _toString = (): string => {
        const valueMessage: ValueMessage = [...this._buffer.entries()];
        return this._functionalBuffer + MessageMapper.serializeValueMessage(valueMessage);
    }

    private _flush = () => {
        if (this._sendFunction && this._hasContent()) {
            const message = this._toString();
            if (message.length) {
                this._sendFunction(message);
            }
            this._clear();
        }
    }

    private _clear = () => {
        this._buffer = new Map<string, string>();
        this._functionalBuffer = '';
    }

    private _hasContent = (): boolean => {
        return !!this._buffer.size || !!this._functionalBuffer.length;
    }

    private _flushLater = () => {
        if (this._lastMessageTimestamp === undefined) {
            this._lastMessageTimestamp = Date.now();
            process.nextTick(() => {
                if (this._hasContent()) {
                    this._flush();
                } else {
                    this._lastMessageTimestamp = undefined;
                }
            });
        }
    }
}