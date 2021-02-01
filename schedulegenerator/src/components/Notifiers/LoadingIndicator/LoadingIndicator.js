import Loader from "react-loader-spinner";
import React from "react";

const LoadingIndicator = props => {

    return (
        <div
            className={"mb-5 mt-5"}
            style={{
            width: "100%",
            height: "100",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <row>
                <Loader type="ThreeDots" color="#00AEAE" height="100" width="100" />
                <h4 className={"text-light text-monospace"}>{props.text}</h4>
            </row>
        </div>
    );
};
export default LoadingIndicator;