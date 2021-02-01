import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import React from "react";
import {SemesterDropDownField} from "./SemesterDropDownField/SemesterDropDownField";

const SemesterDropDown = props => {
    return(
        <Autocomplete
            className={"col-lg-3 mx-auto"}
            renderInput={params =>
                <SemesterDropDownField
                    {...params}
                    size="small"
                    label="Semester"
                    variant="outlined"/>}
            disableClearable
            getOptionLabel={option => option.toString()}
            getOptionSelected={option => option.toString()}
            options={props.options} value={props.semester} onChange={e => props.updateSemester(e)}/>
    );
};
export default SemesterDropDown;