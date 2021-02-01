import {Button, Modal} from "semantic-ui-react";
import React from "react";
import {trackPromise} from "react-promise-tracker";
import axios from "axios";
import LoadingIndicator from "../../../../../../Notifiers/LoadingIndicator/LoadingIndicator";
import DataNotFound from "../../../../../../Notifiers/DataNotFound/DataNotFound";

class StudentsData extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            numberOfStudents: 0,
            loading: false,
            hasData: false,
            reason: "",
            explanation: "",
            promiseDone: false,
            loadingText: "Loading"
        };
    }

    componentDidMount() {
        trackPromise(
            axios.get(this.props.url).then(response => {
                console.log(response.data);
                if(response.data !== -1) {
                    this.setState({
                        hasData: true,
                        numberOfStudents: response.data,
                        loading: false
                    });
                }
                else if(this.props.wasUploaded){
                    this.setState({reason: "Invalid Test Data", explanation: "Check the file that you've uploaded & try again"})
                }
            }).catch(() => this.setState({reason: "Network Problem!", explanation: ""}))
        ).then(() => this.setState({promiseDone: true}));
    }

    continue = () => {
        this.props.increaseProgress();
        this.props.handleClose();
    };

    render() {
        const {promiseDone, loading, hasData, reason, explanation, loadingText, numberOfStudents} = this.state;

        if(loading || !promiseDone){
            console.log(loading);
            return(
                <div className={"progress-margin"}>
                    <LoadingIndicator text={loadingText}/>
                </div>
            )
        }
        else if(!hasData && promiseDone){
            return(
                <div className={"mx-auto progress-margin"}>
                    <DataNotFound
                        reason={reason}
                        explanation={explanation}
                    />
                    <Button
                        inverted
                        className={"m-1"}
                        onClick={this.props.handleClose}>
                        Close
                    </Button>
                </div>
            )
        }
        else
        return(
            <Modal.Content className={"mt-5"}>
                <h3 className={"m-5 text-monospace"}>The students have been successfully processed!</h3>
                <h4 className={"font-weight-bold text-monospace teal_color"}>
                    Number of students that are uploaded: <span className={"text-light"}>{numberOfStudents}</span>
                </h4>
                <h4 className={"m-5 text-monospace"}>
                    Do you wish to continue?
                </h4>
                <Button
                    inverted
                    className={"m-1"}
                    onClick={this.props.handleClose}>
                    Close
                </Button>
                <Button
                    className={"m-1"}
                    inverted color='teal'
                    icon='checkmark'
                    labelPosition='right'
                    content='Confirm'
                    onClick={() => this.continue()}
                />
            </Modal.Content>
        )
  }

};
export default StudentsData;