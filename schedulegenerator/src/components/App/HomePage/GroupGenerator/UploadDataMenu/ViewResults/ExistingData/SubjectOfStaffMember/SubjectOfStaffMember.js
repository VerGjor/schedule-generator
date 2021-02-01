import {ThemeProvider as MuiThemeProvider} from "@material-ui/styles";
import MaterialTable from "material-table";
import {Button} from "semantic-ui-react";
import * as React from "react";
import {options} from "../../../../../../../StaticInformation/StaticInformation";

const SubjectOfStaffMember = (props) => {
    return(
        <div className={"mx-auto m-3"}>
            <MuiThemeProvider theme={props.theme}>
                <MaterialTable
                    style={{scrollbarColor: "teal", backgroundColor: "black", color: "white"}}
                    options={options}
                    title={props.title+" could teach:"}
                    columns={props.subjectsColumns}
                    data={props.subjectsData}
                />
            </MuiThemeProvider>
            <Button
                inverted color='teal'
                className={"m-1"}
                onClick={props.goBack}>
                Back To Faculty Staff
            </Button>
            <Button
                inverted
                className={"m-1"}
                onClick={props.handleClose}>
                Close
            </Button>
        </div>
    )
}
export default SubjectOfStaffMember;