import React, { Component } from "react";
import Axios from "axios";
class LinkTabContent extends Component {
  state = {
    steps: [],
    value: "",
    step: "",
  };

  diplayStepDropdown = () => {
    let option = [];
    let i = 0;
    this.props.flowList.map((flow) => {
      if (flow.name === this.props.flowSelected) {
        flow.steps.map((step) => {
          i++;
          option.push(
            <option key={i} value={step}>
              {step}
            </option>
          );
        });
      }
    });
    return option;
  };

  handleValue = (e) => {
    this.setState({ value: e.target.value });
  };

  handleStepChange = (value) => {
    this.setState({ step: value });
  };
  onconfirmCondition = () => {
    console.log("done", this.state.value + "", this.state.step);
    Axios.get("http://localhost:5001/flow/content/link", {
      params: {
        flowName: this.props.flowSelected,
        stepNo: this.props.stepNo,
        condition: this.state.value,
        nextStep: this.state.step,
      },
    }).then((res) => {
      console.log("res", res);
      alert("success");
    });
  };

  onDelete = () => {
    this.props.handleDelete(this.props.id, this.state.value, this.state.step);
  };
  render() {
    console.log("in link", this.props.flowList);
    console.log(this.props.flowSelected);
    return (
      <div
        id={this.props.id}
        style={{
          border: "2px solid #d3d3d3",
          borderRadius: 10,
          padding: 10,
          marginLeft: 80,
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
            margin: 5,
            fontSize: 12,
          }}
          className="btn"
          onClick={this.onDelete}
          title="Delete"
        >
          {" "}
          <i className="fa fa-trash" />
        </button>
        <div style={{ display: "flex", justifyContent: "center" }}>
          Condition : &nbsp;
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleValue}
          />{" "}
          &nbsp;&nbsp;
          <select
            name="steplist"
            value={this.state.step}
            onChange={(event) => this.handleStepChange(event.target.value)}
          >
            <option>Select</option>
            {this.diplayStepDropdown()}
          </select>{" "}
          &nbsp;&nbsp;
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={this.onconfirmCondition}
          >
            Done
          </button>
        </div>
      </div>
    );
  }
}

export default LinkTabContent;
