import React from "react";
import MaterialTable from "material-table";
import {trackPromise} from "react-promise-tracker";
import axios from "axios";
import LoadingIndicator from "../../../../../../Notifiers/LoadingIndicator/LoadingIndicator";
import '../../../GroupGenerator.css';
import {coursesColumns, groupCoursesOptions, teal_shade} from "../../../../../../StaticInformation/StaticInformation";
import {getAllCoursesForCurrentSemester} from "../../../../../../StaticInformation/URLs";

class ViewGeneratedCourses extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            hasData: false,
            data: [],
            loading: false,
            loadingText: "Loading",
            promiseDone: false,
        };
    }

    componentDidMount() {
        this.setState({ loading: true }, () =>{
            trackPromise(
                axios.get(getAllCoursesForCurrentSemester+this.props.semester).then(response => {
                    console.log("response:"+response.data);
                        if(response.data.length > 0){
                            let componentData = [];

                            for (let i in response.data) {
                                componentData.push({course: response.data[i]})
                            }

                            this.setState({
                                data: componentData
                            })
                        }
                    }
                ).then(() => this.setState({ hasData: true, loading: false })))
                .then(() => this.setState({promiseDone: true}));
        })
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
            <div className={"mx-auto"}>
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
                    options={groupCoursesOptions}
                    title={"Courses"}
                    columns={coursesColumns}
                    data={data}
                />
            </div>
        );
    }
}
export default ViewGeneratedCourses;