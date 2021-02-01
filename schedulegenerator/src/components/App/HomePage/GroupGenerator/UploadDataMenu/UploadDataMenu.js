import React from 'react';
import {Button, Modal} from "semantic-ui-react";
import ConfirmFileModal from "./ConfirmFileModal/ConfirmFileModal";
import {withRouter} from "react-router-dom";

class UploadDataMenu extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            modalOpen: false,
            fileName: "",
            file: null,
            loadData: false
        };
    }

    handleOpen = (e) => {
        e.preventDefault();
        this.setState({ file: e.target.files[0], fileName: e.target.files[0].name, modalOpen: true, loadData: false });
    };

    handleExistingOpen = () => {
        console.log("Load existing data");
        this.setState({modalOpen: true, loadData: true});
    };

    handleClose = () => this.setState({ file: null, fileName: "", modalOpen: false });

    render() {
        const {progress, get, url, format, columns, history} = this.props;
        const {file, fileName, loadData} = this.state;

        return (
            <div className={"col-12"}>
                <Button.Group>
                    <form className="image-upload"
                          method="post"
                          encType="multipart/form-data">
                        <label htmlFor="file-input">
                            <div className='fileUpload btn shadow-none'/>
                        </label>
                        <input id="file-input"
                               type="file"
                               accept="text/plain"
                               onChange={(e) => this.handleOpen(e)}
                               onClick={(event)=> {
                                   event.target.value = null
                               }}/>
                    </form>
                    <Modal
                        open={this.state.modalOpen}
                        onClose={() => this.handleClose()}
                        basic
                        size='fullscreen' centered>
                        <div
                            style={{height: "500px"}}
                            className={"text-center align-content-center mx-auto col-10 btn_or border border-light"}>
                            <ConfirmFileModal
                                progress={progress}
                                increaseProgress={() => this.props.increaseProgress()}
                                getURL={get}
                                url={url}
                                file={file}
                                format={format}
                                fileName={fileName}
                                columns={columns}
                                loadData={loadData}
                                handleClose={() => this.handleClose()}
                            />
                        </div>
                    </Modal>
                    {
                        progress < 40 &&
                        <div className={"btn_or"}>
                            <Button.Or className={"btn_or"}/>
                        </div>
                    }
                    {
                        progress < 40 &&
                        <div className='existingData btn shadow-none' onClick={this.handleExistingOpen}/>
                    }
                    <div className={"btn_or"}>
                        <Button.Or className={"btn_or"}/>
                    </div>
                    <div className='cancelProcess btn shadow-none'
                         onClick={() => history.push("/home")}/>
                </Button.Group>
            </div>
        );
    }
}
export default withRouter(UploadDataMenu);
