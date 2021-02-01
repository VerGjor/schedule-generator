import React from 'react';
import '../GroupGenerator.css';
import {Button} from "semantic-ui-react";
import CloseIcon from '@material-ui/icons/Close';
import {trackPromise} from "react-promise-tracker";
import axios from "axios";
import SemesterDropDown from "../../../../EditedComponents/SemesterDropDown/SemesterDropDown";
import {SemesterField} from "../../../../EditedComponents/SemesterField/SemesterField";
import GenerateCourses from "./GenerateCourses/GenerateCourses";
import GenerateGroups from "./GenerateGroups/GenerateGroups";
import {withRouter} from "react-router-dom";
import {current_semester} from "../../../../StaticInformation/StaticInformation";
import LoadingIndicator from "../../../../Notifiers/LoadingIndicator/LoadingIndicator";
import {createGroup} from "../../../../StaticInformation/URLs";
import ReviewGroups from "./ReviewGroups/ReviewGroups";


class ReviewAndGenerate extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            options: [],
            semester: "",
            generate: "",
            loading: false,
            createLectures: false,
            createExercises: false,
            createLaboratoryExercises: false,
            classNameDescription: "text-monospace text-light float-left",
            hasGeneratedGroups: false
        };
    }

    componentDidMount() {
        this.setState({
            options: current_semester,
            semester: "Winter",
            generate: this.props.generate
        })
    }

    updateSemester = (e) => {
        e.preventDefault();
        let index = e.target.attributes[3].nodeValue;
        this.setState({semester: this.state.options[index]})
    };

    updateGroupType = (e) => {
        switch (e.target.value){
            case "Lecture": this.setState({createLectures: e.target.checked, classNameDescription: "text-monospace text-light float-left"}); break;
            case "Exercises": this.setState({createExercises: e.target.checked, classNameDescription: "text-monospace text-light float-left"}); break;
            default: this.setState({createLaboratoryExercises: e.target.checked, classNameDescription: "text-monospace text-light float-left"}); break;
        }
    }

    generateCourses = () => {
        this.setState({ loading: true }, () => {
            const data = new FormData();
            data.append("semester", this.state.semester);
            console.log(data.get("semester"))
            console.log("data of semester:"+data.get("semester"));
            trackPromise(
                axios.post(this.props.url, data)
                    .then(() => {
                        this.setState({
                            loading: false,
                            generate: "groups"
                        });
                    })).then(this.props.increaseProgress())
        });
    };

    finishedGenerating = () => this.setState({loading: false, hasGeneratedGroups: true}, () => {
        this.props.increaseProgress();
    })

    generateGroups = (url) => {
        if(!this.state.createLectures && !this.state.createExercises && !this.state.createLaboratoryExercises){
            this.setState({classNameDescription: "text-monospace text-danger float-left"})
        }
        else {

            this.setState({loading: true, classNameDescription: "text-monospace text-light float-left"}, () => {

                if (this.state.createLectures) {
                    trackPromise(
                        axios.post(url).finally(() => {
                            if (!this.state.createExercises && !this.state.createLaboratoryExercises) {
                                this.finishedGenerating()
                            }
                            else if (this.state.createExercises) {
                                axios.post(createGroup + "?groupType=Exercises&semester=" + this.state.semester).finally(() => {
                                    if (!this.state.createLaboratoryExercises) {
                                        this.finishedGenerating()
                                    }
                                    else{
                                        axios.post(createGroup + "?groupType=Laboratory&semester=" + this.state.semester).finally(() => this.finishedGenerating())
                                    }
                                })
                            }
                            else if (this.state.createLaboratoryExercises) {
                                axios.post(createGroup + "?groupType=Laboratory&semester=" + this.state.semester).finally(() => this.finishedGenerating())
                            }
                        })
                    ).then()
                }
                else if (this.state.createExercises) {
                    trackPromise(
                        axios.post(createGroup + "?groupType=Exercises&semester=" + this.state.semester).finally(() => {
                            if (!this.state.createLaboratoryExercises) {
                                this.finishedGenerating()
                            }
                            else{
                                axios.post(createGroup + "?groupType=Laboratory&semester=" + this.state.semester).finally(() => this.finishedGenerating())
                            }
                        })
                    ).then()
                }
                else if (this.state.createLaboratoryExercises) {
                    trackPromise(
                        axios.post(createGroup + "?groupType=Laboratory&semester=" + this.state.semester).finally(() => this.finishedGenerating())
                    ).then()
                }
            })
        }
    }

    render() {
        const {loading, semester, options, generate, classNameDescription, hasGeneratedGroups} = this.state;
        const {history} = this.props;
        let current_functionality;

        if(generate === "courses") current_functionality = () => this.generateCourses();
        else current_functionality = () => this.generateGroups(
            createGroup + "?groupType=Lecture&semester=" + this.state.semester
        );

        if(loading){
            return(
                <div>
                    <LoadingIndicator text={"Loading..."}/>
                    <div className={"progress-margin"}/>
                </div>
            )
        }
        else if(hasGeneratedGroups)
            return (
                <ReviewGroups
                    semester={semester}
                    history={history}
                    reset={() => this.props.reset()}
                />
            );
        else
        return (
            <div>
                <div className={"col-8 mx-auto row"}>
                    {
                        generate === "courses" &&
                            <SemesterDropDown
                                options={options}
                                semester={semester}
                                updateSemester={e => this.updateSemester(e)}
                            />
                    }
                    {
                        generate === "groups" &&
                        <SemesterField
                            className={"mx-auto"}
                            size={"small"}
                            disabled
                            label="Semester"
                            defaultValue={semester}
                            variant="outlined" />
                    }
                    <div className={"mx-auto"}>
                        <Button
                            inverted
                            className={"mt-1 mb-1"}
                            onClick={() => this.props.reset()}
                            content="Start Over"
                        />
                        <Button
                            className={"mt-1 mb-1"}
                            inverted
                            color='teal'
                            icon='checkmark'
                            labelPosition='right'
                            content='Confirm'
                            onClick={current_functionality}
                        />
                        <Button
                            inverted
                            className={"pt-2 pb-1"}
                            onClick={() => history.push("/home")}
                            icon={<CloseIcon />}

                        />
                    </div>
                </div>
                <div className={"col-8 mx-auto"}>
                    {generate === "courses" && <GenerateCourses semester={semester}/>}
                    {generate === "groups" &&
                    <GenerateGroups
                        semester={semester}
                        classNameDescription={classNameDescription}
                        updateGroupType={(e) => this.updateGroupType(e)}/>}
                </div>
            </div>
        );
    }
}
export default withRouter(ReviewAndGenerate);
