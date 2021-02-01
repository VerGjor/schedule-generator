import React from 'react';
import { Progress } from 'semantic-ui-react';
import "./GroupGenerator.css";
import UploadDataMenu from "./UploadDataMenu/UploadDataMenu";
import ReviewAndGenerate from "./ReviewAndGenerate/ReviewAndGenerate";
import {
    staffColumns,
    subjectColumns
} from "../../../StaticInformation/StaticInformation";
import {
    createCoursesForCurrentSemester, createGroup,
    getAllProfessorsURL,
    getAllSubjectsURL, getTotalStudentsURL, insertAllProfessorsURL, insertAllStudentsURL,
    insertAllSubjectsURL
} from "../../../StaticInformation/URLs";

class GroupGenerator extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            progress: 0,
            progressDescription: "Step 1: Faculty subjects",
            postURL: insertAllSubjectsURL,
            getURL: getAllSubjectsURL,
            fileFormat: "SubjectName,Semester,HasLaboratoryExercisesBoolean",
            generate: "courses",
            hasGeneratedGroups: false,
            columns: subjectColumns,
            showProgress: true,
        };
    }

    reset = () =>{
        this.setState({
            showProgress: true,
            progress: 0,
            progressDescription: "Step 1: Faculty subjects",
            postURL: insertAllSubjectsURL,
            getURL: getAllSubjectsURL,
            fileFormat: "FirstName,Title,LastName,FacultyPosition,CouldTeachSubject1;CouldTeachSubject2;...;CouldTeachSubjectN",
            columns: subjectColumns
        });
    };

    increaseProgress = () =>{
        this.setState({
            progress: this.state.progress + 20
        });
        switch(this.state.progress+20){
            case 20:
                this.setState({
                    progressDescription: "Step 2: Faculty staff",
                    postURL: insertAllProfessorsURL,
                    getURL: getAllProfessorsURL,
                    fileFormat: "FirstName,Title,LastName,FacultyPosition,CouldTeachSubject1;CouldTeachSubject2;...;CouldTeachSubjectN",
                    columns: staffColumns
                });
                break;
            case 40:
                this.setState({
                    progressDescription: "Step 3: Students",
                    postURL: insertAllStudentsURL,
                    getURL: getTotalStudentsURL,
                    fileFormat: "StudentIndex,EnrolledInSubject1;EnrolledInSubject2;...;EnrolledInSubjectN"
                });
                break;
            case 60:
                this.setState({
                    progressDescription: "Step 4: Generate courses",
                    postURL: createCoursesForCurrentSemester,
                    generate: "courses"
                });
                break;
            case 80:
                this.setState({
                    progressDescription: "Step 5: Generate group",
                    postURL: createGroup,
                    generate: "groups"
                });
                break;
            default:
                this.setState({
                    progressDescription: "Step 6: View Generated Groups",
                    hasGeneratedGroups: true
                });
                break;
        }
    };

    render() {
        const {progress, postURL, getURL, fileFormat, columns, progressDescription, generate, hasGeneratedGroups} = this.state;

        if(progress < 60)
        return (
            <div className={"container col-12"}>
                <div className={"text-center col-12 mx-auto mb-5"}>
                    <UploadDataMenu
                        progress={progress}
                        url={postURL}
                        get={getURL}
                        format={fileFormat}
                        columns={columns}
                        increaseProgress={() => this.increaseProgress()}/>
                </div>
                <div className={"col-lg-6 col-md-8 col-sm-8 mx-auto text-center progress-margin"}>
                    <h5 className={"text-light font-small"}>{progressDescription}</h5>
                    <Progress percent={progress}
                              active
                              color='teal'
                              className={"border border-light"}>
                    </Progress>
                </div>
            </div>
        );
        else return(
                <div className={"container col-12"}>
                    <div className={"text-center col-12 mx-auto mb-1"}>
                        <ReviewAndGenerate
                            hasGeneratedGroups={hasGeneratedGroups}
                            url={postURL}
                            generate={generate}
                            reset={() => this.reset()}
                            increaseProgress={() => this.increaseProgress()}/>
                    </div>

                    <div className={"col-lg-6 col-md-8 col-sm-8 mx-auto text-center mt-3"}>
                        <h5 className={"text-light font-small"}>{progressDescription}</h5>
                         <Progress percent={progress}
                                  active
                                  color='teal'
                                  className={"border border-light"}>
                        </Progress>
                    </div>

                </div>
            );
    }
}
export default GroupGenerator;
