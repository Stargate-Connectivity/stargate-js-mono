import {DeviceModel, DeviceState} from "gate-viewmodel";
import {RgbColorPicker} from "react-colorful";
import {useEffect, useMemo, useState} from "react";
import styles from './ColorPicker.module.css';
import useModelValue from "@/components/ReactGateViewModel/hooks/useModelValue";

interface ColorPickerProps{
    deviceModel: DeviceModel
}

const ColorPicker = (props: ColorPickerProps) => {
    const {deviceModel} = props;
    const deviceState = useModelValue(deviceModel.state);
    const redModel = useMemo(() => {
        return deviceModel.gateValues.find((value) => value.gateValue.info === "color:red");
    }, [deviceModel]);
    const greenModel = useMemo(() => {
        return deviceModel.gateValues.find((value) => value.gateValue.info === "color:green");
    }, [deviceModel]);
    const blueModel = useMemo(() => {
        return deviceModel.gateValues.find((value) => value.gateValue.info === "color:blue");
    }, [deviceModel]);

    const [color, setColor] = useState({
        r: redModel?.modelValue.value ?? 0,
        g: greenModel?.modelValue.value ?? 0,
        b: blueModel?.modelValue.value ?? 0
    });

    useEffect(() => {
        redModel?.gateValue.setValue(color.r);
        greenModel?.gateValue.setValue(color.g);
        blueModel?.gateValue.setValue(color.b);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [color]);

    return (
        <div className={styles.colorPickerContainer}>
            {deviceState === DeviceState.up &&
                <RgbColorPicker color={color} onChange={setColor}/>
            }
            {deviceState !== DeviceState.up &&
                <div>Device offline</div>
            }
        </div>
    )
}

export default ColorPicker;
