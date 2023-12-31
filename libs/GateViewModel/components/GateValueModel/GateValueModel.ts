import {
    GateValue,
    GateValueFactory,
    SystemIds,
    ValueManifest,
    ValueTypes,
    AddressMapper
} from "gate-core";
import {DeviceState} from "../DeviceModel/DeviceState";
import {ModelValue} from "../ModelValue";
import {SystemConnector} from "../../api/SystemConnector";

export class GateValueModel {
    private readonly _id: string;
    private readonly _state: ModelValue<DeviceState>;
    private readonly _gateValue: GateValue<any>;
    private readonly _value: ModelValue<any>;
    private readonly _name?: string;

    constructor(parentId: string, valueManifest: ValueManifest, state: DeviceState, systemConnector: SystemConnector) {
        this._state = new ModelValue<DeviceState>(state);
        const modifiedManifest = {...valueManifest};
        modifiedManifest.id = AddressMapper.appendParentId(parentId, valueManifest.id);
        this._id = modifiedManifest.id;
        this._name = modifiedManifest.valueName;
        try {
            this._gateValue = GateValueFactory.fromManifest(modifiedManifest);
        } catch (err) {
            throw new Error("On creating value from manifest: " + err);
        }
        this._value = new ModelValue(this._gateValue.value);
        this._value.onSubscriptionChange = (subscribed) => {
            subscribed ? systemConnector.subscribe(this._id) : systemConnector.unsubscribe(this._id);
        }
        if (valueManifest.id === SystemIds.ping) {
            this._gateValue.onRemoteUpdate = () => {
                console.log('to server: ' + this._gateValue.value + ', from server: ' + systemConnector.getCurrentPing());
                this._value.setValue(this._gateValue.value + (systemConnector.getCurrentPing() ?? 0));
            };
        } else {
            this._gateValue.onRemoteUpdate = () => {
                this._value.setValue(this._gateValue.value);
            };
        }
        this._gateValue.onLocalUpdate = (wasChanged) => {
            this._value.setValue(this._gateValue.value);
            if (wasChanged || this._gateValue.type === ValueTypes.string) {
                systemConnector.sendValue(this._gateValue);
            }
        }
    }

    get state(): ModelValue<DeviceState> {
        return this._state;
    }

    get gateValue(): GateValue<any> {
        return this._gateValue;
    }

    get value(): ModelValue<any> {
        return this._value;
    }

    get name(): string | undefined {
        return this._name;
    }

    get id(): string {
        return this._id;
    }
}