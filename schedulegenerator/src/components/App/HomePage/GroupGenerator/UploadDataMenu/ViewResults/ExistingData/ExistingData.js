import * as React from "react";
import MaterialTable from 'material-table';
import './ExistingData.css';
import axios from "axios";
import LoadingIndicator from "../../../../../../Notifiers/LoadingIndicator/LoadingIndicator.js";
import {trackPromise} from "react-promise-tracker";
import {Button} from "semantic-ui-react";
import DataNotFound from "../../../../../../Notifiers/DataNotFound/DataNotFound";
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import AddNewEntry from "./HandleEntries/AddNewEntry/AddNewEntry";
import SubjectOfStaffMember from "./SubjectOfStaffMember/SubjectOfStaffMember";
import {theme} from '../../../../../../StaticInformation/StaticInformation';
import {
    deleteAllProfessors,
    deleteAllSubjects,
    deleteProfessorByID, deleteSelectedProfessors, deleteSelectedSubjects,
    deleteSubjectByID,
    getProfessorByFullName, getProfessorById, getSubjectByName,
    insertProfessorURL,
    insertSubjectURL, removeSubjectFromProfessors,
    updateProfessorByID, updateSubjectByID
} from '../../../../../../StaticInformation/URLs';
import EditEntry from "./HandleEntries/EditEntry/EditEntry";

