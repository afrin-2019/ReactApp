import React, { Component } from "react";
import Axios from "axios";

class InputField extends Component {
  state = {
    variable: this.props.variable || "",
    disabled: false,
    alreadySaved: false,
    oldvariable: this.props.variable || "",
  };

  componentDidMount() {
    if (this.state.variable) {
      this.setState({ disabled: true });
      this.setState({ alreadySaved: true });
    }
  }

  handleVariable = (e) => {
    this.setState({ disabled: false });
    this.setState({ variable: e.target.value });
  };

  onSave = () => {
    console.log("saved", this.state.alreadySaved);
    if (!this.state.alreadySaved) {
      this.setState({ oldvariable: this.state.variable });
      if (this.props.index === 0) {
        this.props.save(this.state.variable);
        this.setState({ disabled: true });
        this.setState({ alreadySaved: true });
      } else {
        Axios.put("http://localhost:5001/flow/update/add-receive-variable", {
          flowName: this.props.flowSelected,
          stepNo: this.props.stepNo,
          actionType: "Receive Variable",
          id: this.props.id,
          variable: this.state.variable,
        }).then((res) => {
          this.setState({ disabled: true });
          this.setState({ alreadySaved: true });
          this.props.addVariable(this.state.variable);
        });
      }
    } else {
      console.log("id", this.props.id);
      this.props.editVariable(this.state.oldvariable, this.state.newvariable);
      Axios.put("http://localhost:5001/flow/edit/add-receive-variable", {
        flowName: this.props.flowSelected,
        stepNo: this.props.stepNo,
        actionType: "Receive Variable",
        id: this.props.id,
        newvariable: this.state.variable,
        oldvariable: this.state.oldvariable,
        varIndex: parseInt(this.props.index),
      }).then((res) => {
        this.setState({ disabled: true });

        this.setState({ oldvariable: this.state.variable });
      });
    }
  };

  onDelete = () => {
    console.log("deleted");
    Axios.put("http://localhost:5001/flow/delete/add-receive-variable", {
      flowName: this.props.flowSelected,
      stepNo: this.props.stepNo,
      actionType: "Receive Variable",
      id: this.props.id,
      variable: this.state.variable,
    }).then((res) => {
      console.log(res);
      this.props.deleteInput(this.props.index);
    });
  };
  render() {
    return (
      <React.Fragment>
        {" "}
        <input
          type="text"
          style={{ marginBottom: 4 }}
          value={this.state.variable}
          onChange={this.handleVariable}
        />
        <button
          style={{
            margin: 2,
            fontSize: 10,
          }}
          className="btn"
          onClick={this.onSave}
          disabled={this.state.disabled}
          title="Save"
        >
          <i className="fa fa-save" />
        </button>
        {this.state.disabled && (
          <button
            style={{
              //margin: 2,
              fontSize: 10,
            }}
            className="btn"
            onClick={this.onDelete}
            title="Delete"
          >
            <i className="fa fa-times" />
          </button>
        )}
      </React.Fragment>
    );
  }
}

export default InputField;
