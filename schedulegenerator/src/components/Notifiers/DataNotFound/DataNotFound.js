import React from "react";
import NoData from "../../../../src/repository/images/question-mark.png";

const DataNotFound = props => {

    let reason = props.reason;
    let explanation = props.explanation;

    return (
        <div
            className={"mb-5"}
            style={{
                width: "100%",
                height: "100",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
            <row>
                <img alt={"no data found icon"} src={NoData} height={"175em"} width={"175em"}/>
                <h4 className={"text-light text-monospace"}>{reason}</h4>
                <span className={"text-info text-monospace"}>{explanation}</span>
            </row>
        </div>
    );
};
export default DataNotFound;