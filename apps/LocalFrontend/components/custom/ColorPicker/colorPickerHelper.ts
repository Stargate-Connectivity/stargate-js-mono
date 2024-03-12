import {GateValueModel} from "gate-viewmodel";

export const getColorPickerValues = (values: [GateValueModel]) => {
    const colorPickerValues: GateValueModel[] = [];
    const otherValues: GateValueModel[] = [];

    values.forEach((value) => {
        const isColorPickerValue = value.gateValue.info !== undefined && value.gateValue.info.match(/^color:/) !== null;
        if (isColorPickerValue) {
            colorPickerValues.push(value);
        } else {
            otherValues.push(value);
        }
    });

    return {colorPickerValues, otherValues};
}

