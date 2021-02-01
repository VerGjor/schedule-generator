import React from "react";
import '../../GroupGenerator.css';
import axios from "axios";
import MaterialTable from "material-table";
import {
    coursesOptions, groupColumns,
    teal_shade, theme
} from "../../../../../StaticInformation/StaticInformation";
import {getAllGeneratedGroups} from "../../../../../StaticInformation/URLs";
import {trackPromise} from "react-promise-tracker";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import LoadingIndicator from "../../../../../Notifiers/LoadingIndicator/LoadingIndicator";
import {Button} from "semantic-ui-react";
import CloseIcon from "@material-ui/icons/Close";
import withStyles from "@material-ui/core/styles/withStyles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {ThemeProvider as MuiThemeProvider} from "@material-ui/styles";

const StyledTabs = withStyles({
    indicator: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        '& > span': {
            maxWidth: 40,
            width: '100%',
            backgroundColor: '#00AEAE',
        },
    },
})((props) => <Tabs {...props} TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        color: '#fff',
        fontWeight: theme.typography.fontWeightRegular,
        fontSize: theme.typography.pxToRem(15),
        marginRight: theme.spacing(1),
        '&:focus': {
            opacity: 1,
        },
    },
}))((props) => <Tab disableRipple {...props} />);


class ReviewGroups extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            value: 0,
            data: [],
            lectures_data: [],
            exercises_data: [],
            laboratory_exercises_data: [],
            groupType: "Lecture",
            semester: this.props.semester
        }
    }

    componentDidMount() {
        this.getData("Lecture", this.props.semester);
        this.getData("Exercises", this.props.semester);
        this.getData("Laboratory", this.props.semester);
    };

    handleChange = (event, newValue) => {
        console.log(newValue);
        let group_type;
        let current_data;
        switch (newValue){
            case 0: group_type = "Lecture"; current_data = this.state.lectures_data; break;//this.getData("Lecture", this.state.semester); break;
            case 1: group_type = "Exercises"; current_data = this.state.exercises_data; break;//this.getData("Exercises", this.state.semester); break;
            default: group_type = "Laboratory"; current_data = this.state.laboratory_exercises_data; break;//this.getData("Laboratory", this.state.semester); break;
        }
        this.setState({value: newValue, groupType: group_type, data: current_data});
    };

    getData = (groupType, semester) => {

        let responseData = [];

        this.setState({loading: true}, () => {
            trackPromise(
                axios.get(getAllGeneratedGroups + "?groupType="+ groupType +"&semester="+semester).then(response1 => {
                    if(response1.data.length > 0){
                        for (let index in response1.data) {
                            responseData.push({
                                subject_name: response1.data[index].subjectName,
                                total_groups: response1.data[index].totalGeneratedGroups,
                                group_details: response1.data[index].details
                            })
                        }
                        console.log("Generate: "+ responseData);
                    }
                }).then(() => {
                    switch (groupType){
                        case "Lecture": this.setState({lectures_data: responseData, data: responseData}); break;
                        case "Exercises": this.setState({exercises_data: responseData}); break;
                        case "Laboratory": this.setState({laboratory_exercises_data: responseData}); break;
                        default: break;
                    }
                })
            ).then(() => this.setState({loading: false}));
        });
    }

    render() {
        const {value, data, loading} = this.state;

        if(loading){
            return (
                <div>
                    <LoadingIndicator text={"Loading"}/>
                    <div className={"progress-margin"}/>
                </div>
            )
        }
        return (
            <div className={"mx-auto col-8"}>
                <div className={"mx-auto"} style={{backgroundColor: 'transparent'}}>
                    <StyledTabs value={value} onChange={this.handleChange}>
                        <StyledTab label="Lectures" />
                        <StyledTab label="Exercises" />
                        <StyledTab label="Laboratory Exercises" />
                        <div className={"float-right mt-2"}>
                            <Button
                                inverted
                                className={"mt-1 mb-1"}
                                compact
                                content={"Start Over"}
                                onClick={() => this.props.reset()}
                            />
                            <Button
                                className={"mt-1 mb-1"}
                                inverted
                                color='teal'
                                compact
                                content={'Confirm'}
                            />
                            <Button
                                inverted
                                compact
                                className={"pt-2 pb-1"}
                                icon={<CloseIcon />}
                                onClick={() => this.props.history.push("/home")}
                            />
                        </div>
                    </StyledTabs>
                </div>
                <div className={"mx-auto mt-3 "}>
                    <div className={"col-11 mx-auto"}>
                        <MuiThemeProvider theme={theme}>
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
                            title={"Generated Groups"}
                            columns={groupColumns}
                            data={data}
                            detailPanel={[
                                {
                                    tooltip: "Details",
                                    icon: KeyboardArrowLeftIcon,
                                    openIcon: KeyboardArrowDownIcon,
                                    render: rowData => {
                                        if (!rowData.group_details || rowData.group_details.length === 0)
                                            return <div className={"text-light float-right"}>No staff members were
                                                available for current subject.</div>
                                        else
                                            return (
                                                <TableContainer className={"col-8 float-right"}>
                                                    <Table size="small" aria-label="a dense table">
                                                        <TableHead>
                                                            <TableRow style={{backgroundColor: teal_shade}}>
                                                                <TableCell className={"text-light text-monospace"}><b>Assigned
                                                                    Professor</b></TableCell>
                                                                <TableCell className={"text-light text-monospace"}
                                                                           align="right"><b>Group
                                                                    Capacity</b></TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {
                                                                rowData.group_details.map(function (value) {
                                                                    return (
                                                                        <TableRow key={value.id}>
                                                                            <TableCell align="right"
                                                                                       className={"text-light text-monospace"}>
                                                                                {value.professor}
                                                                            </TableCell>
                                                                            <TableCell align="right"
                                                                                       className={"text-light text-monospace"}>
                                                                                {value.capacity}
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
                        </MuiThemeProvider>
                    </div>
                </div>
            </div>
        )
    }
}
export default ReviewGroups;