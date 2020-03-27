import React, { Component } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

class DeleteStepDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true
    };
  }

  onDelete = () => {
    console.log("delete");
  };
  render() {
    const footer = (
      <div>
        <Button label="Delete" onClick={this.onDelete} />
        <Button label="Cancel" onClick={this.props.onHide} />
      </div>
    );
    return (
      <Dialog
        visible={this.state.visible}
        style={{ width: "30vw" }}
        closable={false}
        footer={footer}
        onHide={this.props.onHide}
      ></Dialog>
    );
  }
}

export default DeleteStepDialog;
