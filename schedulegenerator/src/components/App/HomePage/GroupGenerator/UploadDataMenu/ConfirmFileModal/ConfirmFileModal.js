import {Modal, Button} from "semantic-ui-react";
import React from "react";
import "../../GroupGenerator.css";
import {trackPromise} from "react-promise-tracker";
import axios from "axios";
import LoadingIndicator from "../../../../../Notifiers/LoadingIndicator/LoadingIndicator";
import "../../GroupGenerator.css";
import ConfirmModalContent from "./ConfirmModalContent/ConfirmModalContent";
import ExistingData from "../ViewResults/ExistingData/ExistingData";
import StudentsData from "../ViewResults/StudentsData/StudentsData";

class ConfirmFileModal extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            loading: false,
            loadExistingData: props.loadData,
            wasUploaded: false
        };
    }

    acceptFile = () => {
        this.setState({ loading: true }, () => {
            const data = new FormData();
            data.append('file', this.props.file);
            trackPromise(
                axios.post(this.props.url, data)
                    .then(() => {
                        this.setState({
                            loading: false,
                            loadExistingData: true,
                            wasUploaded: true
                        });
                    })).then()
        });
    };

    render() {
        let {fileName, format, progress, getURL, columns} = this.props;
        let {loadExistingData, loading, wasUploaded} = this.state;

        if(loading){
            return (
                <div className={"progress-margin"}>
                    <LoadingIndicator text={"Processing Data"}/>
                </div>)
        }
        else
            if(loadExistingData && progress < 40){
                return(
                    <ExistingData
                        url={getURL}
                        wasUploaded={wasUploaded}
                        columns={columns}
                        progress={progress}
                        increaseProgress={() => this.props.increaseProgress()}
                        handleClose={this.props.handleClose}/>
                )
            }
            else if(loadExistingData && progress === 40){
                return(
                    <div>
                    <StudentsData
                        url={getURL}
                        wasUploaded={wasUploaded}
                        increaseProgress={() => this.props.increaseProgress()}
                        handleClose={this.props.handleClose}/>
                    </div>
                )
            }
            else
                return (
                    <div>
                        <ConfirmModalContent
                            handleClose={this.props.handleClose}
                            fileName={fileName}
                            format={format}/>

                        <Modal.Actions className={"m-5"}>
                            <Button inverted onClick={this.props.handleClose}>
                                No
                            </Button>
                            <Button
                                inverted color='teal'
                                icon='checkmark'
                                labelPosition='right'
                                content='Yes'
                                onClick={this.acceptFile}
                            />
                        </Modal.Actions>
                    </div>
        );
    }
}
export default ConfirmFileModal;