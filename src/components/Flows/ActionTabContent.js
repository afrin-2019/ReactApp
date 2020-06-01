import React, { Component } from "react";
import Axios from "axios";

class ActionTabContent extends Component {
  state = {
    action: "0",
    file: "",
    command: "",
  };
  handleActionChange = (actionType) => {
    this.setState({ action: actionType });
    // this.props.enable();
  };

  handleClick = () => {
    this.refs.fileUploader.click();
  };
  handleChange = (e) => {
    let file = e.target.files[0].name;
    console.log("file", file);
    this.setState({ file: file });
  };

  handleCommand = (e) => {
    this.setState({ command: e.target.value });
  };

  onconfirmCommand = () => {
    console.log("command", this.state.command);
    console.log("flowList", this.props.flowList);
    console.log("flow", this.props.flowSelected);
    console.log("step", this.props.stepNo);
    Axios.get("http://localhost:5001/flow/content/action", {
      params: {
        flowName: this.props.flowSelected,
        stepNo: this.props.stepNo,
        command: this.state.command,
        type: "Run a Command",
      },
    }).then((res) => {
      console.log("res", res);
      alert("success");
    });
  };

  onConfirmParse = () => {
    Axios.get("http://localhost:5001/flow/content/action", {
      params: {
        flowName: this.props.flowSelected,
        stepNo: this.props.stepNo,
        file: this.state.file,
        type: "Parse the Output",
      },
    }).then((res) => {
      console.log("res", res);
      alert("success");
    });
  };

  onDelete = () => {
    if (this.state.action === "3") {
      this.props.handleDelete(
        this.props.id,
        this.state.action,
        this.state.command
      );
    } else if (this.state.action === "4") {
      this.props.handleDelete(
        this.props.id,
        this.state.action,
        this.state.file
      );
    } else {
      this.props.handleDelete(this.props.id, this.state.action, "0");
    }
  };
  render() {
    let commandContent;
    if (this.state.action === "3") {
      commandContent = (
        <div style={{ margin: 10 }}>
          <input
            type="text"
            value={this.state.command}
            onChange={this.handleCommand}
          />
          <button style={{ margin: 2 }} onClick={this.onconfirmCommand}>
            Done
          </button>
        </div>
      );
    }
    if (this.state.action === "4") {
      commandContent = (
        <div style={{ margin: 10 }}>
          <input
            type="file"
            id="file"
            ref="fileUploader"
            onChange={(e) => this.handleChange(e)}
            style={{ display: "none" }}
          />
          <label htmlFor="file">{this.state.file}</label>
          <button style={{ margin: 2 }} onClick={this.handleClick}>
            Browse
          </button>
          <button style={{ margin: 2 }} onClick={this.onConfirmParse}>
            Done
          </button>
        </div>
      );
    }

    return (
      <div
        id={this.props.id}
        style={{
          border: "1px solid #d3d3d3",
          borderRadius: 10,
          padding: 6,
          marginLeft: 2,
          marginTop: 10,
          backgroundColor: "#f1f1f1",
          position: "relative",
        }}
      >
        <button
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            margin: 2,
            fontSize: 10,
          }}
          className="btn"
          onClick={this.onDelete}
          title="Delete"
        >
          {" "}
          <i className="fa fa-trash" />
        </button>
        <div
        //style={{ display: "flex", justifyContent: "center" }}
        >
          Select an action:&nbsp;
          <select
            name="action"
            value={this.state.action}
            onChange={(event) => this.handleActionChange(event.target.value)}
          >
            <option value="0">Select</option>
            <option value="1">Find NodeDetails</option>
            <option value="2">Connect</option>
            <option value="3">Run a command</option>
            <option value="4">Parse the output</option>
          </select>
        </div>

        <div
        //style={{ display: "flex", justifyContent: "center" }}
        >
          {" "}
          {commandContent}
        </div>
      </div>
    );
  }
}

export default ActionTabContent;
