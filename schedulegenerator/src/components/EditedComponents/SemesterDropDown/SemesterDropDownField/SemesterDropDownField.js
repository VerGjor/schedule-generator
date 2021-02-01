import {withStyles} from "@material-ui/core";
import TextField from "@material-ui/core/TextField/TextField";

export const SemesterDropDownField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: 'white'
        },
        '& label': {
            color: 'white'
        },
        '& input': {
            color: 'white'
        },
        '& input:after': {
            color: 'white'
        },
        '& .MuiSvgIcon-root': {
            color: 'white'
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#00AEAE',
            borderWidth: "2px"
        },
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
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