import React from 'react';
import './HomePage.css';
import { withRouter } from 'react-router-dom'

const HomePage = props => {
    const {history} = props;
    return (
        <div className={"container col-lg-12"}>
            <div className={"row col-lg-8 mx-auto mt-5"}>
                <div className='d-inline-block pb-5 mx-auto groups btn shadow-none'
                     onClick={() => history.push("/generator/group")}/>
                <div className='d-inline-block pb-5 mx-auto schedules btn shadow-none'
                     onClick={() => history.push("/generator/schedule")}/>
            </div>
        </div>
    );
};
export default withRouter(HomePage);
