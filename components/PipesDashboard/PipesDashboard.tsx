import styles from './PipesDashboard.module.css';
import {SystemModel} from "gate-viewmodel";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useContext, useMemo, useState} from "react";
import ModalContext from "local-frontend/service/ModalContext";
import NewPipeModal from "./components/NewPipeModal/NewPipeModal";
import useModelMap from "../ReactGateViewModel/hooks/useModelMap";
import Pipe, {PipeViewModel} from "./components/Pipe/Pipe";
import {PipeDashboardValue} from "./components/Pipe/components/PipeValue";
import {AddressMapper, EventName} from "gate-core";
import {PipeModel} from "gate-viewmodel";
import StandardModal from "../ModalComponent/StandardModal/StandardModal";
import LocalServerConnector from "local-frontend/service/LocalServerConnector";

interface PipesDashboardProps {
    systemModel: SystemModel
}

interface PipeTree {
    centralValue: string,
    inputs: string[],
    outputs: string[]
}

const PipesDashboard = (props: PipesDashboardProps) => {
    const {systemModel} = props;
    const modal = useContext(ModalContext);
    const pipes = useModelMap(systemModel.pipes);
    const [selectedPipes, setSelectedPipes] = useState<PipeModel[]>([]);

    const setSelectedValue = (id: string, selected: boolean) => {
        if (selected) {
            const foundPipes = systemModel.pipes.values
                .filter((pipe) => pipe.source === id || pipe.target === id);
            const newSelectedPipes = [
                ...selectedPipes.filter((pipe) =>
                    !foundPipes.find((foundPipe) => foundPipe.id === pipe.id)),
                ...foundPipes
            ]
            setSelectedPipes(newSelectedPipes);
        } else {
            const newSelectedPipes = selectedPipes.filter((pipe) => pipe.source !== id && pipe.target !== id);
            setSelectedPipes(newSelectedPipes);
        }
    }

    const createModelTree = () => {
        const pipeTreesMap = new Map<string, PipeTree>();
        pipes.forEach((pipe) => {
            let currentTree = pipeTreesMap.get(pipe.source);
            if (currentTree) {
                currentTree.outputs.push(pipe.target);
            } else {
                currentTree = {
                    centralValue: pipe.source,
                    inputs: [],
                    outputs: [pipe.target]
                }
                pipeTreesMap.set(currentTree.centralValue, currentTree);
            }
            currentTree = pipeTreesMap.get(pipe.target);
            if (currentTree) {
                currentTree.inputs.push(pipe.source);
            } else {
                currentTree = {
                    centralValue: pipe.target,
                    inputs: [pipe.source],
                    outputs: []
                }
                pipeTreesMap.set(currentTree.centralValue, currentTree);
            }
        });
        const pipeTrees: PipeTree[] = [];
        pipeTreesMap.forEach((tree) => {
            if ((tree.inputs.length && tree.outputs.length) || tree.inputs.length > 1 || tree.outputs.length > 1) {
                pipeTrees.push(tree);
            }
        });
        const singlePipes = pipes.filter((pipe) => {
            return !pipeTrees.find((tree) => tree.centralValue === pipe.source || tree.centralValue === pipe.target);
        });
        return {pipeTrees, singlePipes};
    }

    const getPipeValueProps = (valueId: string): PipeDashboardValue | undefined => {
        const device = systemModel.devices.getById(AddressMapper.extractTargetId(valueId)[0]);
        if (device) {
            const value = device.gateValues.getById(valueId);
            if (value) {
                return {
                    valueId: valueId,
                    deviceName: device.name.value ?? '',
                    valueName: value.name ?? '',
                    valueType: value.gateValue.type ?? ''
                }
            }
        }
        return undefined;
    }

    const pipingModel = useMemo(() => {
        const {pipeTrees, singlePipes} = createModelTree();
        const pipeModels: { key: string, props: PipeViewModel }[] = [];
        pipeTrees.forEach((tree) => {
            const centralValue = getPipeValueProps(tree.centralValue);
            if (centralValue) {
                const model: PipeViewModel = {
                    centralValue
                }
                if (tree.inputs.length) {
                    const inputs: PipeDashboardValue[] = [];
                    tree.inputs.forEach((input) => {
                        const value = getPipeValueProps(input);
                        if (value) {
                            inputs.push(value);
                        }
                    });
                    model.inputs = inputs;
                }
                if (tree.outputs.length) {
                    const outputs: PipeDashboardValue[] = [];
                    tree.outputs.forEach((output) => {
                        const value = getPipeValueProps(output);
                        if (value) {
                            outputs.push(value);
                        }
                    });
                    model.outputs = outputs;
                }
                pipeModels.push({key: tree.centralValue, props: model});
            }
        });
        singlePipes.forEach((pipe) => {
            const source = getPipeValueProps(pipe.source);
            const target = getPipeValueProps(pipe.target);
            if (source && target) {
                pipeModels.push({
                    key: pipe.source,
                    props: {
                        centralValue: source,
                        outputs: [target]
                    }
                });
            }
        });
        return pipeModels;
    }, [pipes]);

    const onAddPipe = () => {
        if (modal) {
            modal.openModal(<NewPipeModal systemModel={systemModel}/>);
        }
    }

    const removeSelectedPipes = () => {
        selectedPipes.forEach((pipe) => {
            LocalServerConnector.sendDeviceEvent(EventName.pipeRemoved, [pipe.source, pipe.target]);
        });
        setSelectedPipes([]);
    }

    const onRemovePipe = () => {
        if (modal) {
            modal.openModal(
                <StandardModal onApprove={removeSelectedPipes} approveLabel={'Yes'}>
                    Remove selected pipes?
                </StandardModal>
            );
        }
    }

    return (
        <div className={styles.pipesDashboard}>
            {pipingModel.map((pipeModel) =>
                <Pipe
                    key={pipeModel.key}
                    model={pipeModel.props}
                    selectedPipes={selectedPipes}
                    setSelectedValue={setSelectedValue}
                />
            )}
            <div className={styles.controlButtonContainer}>
                <button className={styles.controlButton} onClick={onAddPipe}>
                    <FontAwesomeIcon className={styles.addIcon} icon={faPlus}/>
                </button>
                {!!selectedPipes.length &&
                    <button className={styles.controlButton} onClick={onRemovePipe}>
                        <FontAwesomeIcon className={styles.addIcon} icon={faMinus}/>
                    </button>
                }
            </div>
        </div>
    )
}

export default PipesDashboard;
