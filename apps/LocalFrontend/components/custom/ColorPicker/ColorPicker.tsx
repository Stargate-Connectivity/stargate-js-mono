import {GateValueModel} from "gate-viewmodel";
import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";

interface ColorPickerProps{
    red: GateValueModel,
    green: GateValueModel,
    blue: GateValueModel,
    isActive: boolean
}

const ColorPicker = (props: ColorPickerProps) => {
    const {red, green, blue, isActive} = props;
    const redValue = useModelValue(red.modelValue);
    const greenValue = useModelValue(green.modelValue);
    const blueValue = useModelValue(blue.modelValue);

    return (
        <div></div>
    )
}

export default ColorPicker;
