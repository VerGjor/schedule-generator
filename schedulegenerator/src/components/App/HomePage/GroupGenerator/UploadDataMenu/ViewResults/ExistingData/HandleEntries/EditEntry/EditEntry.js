import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import {SemesterDropDownField} from "../../../../../../../../EditedComponents/SemesterDropDown/SemesterDropDownField/SemesterDropDownField";
import {Button} from "semantic-ui-react";
import SubjectPicker from "../SubjectPicker/SubjectPicker";
import axios from "axios";
import {
    job_positions,
    prof_title
} from "../../../../../../../../StaticInformation/StaticInformation";
import {
    getAllSubjectsURL,
    getProfessorById
} from "../../../../../../../../StaticInformation/URLs";

class EditEntry extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            initial: {},
            id: 0,
            name: "",
            lastName: "",
            title: "",
            jobPosition: "",
            subjects: [],
            allSubjectsIndex: [],
            allSubjects: [],
            error: false,
            helper: "",
            errorLastName: false,
            errorSubjects: false,
            helperLastName: "",
            helperSubjects: "",
            color: "text-light"
        }
    }

    componentDidMount() {
        let student = {};
        let studentSubjects = [];

        axios.get(getProfessorById+this.props.prof_id).then(response => {

            let data_subjects = response.data._teachesSubjects;
            for (let i in data_subjects) {
                studentSubjects.push(data_subjects[i].id);
            }

            student = {
                professor_id: response.data.id,
                name: response.data.firstName,
                title: response.data.title,
                lastName: response.data.lastName,
                jobPosition: response.data.position,
                subjects: studentSubjects,
            }
            console.log(student);

        }).then(() => axios.get(getAllSubjectsURL).then(response => {
            let subjectsData = [];
            let subjectsDataIndex = [];

            for (let i in response.data) {
                subjectsData.push({
                    subject_id: response.data[i].id,
                    subject_name: response.data[i].name
                })
                if(!student.subjects.includes(response.data[i].id)){
                    subjectsDataIndex.push(response.data[i].id);
                }
            }

            this.setState({
                initial: student,
                id: student.professor_id,
                name: student.name,
                lastName: student.lastName,
                title: student.title,
                jobPosition: student.jobPosition,
                subjects: student.subjects,
                allSubjectsIndex: subjectsDataIndex,
                allSubjects: subjectsData,
            })
        }))
    }

    setValue = (e, stateValue) => {
        if(stateValue !== "picked_subjects") e.preventDefault();
        let index;
        switch (stateValue){
            case "name": this.setState({name: e.target.value}); break;
            case "title":
                index = e.target.attributes[3].nodeValue;
                this.setState({title: prof_title[index]});
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

    updateEntry = () => {
        const {id, name, lastName, title, jobPosition, subjects, initial} = this.state;

        console.log(initial);
        if(initial.name === name
            && initial.lastName === lastName
            && initial.title === title
            && initial.jobPosition === jobPosition
            && initial.subjects === subjects
        ){this.props.cancelEditEntry();}
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
                        professor_id: id,
                        first_name: name,
                        title: p_title,
                        last_name: lastName,
                        faculty_position: f_position,
                        teaches: subjects
                    }
                    console.log(element);
                    this.props.updateData(element);
                }
            }
        }
    }

    render() {
        const {
            name,
            lastName,
            title,
            jobPosition,
            subjects,
            allSubjects,
            error,
            helper,
            errorLastName,
            helperLastName,
            helperSubjects
        } = this.state;

        return (
            <div className={"mx-auto m-3"}>
                <h3 className={"mt-3 mb-2 text-monospace"} style={{color: '#00AEAE'}}>EDIT STAFF MEMBER</h3>

                <div className={"row mx-auto mt-5 ml-3 md-3 mr-3"}>
                    <SemesterDropDownField
                        error={error}
                        helperText={helper}
                        onChange={(e) => this.setValue(e, "name")}
                        className={"m-3 col-3 text-monospace mx-auto"}
                        value={name}
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
                        value={title}
                        getOptionLabel={option => option.toString()}
                        getOptionSelected={option => option.toString()}
                        options={prof_title}/>

                    <SemesterDropDownField
                        error={errorLastName}
                        helperText={helperLastName}
                        onChange={(e) => this.setValue(e, "lastName")}
                        className={"m-3 col-3 text-monospace mx-auto"}
                        size="small"
                        value={lastName}
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
                        value={jobPosition}
                        getOptionLabel={option => option.toString()}
                        getOptionSelected={option => option.toString()}
                        options={job_positions}/>

                    <SubjectPicker
                        color={this.state.color}
                        helper={helperSubjects}
                        selected={subjects}
                        items={allSubjects}
                        itemsIndex={this.state.allSubjectsIndex}
                        setValue={this.setValue}
                    />
                </div>

                <Button
                    inverted
                    className={"m-1"}
                    onClick={this.props.cancelEditEntry}>
                    Cancel
                </Button>
                <Button
                    className={"m-1"}
                    inverted color='teal'
                    icon='checkmark'
                    labelPosition='right'
                    content='Save'
                    onClick={() => this.updateEntry()}
                />
            </div>
        );

    }
}
export default EditEntry;