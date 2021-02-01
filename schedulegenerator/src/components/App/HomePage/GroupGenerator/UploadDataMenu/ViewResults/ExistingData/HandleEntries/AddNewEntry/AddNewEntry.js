import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import {SemesterDropDownField} from "../../../../../../../../EditedComponents/SemesterDropDown/SemesterDropDownField/SemesterDropDownField";
import {Button} from "semantic-ui-react";
import SubjectPicker from "../SubjectPicker/SubjectPicker";
import axios from "axios";
import {
    current_semester,
    job_positions,
    lab_exer,
    prof_title
} from "../../../../../../../../StaticInformation/StaticInformation";
import {getAllSubjectsURL} from "../../../../../../../../StaticInformation/URLs";

class AddNewEntry extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            type: this.props.type === 0,
            allSubjectsIndex: [],
            allSubjects: [],
            error: false,
            helper: "",
            // Subject name or Professor First Name
            name: "",
            // for subjects:
            semester: "",
            labExercises: "",
            // for professors:
            lastName: "",
            title: "",
            jobPosition: "",
            subjects: [],
            errorLastName: false,
            errorSubjects: false,
            helperLastName: "",
            helperSubjects: "",
            color: "text-light"
        }
    }

    componentDidMount() {
        axios.get(getAllSubjectsURL).then(response => {
            let subjectsData = [];
            let subjectsDataIndex = [];

            for (let i in response.data) {
                subjectsDataIndex.push(response.data[i].id);
                subjectsData.push({
                    subject_id: response.data[i].id,
                    subject_name: response.data[i].name
                })
            }

            this.setState({ allSubjects: subjectsData, allSubjectsIndex: subjectsDataIndex })
        })
    }

    setValue = (e, stateValue) => {
        if(stateValue !== "picked_subjects") e.preventDefault();
        let index;
        switch (stateValue){
            case "name": this.setState({name: e.target.value}); break;
            case "semester":
                index = e.target.attributes[3].nodeValue;
                this.setState({semester: current_semester[index]});
                break;
            case "title":
                index = e.target.attributes[3].nodeValue;
                this.setState({title: prof_title[index]});
                break;
            case "labExercises":
                index = e.target.attributes[3].nodeValue;
                this.setState({labExercises: lab_exer[index]});
                break;
            case "lastName": this.setState({lastName: e.target.value}); break;
            case "jobPosition":
                index = e.target.attributes[3].nodeValue;
                this.setState({jobPosition: job_positions[index]});
                break;
            default:
                this.setState({subjects: e});
                break;
        }
    };

    insertEntry = () => {
        const {type, name, semester, labExercises, lastName, title, jobPosition, subjects} = this.state;

        if(type){
            if(name === ""){
                this.setState({
                    error: true,
                    helper: "Empty field!"
                })
            }
            else{
                let foundError = false;
                for(let i in this.props.data){
                    if(this.props.data[i].subject_name.toUpperCase() === name.toUpperCase()){
                        this.setState({
                            error: true,
                            helper: "Duplicate Subject!"
                        })
                        foundError = true;
                        break;
                    }
                }
                if(!foundError){
                    let lab = labExercises === "" ? lab_exer[0] : labExercises;

                    let element = {
                        subject_name: name,
                        subject_enrollment_semester: semester === "" ? current_semester[0] : semester,
                        has_laboratory_exercises: lab === "Yes"
                    }
                    this.props.insertData(element);
                }
            }
        }
        else{
            let error_firstName = name === "" ?
                { hasError: true, error: true, helper: "Empty field!"}
                : { hasError: false, error: false, helper: ""};

            let error_lastName = lastName === "" ?
                { hasError: true, error: true, helper: "Empty field!"}
                : { hasError: false, error: false, helper: ""};

            let error_subjects = !subjects.length || subjects.length === 0 ?
                { hasError: true, error: true, helper: "(At least one subject has to be assigned!)"}
                : { hasError: false, error: false, helper: ""};

            console.log("Error Subjects lengts: "+subjects.length);
            console.log("Error Subjects: "+subjects);

            if(error_firstName.hasError || error_lastName.hasError || error_subjects.hasError){
                this.setState({
                    color: "text-danger",
                    error: error_firstName.error,
                    errorLastName: error_lastName.error,
                    errorSubjects: error_subjects.error,
                    helper: error_firstName.helper,
                    helperLastName: error_lastName.helper,
                    helperSubjects: error_subjects.helper,
                })
            }
            else{
                let foundError = false;

                for(let i in this.props.data){
                    if(this.props.data[i].first_name.toUpperCase() === name.toUpperCase()
                    && this.props.data[i].last_name.toUpperCase() === lastName.toUpperCase()){
                        this.setState({
                            error: true,
                            helper: "Duplicate Full Name",
                            errorLastName: true,
                            helperLastName: "",
                            errorSubjects: false,
                            helperSubjects: ""
                        })
                        foundError = true;
                        break;
                    }
                }
                if(!foundError){
                    let p_title = title === "" ? prof_title[0] : title;
                    let f_position = jobPosition === "" ? job_positions[0] : jobPosition;

                    let element = {
                        first_name: name,
                        title: p_title,
                        last_name: lastName,
                        faculty_position: f_position,
                        teaches: subjects
                    }
                    this.props.insertData(element);
                }
            }
        }
    }

    render() {
        const {allSubjects, type, error, helper, errorLastName, helperLastName, helperSubjects } = this.state;
        const array = [];

        if(type)
        return (
            <div className={"mx-auto m-3"}>
                <h3 className={"mt-3 mb-2 text-monospace"} style={{color: '#00AEAE'}}>ADD NEW SUBJECT</h3>
                <span className={"mt-3 mb-5 text-monospace text-light"}>Please fill out all of the fields.</span>

                <div className={"row mx-auto mt-5 ml-3 md-3 mr-3"}>
                    <SemesterDropDownField
                        error={error}
                        helperText={helper}
                        className={"m-3 col-3 text-monospace mx-auto"}
                        size="small"
                        label="Name of subject"
                        variant="outlined"
                        onChange={(e) => this.setValue(e, "name")}
                    />

                    <Autocomplete
                        className={"m-3 col-3 text-monospace mx-auto"}
                        renderInput={params =>
                            <SemesterDropDownField
                                {...params}
                                size="small"
                                label="Semester"
                                variant="outlined"/>}
                        disableClearable
                        defaultValue={current_semester[0]}
                        getOptionLabel={option => option.toString()}
                        getOptionSelected={option => option.toString()}
                        onChange={(e) => this.setValue(e, "semester")}
                        options={current_semester}/>

                    <Autocomplete
                        className={"m-3 col-3 mx-auto text-monospace"}
                        renderInput={params =>
                            <SemesterDropDownField
                                {...params}
                                size="small"
                                label="Has Laboratory Exercises?"
                                variant="outlined"/>}
                        disableClearable
                        defaultValue={lab_exer[0]}
                        getOptionLabel={option => option.toString()}
                        getOptionSelected={option => option.toString()}
                        options={lab_exer}
                        onChange={(e) => this.setValue(e, "labExercises")}/>

                </div>

                <Button
                    inverted
                    className={"m-1"}
                    onClick={this.props.cancelNewEntry}>
                    Close
                </Button>
                <Button
                    className={"m-1"}
                    inverted color='teal'
                    icon='checkmark'
                    labelPosition='right'
                    content='Add'
                    onClick={() => this.insertEntry()}
                />
            </div>
        );
        else
            return (
                <div className={"mx-auto m-3"}>
                    <h3 className={"mt-3 mb-2 text-monospace"} style={{color: '#00AEAE'}}>ADD NEW PROFESSOR</h3>
                    <span className={"mt-3 mb-5 text-monospace text-light"}>Please fill out all of the fields.</span>

                    <div className={"row mx-auto mt-5 ml-3 md-3 mr-3"}>
                        <SemesterDropDownField
                            error={error}
                            helperText={helper}
                            onChange={(e) => this.setValue(e, "name")}
                            className={"m-3 col-3 text-monospace mx-auto"}
                            size="small"
                            label="First Name"
                            variant="outlined"/>

                        <Autocomplete
                            className={"m-3 col-3 text-monospace mx-auto"}
                            renderInput={params =>
                                <SemesterDropDownField
                                    {...params}
                                    size="small"
                                    label="Title"
                                    variant="outlined"/>}
                            disableClearable
                            onChange={(e) => this.setValue(e, "title")}
                            defaultValue={prof_title[0]}
                            getOptionLabel={option => option.toString()}
                            getOptionSelected={option => option.toString()}
                            options={prof_title}/>

                        <SemesterDropDownField
                            error={errorLastName}
                            helperText={helperLastName}
                            onChange={(e) => this.setValue(e, "lastName")}
                            className={"m-3 col-3 text-monospace mx-auto"}
                            size="small"
                            label="Last Name"
                            variant="outlined"/>


                        <Autocomplete
                            className={"m-3 col-3 mx-auto text-monospace"}
                            renderInput={params =>
                                <SemesterDropDownField
                                    {...params}
                                    size="small"
                                    label="Job Position"
                                    variant="outlined"/>}
                            disableClearable
                            onChange={(e) => this.setValue(e, "jobPosition")}
                            defaultValue={job_positions[0]}
                            getOptionLabel={option => option.toString()}
                            getOptionSelected={option => option.toString()}
                            options={job_positions}/>

                            <SubjectPicker
                                color={this.state.color}
                                helper={helperSubjects}
                                selected={array}
                                items={allSubjects}
                                itemsIndex={this.state.allSubjectsIndex}
                                setValue={this.setValue}
                            />
                    </div>

                    <Button
                        inverted
                        className={"m-1"}
                        onClick={this.props.cancelNewEntry}>
                        Cancel
                    </Button>
                    <Button
                        className={"m-1"}
                        inverted color='teal'
                        icon='checkmark'
                        labelPosition='right'
                        content='Add'
                        onClick={() => this.insertEntry()}
                    />
                </div>
            );
    }
}
export default AddNewEntry;