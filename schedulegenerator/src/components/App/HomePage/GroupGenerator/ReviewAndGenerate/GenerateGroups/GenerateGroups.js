import React from 'react';
import '../../GroupGenerator.css';
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";
import ViewGeneratedCourses from "./ViewGeneratedCourses/ViewGeneratedCourses";

const GenerateGroups = (props) => {
    return (
        <div className={"col-lg-10 mx-auto m-3 row"}>
            <div className={"col-lg-7 mx-auto mr-4 "}>
                <ViewGeneratedCourses
                    semester={props.semester}/>
            </div>
            <FormControl className={"col-lg-5 mt-2 mx-auto border border-rounded border-info border-left-0 p-2 text-left"}>
                <FormLabel>
                    <h5 className={"text-monospace text-light float-left"}>Select the type(s) of the groups:</h5>
                </FormLabel>
                <FormGroup>
                    <FormControlLabel
                        className={"text-monospace"}
                        control={<Checkbox name="Lecture" value={"Lecture"} onChange={props.updateGroupType}/>}
                        label="Course lectures"
                    />
                    <FormControlLabel
                        className={"text-monospace"}
                        control={<Checkbox name="Exercises" value={"Exercises"} onChange={props.updateGroupType}/>}
                        label="Course exercises"
                    />
                    <FormControlLabel
                        className={"text-monospace"}
                        control={<Checkbox name="Laboratory" value={"Laboratory"} onChange={props.updateGroupType}/>}
                        label="Course laboratory exercises"
                    />
                </FormGroup>
                <FormHelperText className={props.classNameDescription}>* Choose at least one</FormHelperText>
            </FormControl>
        </div>
    );
}
export default GenerateGroups;
