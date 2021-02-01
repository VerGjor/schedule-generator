import {withStyles} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";

export const SemesterField = withStyles({
    root: {
        '& label.Mui-disabled': {
            color: '#FFFFFF'
        },
        '& input.Mui-disabled': {
            color: '#FFFFFF'
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-disabled fieldset': {
                borderColor: '#00AEAE',
                borderWidth: "2px"
            },
            '&:hover fieldset': {
                borderColor: '#00AEAE',
                borderWidth: "2px"
            },
            '&.Mui-focused fieldset': {
                borderColor: '#00AEAE',
                borderWidth: "2px"
            },
        },
    },
})(TextField);