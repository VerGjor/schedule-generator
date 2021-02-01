import React from "react";
import MaterialTable from "material-table";
import {trackPromise} from "react-promise-tracker";
import axios from "axios";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import LoadingIndicator from "../../../../../Notifiers/LoadingIndicator/LoadingIndicator";
import '../../GroupGenerator.css';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";
import {coursesOptions, subjectColumns, teal_shade} from "../../../../../StaticInformation/StaticInformation";
import {getSubjectsBySemester} from "../../../../../StaticInformation/URLs";

class GenerateCourses extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            semester: props.semester,
            hasData: false,
            data: [],
            loading: false,
            loadingText: "Loading",
            promiseDone: false,
        };
    }

    getData = (semester) => {

        this.setState({loading: true}, () => {
            trackPromise(
                axios.get( getSubjectsBySemester + semester).then(response => {
                        if (response.data.length > 0) {
                            let componentData = [];

                            for (let i in response.data) {
                                componentData.push({
                                    subject_id: response.data[i].subject.id,
                                    subject_name: response.data[i].subject.name,
                                    subject_enrollment_semester: response.data[i].subject.semester,
                                    has_laboratory_exercises: response.data[i].subject.hasLaboratoryExercises,
                                    professors: response.data[i].professors
                                })
                            }
                            console.log(response.data[0]);
                            console.log(componentData);
                            this.setState({
                                data: componentData
                            })
                        }
                    }
                ).then(() => this.setState({hasData: true, loading: false})))
                .then(() => this.setState({promiseDone: true}));
        })
    };

    componentDidMount() {
        this.getData(this.state.semester);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.semester !== prevState.semester){
            return {semester: nextProps.semester}
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.semester !== this.props.semester) {
            this.getData(this.props.semester);
        }
    }

    render() {
        const {data, loading, loadingText} = this.state;
        console.log(data);

        if(loading){
            return(
                <div>
                    <LoadingIndicator text={loadingText}/>
                    <div className={"progress-margin"}/>
                </div>
            )
        }
        else
        return (
            <div className={"col-10 mt-3 mx-auto"}>
                <MaterialTable
                    style={{
                        scrollbarColor: "teal",
                        backgroundColor: "transparent",
                        color: "white",
                        border: "solid",
                        borderColor: teal_shade,
                        fontFamily: "Monospace",
                        fontSize: "small",
                    }}
                    options={coursesOptions}
                    title={"Subjects"}
                    columns={subjectColumns}
                    data={data}
                    detailPanel={[
                        {
                            tooltip: "Professors that could teach the subject",
                            icon: KeyboardArrowLeftIcon,
                            openIcon: KeyboardArrowDownIcon,
                            render: rowData => {
                                if(!rowData.professors || rowData.professors.length === 0)
                                    return <div className={"text-light float-right"}>No professors available for current subject.</div>
                                else
                                return(
                                    <TableContainer className={"col-8 float-right"}>
                                        <Table size="small" aria-label="a dense table">
                                            <TableHead>
                                                <TableRow style={{backgroundColor: teal_shade}}>
                                                    <TableCell className={"text-light text-monospace"}><b>Professor's Full Name</b></TableCell>
                                                    <TableCell className={"text-light text-monospace"} align="right"><b>Title</b></TableCell>
                                                    <TableCell className={"text-light text-monospace"} align="right"><b>Position</b></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {
                                                    rowData.professors.map(function(value){
                                                        return(
                                                            <TableRow key={value.id}>
                                                                <TableCell align="right"
                                                                           className={"text-light text-monospace"}>
                                                                    {value.firstName} {value.lastName}
                                                                </TableCell>
                                                                <TableCell align="right"
                                                                           className={"text-light text-monospace"}>
                                                                    {value.title}
                                                                </TableCell>
                                                                <TableCell align="right"
                                                                           className={"text-light text-monospace"}>
                                                                    {value.position}
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )
                            }
                        }
                    ]}
                />
            </div>
        );
    }
}
export default GenerateCourses;