class ExistingData extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            hasData: false,
            reason: "",
            explanation: "",
            title: "",
            promiseDone: false,
            loadingText: "Loading Data",
            showDetails: false,
            selectedRows: [],
            rowNumbers: 8,
            page: 0,
            showAddModal: false,
            showEditModal: false,
            showActions: true,
            showSelection: false,
            showSubjectsTable: false,
            editProfessorName: "",
            activeProfessorID: 0,
            subjectsData: [],
            subjectsColumns:
                [
                    {
                        title: 'Name',
                        field: 'subject_name'
                    },
                    {
                        title: 'Semester',
                        field: 'subject_enrollment_semester'
                    }
                ]
        };
    }

    componentDidMount() {
        trackPromise(
            axios.get(this.props.url).then(response =>{
                if(response.data.length > 0){
                    let componentData = [];

                    for (let i in response.data) {
                        if(this.props.progress === 0){
                            componentData.push({
                                subject_id: response.data[i].id,
                                subject_name: response.data[i].name,
                                subject_enrollment_semester: response.data[i].semester,
                                has_laboratory_exercises: response.data[i].hasLaboratoryExercises
                            })
                        }
                        else{
                            componentData.push({
                                professor_id: response.data[i].id,
                                first_name: response.data[i].firstName,
                                title: response.data[i].title,
                                last_name: response.data[i].lastName,
                                faculty_position: response.data[i].position,
                                teaches: response.data[i]._teachesSubjects,
                                teaches_subjects:
                                    <Button
                                        basic
                                        inverted
                                        compact
                                        color='teal'
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            this.showSubjectsFor(response.data[i].id);
                                        }}
                                    >
                                        View subjects
                                    </Button>
                            })
                        }
                    }

                    let title = "";
                    let details = "";
                    let rowNumbers;
                    if(this.props.progress === 0){
                        title = "Subjects";
                        details = false;
                        rowNumbers = 8;
                    }
                    else if(this.props.progress === 20){
                        title = "Faculty Staff";
                        details = true;
                        rowNumbers = 6;
                    }
                    this.setState({ rowNumbers: rowNumbers, showDetails: details, hasData: true, data: componentData, loading: false, title: title });
                }
                else if(this.props.wasUploaded){
                    this.setState({reason: "Invalid Test Data", explanation: "Check the file that you've uploaded & try again"})
                }
                else if(!this.props.wasUploaded){
                    this.setState({reason: "No. Data. Found.", explanation: "Please upload a file"})
                }
            }).catch(() => this.setState({reason: "Network Problem!", explanation: ""}))

        ).then(() => this.setState({promiseDone: true}));
    }

    addNewEntry = () => { this.setState({showAddModal: true})};

    cancelNewEntry = () => { this.setState({showAddModal: false})};

    editEntry = (rowData) => {
        let data = this.state.data;
        const index = data.indexOf(rowData);
        let name = data[index].professor_id; //data[index].first_name+" "+data[index].last_name;

        this.setState({showEditModal: true, editProfessorName: name})
    };

    cancelEditEntry = () => { this.setState({showEditModal: false, editProfessorName: ""})};

    showSubjectsFor = (id) => {
        let componentData = [];
        let title = "";
        this.state.data.forEach((element, index) => {
            if(element.professor_id === id){
                title = element.title+" "+element.first_name+" "+element.last_name
                element.teaches.forEach(subject => {
                    console.log(subject)
                    componentData.push({
                        subject_id: subject.id,
                        subject_name: subject.name,
                        subject_enrollment_semester: subject.semester,
                    });
                });

                if(this.state.showActions) document.querySelector('[aria-label="Clear Search"]').click();
                this.setState({
                    title: title,
                    showSubjectsTable: true,
                    activeProfessorID: index,
                    subjectsData: componentData
                });
            }
        });
    };

    insertData = (currentElement) => {
        this.setState({loading: true, loadingText: "Inserting New Data"});
        let data = {};
        let url = "";

        console.log(currentElement)
        if(this.props.progress === 0){
            url = insertSubjectURL;
            data = {
                subject_id: null,
                name: currentElement.subject_name,
                semester: currentElement.subject_enrollment_semester,
                hasLaboratoryExercises: currentElement.has_laboratory_exercises
            }
            console.log(data)
        }
        else if(this.props.progress === 20){
            url = insertProfessorURL;

            let _teaches = ""
            for(let i in currentElement.teaches){
                if(i > 0) _teaches += ";";
                _teaches += currentElement.teaches[i];
            }

            console.log("Teaches: "+_teaches);

            data = {
                id: null,
                firstName: currentElement.first_name,
                title: currentElement.title,
                lastName: currentElement.last_name,
                jobPosition: currentElement.faculty_position,
                subjects: _teaches
            }
        }

        let name = this.props.progress === 0 ? data.name : data.firstName+"_"+data.lastName;
        let getURL = this.props.progress === 0 ? getSubjectByName+name : getProfessorByFullName+name;
        trackPromise(
            axios.post(url, data)
                .then(() => axios.get(getURL)
                    .then((response) => {
                        const data = this.state.data;
                        if(this.props.progress === 0) currentElement.subject_id = response.data;
                        else{
                            console.log(data.subjects)
                            console.log(response.data._teachesSubjects)
                            currentElement.professor_id = response.data.id;
                            currentElement.teaches = response.data._teachesSubjects;
                            currentElement.teaches_subjects =
                                <Button
                                    basic
                                    inverted
                                    compact
                                    color='teal'
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        this.showSubjectsFor(response.data.id);
                                    }}
                                >
                                    View subjects
                                </Button>
                        }
                        console.log(currentElement)
                        data.push(currentElement)
                        this.setState({data: data})
                    }))
            ).then(() =>
                this.setState({
                    loading: false,
                    hasData: true,
                    showAddModal: false
                })
            );
    };

    updateData = (currentElement) => {
        this.setState({loading: true, loadingText: "Updating Data"});
        if(this.props.progress === 0){
            trackPromise(
                axios.put(updateSubjectByID+currentElement.subject_id, {
                    name: currentElement.subject_name,
                    semester: currentElement.subject_enrollment_semester,
                    hasLaboratoryExercises: currentElement.has_laboratory_exercises
                }).then(() => {this.setState({loading: false, hasData: true})})
            ).then();
        }
        else if(this.props.progress === 20){

            let subjectsString = "";
            for(let index in currentElement.teaches){
                console.log(currentElement.teaches[index]);
                subjectsString += currentElement.teaches[index]+";";
            }
            console.log("Subjects: "+subjectsString);

            trackPromise(
                axios.put(updateProfessorByID+currentElement.professor_id, {
                    firstName: currentElement.first_name,
                    title: currentElement.title,
                    lastName: currentElement.last_name,
                    jobPosition: currentElement.faculty_position,
                    subjects: subjectsString
                }).then(() => {
                    let professors = this.state.data;
                    axios.get(getProfessorById+currentElement.professor_id).then(value => {
                        let professor;
                        for(let index in professors){
                            if(professors[index].professor_id === currentElement.professor_id){
                                professor = {
                                    professor_id: value.data.id,
                                    first_name: value.data.firstName,
                                    title: value.data.title,
                                    last_name: value.data.lastName,
                                    faculty_position: value.data.position,
                                    teaches: value.data._teachesSubjects,
                                    teaches_subjects:
                                        <Button
                                            basic
                                            inverted
                                            compact
                                            color='teal'
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                this.showSubjectsFor(value.data.id);
                                            }}
                                        >
                                            View subjects
                                        </Button>
                                }
                                professors[index] = professor;
                                console.log(professors);
                                break;
                            }
                        }
                    }).then(() => this.setState({data: professors, loading: false, hasData: true}))
                })
            ).then();
        }
    };

    deleteData = (currentElements) => {
        this.setState({loading: true, loadingText: "Erasing Data"});
        console.log(currentElements)
        let index = this.state.data.indexOf(currentElements);
        let url = "";
        if(this.props.progress === 0){
            console.log(this.state.data[index].subject_id)
            url = deleteSubjectByID+this.state.data[index].subject_id;
        }
        else{
            url = deleteProfessorByID+this.state.data[index].professor_id;
        }

        trackPromise(
            axios.delete(url).then(() => {
                if (this.state.data.length === 0) {
                    this.setState({
                            loadingText: "Loading Data",
                            hasData: false,
                            reason: "No. Data. Found.",
                            explanation: "Please upload a file"
                        }
                    )
                }
                else{
                    this.setState({
                            loading: false,
                            hasData: true
                        }
                    )
                }
            })
        ).then();
    };

     deleteAllSelectedData = () => {
        this.setState({loading: true, loadingText: "Erasing Data"});

        let url = "";
        let selected = [];
        if(this.props.progress === 0){
            this.state.selectedRows.forEach(value => {
                selected.push(value.subject_id);
            });
            if(this.state.data.length === selected.length) url = deleteAllSubjects;
            else url = deleteSelectedSubjects+selected;
        }
        else if(this.props.progress === 20){
            this.state.selectedRows.forEach(value => {
                selected.push(value.professor_id);
            });
            if(this.state.data.length === selected.length) url = deleteAllProfessors;
            else url = deleteSelectedProfessors+selected;
        }
        console.log(selected);
        trackPromise(
            axios.delete(url)
                .then(() => {
                        if (this.state.data.length === 0) {
                            this.setState({
                                    loadingText: "Loading Data",
                                    loading: false,
                                    hasData: false,
                                    reason: "No. Data. Found.",
                                    explanation: "Please upload a file",
                                }
                            )
                        }
                        else{
                            this.setState({
                                    loading: false,
                                    hasData: true,
                                }
                            )
                        }
                    }
                ).then(() => this.showSelectionFromChange([]))
        ).then();
    };

     deleteSubjectFromProfessor = (subject) => {
         this.setState({loading: true, loadingText: "Removing Subject From Selected Professor"});
         let subject_index = subject.subject_id;
         let professor_index = this.state.data[this.state.activeProfessorID].professor_id;
         let url = removeSubjectFromProfessors+professor_index+"/subject/"+subject_index;

         trackPromise(
             axios.delete(url).then(() => {
                 this.setState({
                     loading: false,
                     showSubjectsTable: true,
                     activeProfessorID: this.state.activeProfessorID
                 })
             })
         ).then();
     };

    goBack = () => {
        this.setState({
            title: "Faculty Staff",
            showSubjectsTable: false
        })
    };

    continue = () => {
        this.props.increaseProgress();
        this.props.handleClose();
    };

    showSelection = (rowData) => {
        let data = this.state.data;
        let selected = [];
        const index = data.indexOf(rowData);
        data[index].tableData.checked = !data[index].tableData.checked;

        for(let i in data){
            if(data[i].tableData.checked){
                selected.push(data[i]);
            }
        }

        let action = selected.length === 0;
        this.setState({
            selectedRows: selected,
            showActions: action,
            showSelection: !action
        });

    };

    showSelectionFromChange = (rows) => {
        if(rows.length === 0){
            this.setState({
                selectedRows: [],
                showActions: true,
                showSelection: false
            })
        }
        else{
            this.setState({selectedRows: rows})
        }
    };

    render() {
        const {showEditModal, editProfessorName, showAddModal, page, rowNumbers, showSubjectsTable, showSelection, showActions, selectedRows, showDetails, promiseDone, data, loading, hasData, title, reason, explanation, loadingText} = this.state;
        const {columns, progress} = this.props;
        let editable;

        if(this.props.progress === 0){
            editable = (showActions && {
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                        setTimeout(() => {
                            if(!showDetails && !newData.subject_name){
                                //this.setShow(true);
                                reject();
                            }
                            else if(showDetails && (!newData.first_name || !newData.last_name )){
                                // this.setShow(true);
                                reject();
                            }
                            else {
                                resolve();
                                this.updateData(newData);
                                if (oldData) {
                                    this.setState((prevState) => {
                                        const data = [...prevState.data];
                                        data[data.indexOf(oldData)] = newData;
                                        return {...prevState, data};
                                    });
                                }
                            }
                        }, 600);
                    }).then(() => this.setShow(false)),
                onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            this.deleteData(oldData);
                            this.setState((prevState) => {
                                const data = [...prevState.data];
                                data.splice(data.indexOf(oldData), 1);
                                return { ...prevState, data };
                            });
                        }, 600);
                    }),
            })
        }
        else{
            editable = (showActions && {
                onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            this.deleteData(oldData);
                            this.setState((prevState) => {
                                const data = [...prevState.data];
                                data.splice(data.indexOf(oldData), 1);
                                return { ...prevState, data };
                            });
                        }, 600);
                    }),
            })
        }

        if(loading || (data.length === 0 && !promiseDone)){
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
        else if(showAddModal)
            return  <AddNewEntry
                        type={progress}
                        data={data}
                        insertData={this.insertData}
                        cancelNewEntry={this.cancelNewEntry}
                    />
        else if(showEditModal)
            return  <EditEntry
                        prof_id={editProfessorName}
                        updateData={this.updateData}
                        cancelEditEntry={this.cancelEditEntry}
                    />
        else if(showSubjectsTable)
        return  <SubjectOfStaffMember
                    theme={theme}
                    title={title}
                    subjectsColumns={this.state.subjectsColumns}
                    subjectsData={this.state.subjectsData}
                    goBack={this.goBack}
                    handleClose={this.props.handleClose}
                />
        else
        return (
            <div className={"mx-auto m-3"}>
                <MuiThemeProvider theme={theme}>
                <MaterialTable
                    style={{
                        scrollbarColor: "teal",
                        backgroundColor: "black",
                        color: "white"
                    }}
                    options={{
                        actionsColumnIndex: -1,
                        selection: showSelection,
                        search: showActions,
                        pageSize: rowNumbers,
                        pageSizeOptions : [rowNumbers],
                        sorting: false,
                        initialPage: page,
                        draggable: false,
                        loadingType: "linear",
                        padding: "dense",
                        toolbar: {color: "white"},
                        addRowPosition: "first",
                        rowStyle: {
                            color: "white"
                        },
                        minBodyHeight: "22em",
                        maxBodyHeight: "22em",
                        actionsCellStyle: {color: "teal"},
                        editCellStyle: {color: "teal"},
                        filterRowStyle: {color: "teal"},
                        filterCellStyle:{color: "teal"},
                        headerStyle:{backgroundColor: "black", color: "#00AEAE", fontSize: "medium", fontWeight: "bold", borderBottom: "black"},
                        searchFieldStyle: {color: "teal"},
                    }}
                    onSelectionChange={(rows) => this.showSelectionFromChange(rows)}
                    onRowClick={(event, rowData) => this.showSelection(rowData)}
                    actions={[
                        (!showActions &&
                        {
                            tooltip: 'Remove All Selected Users',
                            icon: 'delete',
                            onClick: () =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        resolve();
                                        console.log(selectedRows);
                                        this.deleteAllSelectedData(selectedRows);
                                        this.setState((prevState) => {
                                            const data = [...prevState.data];
                                            selectedRows.forEach((value) => {
                                                data.splice(data.indexOf(value), 1)
                                            });
                                            return { ...prevState, data };
                                        });
                                    }, 600);
                                }),
                        }),
                        (
                            showActions && this.props.progress === 20 && {
                                tooltip: 'Edit Professor',
                                icon: 'edit',
                                onClick: (event, rowData) => this.editEntry(rowData)
                            }
                        )
                    ]}
                    title={title}
                    columns={columns}
                    data={data}
                    onChangePage={(page) => {
                        this.setState({
                            page: page
                        })
                    }}
                    editable={editable}
                />
                </MuiThemeProvider>
                <div className={"m-1"}>
                    <div className={"float-left"}>
                        <Button
                            className={"m-1"}
                            inverted color='teal'
                            icon='add'
                            labelPosition='right'
                            content='Add'
                            onClick={this.addNewEntry}>
                        </Button>
                    </div>
                    <div className={"float-right"}>
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
                    </div>
                </div>
            </div>
        );
    }
}
export default ExistingData;