import {useContext, useMemo, useState} from "react";
import SystemModelContext from "@/components/ReactGateViewModel/SystemModelContext";
import styles from './CustomCard.module.css';
import ColorPicker from "@/components/custom/ColorPicker/ColorPicker";
import {DeviceModel, DeviceSubscription} from "gate-viewmodel";

const CustomCard = () => {
    const systemModel = useContext(SystemModelContext);
    const device = useMemo(() => {
        const matcher = (model: DeviceModel) => model.info.value === 'color';
        const subscription = new DeviceSubscription(systemModel, matcher);
        subscription.onModelUpdate = (newModel) => setDeviceModel(newModel);
        return subscription;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [deviceModel, setDeviceModel] = useState(device.deviceModel);

    return (
        <div className={styles.customCardContainer}>
            Custom Card
            {deviceModel &&
                <div className={styles.colorPickerContainer}>
                    <ColorPicker deviceModel={deviceModel}/>
                </div>
            }
        </div>
    )
}

export default CustomCard;
