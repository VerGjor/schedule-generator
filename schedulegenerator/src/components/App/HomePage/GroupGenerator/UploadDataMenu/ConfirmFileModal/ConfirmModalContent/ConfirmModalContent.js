import {Modal} from "semantic-ui-react";
import React from "react";

const ConfirmModalContent = props => {
  return(
      <Modal.Content className={"mt-5"}>
          <h3 className={"m-5 text-monospace"}>You have selected the following file:
              <span className={"teal_color text-monospace"}>
                     {props.fileName}
                </span></h3>
          <h5 className={"font-weight-bold text-monospace teal_color"}>
              Hint:
              <span className={"font-weight-lighter text-monospace text-light"}>
                    The content of the file should have the following format:
                </span>
          </h5>
          <h5 className={"font-weight-lighter text-monospace teal_color"}>
              {props.format}
          </h5>
          <h2 className={"m-5 text-monospace"}>
              Do you wish to continue?
          </h2>
      </Modal.Content>
  )
};
export default ConfirmModalContent;