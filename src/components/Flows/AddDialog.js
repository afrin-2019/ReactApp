import React, { Component } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

class AddDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      textValue: ""
    };
  }

  onAdd = () => {
    this.props.onAddFlow(this.state.textValue);
    this.props.onHide();
  };

  onChange = e => {
    this.setState({ textValue: e.target.value });
  };
  render() {
    const footer = (
      <div>
        <Button label="Add" onClick={this.onAdd} />
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
      >
        <div>
          <input
            type="text"
            value={this.state.textValue}
            onChange={this.onChange}
          />
        </div>
      </Dialog>
    );
  }
}

export default AddDialog;
