import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {teal} from "@material-ui/core/colors";

export const teal_shade = "#00AEAE"

export const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: teal,
        secondary: {
            main: '#006064'
        }
    },
});

export const current_semester = ['Winter', 'Summer'];
export const lab_exer = ["No", "Yes"];
export const prof_title = ['Ph.D.', 'M.Sc.', 'B.Sc.'];
export const job_positions = ['professor', 'assistant', 'demonstrator'];

export const subjectColumns = [
    {
        title: 'Name',
        field: 'subject_name',
        validate: rowData => rowData.subject_name === '' ? { isValid: false, helperText: 'Name cannot be empty' } : true,
        defaultSort: "asc"
    },
    {
        title: 'Semester',
        field: 'subject_enrollment_semester',
        lookup: { "Winter": 'Winter', "Summer": 'Summer' },
        sorting: false
    },
    {
        title: 'Laboratory Exercises',
        field: 'has_laboratory_exercises',
        lookup: { "false": 'No', "true": 'Yes' },
        sorting: false
    },
];

export const staffColumns = [
    {
        title: 'First Name',
        field: 'first_name',
        validate: rowData => rowData.first_name === '' ? { isValid: false, helperText: 'First name cannot be empty' } : true,
        defaultSort: "asc"
    },
    {
        title: 'Title',
        field: 'title',
        lookup: { "B.Sc.": 'B.Sc.', "M.Sc.": 'M.Sc.', "Ph.D.": 'Ph.D.' },
        sorting: false
    },
    {
        title: 'Last Name',
        field: 'last_name',
        validate: rowData => rowData.last_name === '' ? { isValid: false, helperText: 'Last name cannot be empty' } : true,
        sorting: false
    },
    {
        title: 'Position',
        field: 'faculty_position',
        lookup: { "professor": 'professor', "assistant": 'assistant', "demonstrator": 'demonstrator' },
        sorting: false
    },
    {
        title: 'Could teach subjects',
        field: 'teaches_subjects',
        sorting: false
    },
];


export const coursesColumns = [
    {
        title: 'Course Name & Number of Students',
        field: 'course'
    }
];

export const groupColumns = [
    {
        title: 'Subject Name',
        field: 'subject_name'
    },
    {
        title: 'Total generated groups',
        field: 'total_groups'
    }
]

export const options = {
    actionsColumnIndex: -1,
    selection: false,
    pageSize: 8,
    pageSizeOptions : [8],
    sorting: false,
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
};

export const coursesOptions = {
    showEmptyDataSourceMessage: true,
    toolbar: false,
    pageSize: 4,
    pageSizeOptions: [4],
    sorting: false,
    draggable: false,
    loadingType: "overlay",
    padding: "dense",
    addRowPosition: "first",
    rowStyle: {color: "white"},
    minBodyHeight: "15em",
    maxBodyHeight: "15em",
    actionsCellStyle: {color: teal_shade},
    filterRowStyle: {color: teal_shade},
    filterCellStyle:{color: teal_shade},
    search: false,
    showTitle: false,
    headerStyle:{
        backgroundColor: teal_shade,
        color: "white",
        borderBottom: "black",
        fontFamily: "Monospace",
        fontSize: "13px",
        fontWeight: "bold"
    },
    searchFieldStyle: {color: teal_shade},
    detailPanelType: "single",
    detailPanelColumnAlignment: "right"
};

export const groupCoursesOptions = {
    showEmptyDataSourceMessage: true,
    toolbar: false,
    pageSize: 4,
    pageSizeOptions: [4, 10, 20],
    sorting: false,
    draggable: false,
    loadingType: "overlay",
    padding: "dense",
    addRowPosition: "first",
    rowStyle: {color: "white"},
    minBodyHeight: "15em",
    maxBodyHeight: "15em",
    actionsCellStyle: {color: teal_shade},
    filterRowStyle: {color: teal_shade},
    filterCellStyle:{color: teal_shade},
    search: false,
    showTitle: false,
    headerStyle:{
        backgroundColor: teal_shade,
        color: "white",
        borderBottom: "black",
        fontFamily: "Monospace",
        fontSize: "13px",
        fontWeight: "bold"
    },
};
