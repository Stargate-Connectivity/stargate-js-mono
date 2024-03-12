import {DeviceModel, GateValueModel} from "gate-viewmodel";
import ColorPicker from "@/components/custom/ColorPicker/ColorPicker";
import {
    CustomDeviceMatcher
} from "@/components/SystemPage/CardDisplay/cards/DevicesDashboard/DeviceGroup/Device/Device";

const isColorPicker = (deviceModel: DeviceModel) => {
    return deviceModel.info.value === 'color';
}

const filterValues = (values: GateValueModel[]) => {
    return values.filter((value) => {
        return  value.gateValue.info === undefined || value.gateValue.info.match(/^color:/) === null;
    });
}

const getInstance = (key: string, deviceModel: DeviceModel) => {
    return <ColorPicker deviceModel={deviceModel} key={key}/>
}

export const colorPickerMatcher: CustomDeviceMatcher = {
    isCustom: isColorPicker,
    filterValues,
    getInstance
}