import React, { Component } from "react";
import Axios from "axios";

class LinkTabContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: [],
      value: this.props.condition || "",
      step: this.props.selectValue || "",
      radio: this.props.path || "",
      disabled: false,
      index: this.props.index || -1,
      isError: false,
    };
  }

  componentDidMount() {
    if (this.state.value) {
      this.setState({ disabled: true });
    }
  }

  diplayFlowDropdown = () => {
    let option = [];

    this.props.flowList.map((flow, index) => {
      if (flow.name !== this.props.flowSelected) {
        option.push(
          <option key={index} value={flow.name}>
            {flow.name}
          </option>
        );
      }
    });
    return option;
  };

  handleValue = (e) => {
    this.setState({ disabled: false });
    this.setState({ value: e.target.value });
  };

  handleStepChange = (value) => {
    this.setState({ step: value });
  };
  onconfirmCondition = () => {
    console.log("stepno", this.props.stepNo);
    console.log("index", this.state.index);
    if (!this.state.value || !this.state.radio || !this.state.step) {
      this.setState({ isError: true });
    } else {
      Axios.get("http://localhost:5001/flow/content/link", {
        params: {
          flowName: this.props.flowSelected,
          stepNo: this.props.stepNo,
          path: this.state.radio,
          condition: this.state.value,
          nextStep: this.state.step,
          index: this.state.index,
        },
      }).then((res) => {
        console.log("res", res);
        this.setState({ disabled: true });
        this.setState({ isError: false });
      });
    }
  };

  onDelete = () => {
    this.props.handleDelete(this.props.id, this.state.value, this.state.step);
  };

  setRadio = (e) => {
    this.setState({ radio: e.target.value }, () =>
      console.log("radio clicked", this.state.radio)
    );
  };
  render() {
    console.log("props in link", this.props);
    console.log("rdio", this.state.radio);
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
        {this.state.isError ? (
          <p style={{ color: "red" }}>Please fill all fields!</p>
        ) : null}
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
          Condition : &nbsp;
          <input
            type="text"
            value={this.state.value}
            onChange={(e) => this.handleValue(e)}
          />{" "}
          &nbsp;&nbsp;
          <div>
            <input
              type="radio"
              name="radiobtn"
              value="Flow"
              checked={this.state.radio === "Flow"}
              onChange={(e) => this.setRadio(e)}
              //style={{ margin: 2 }}
            />
            Flow <br />
            <input
              type="radio"
              name="radiobtn"
              value="Step"
              checked={this.state.radio === "Step"}
              onChange={(e) => this.setRadio(e)}
              //style={{ margin: 2 }}
            />{" "}
            Step <br />
          </div>
          {this.state.radio === "Flow" ? (
            <select
              name="steplist"
              value={this.state.step}
              onChange={(event) => this.handleStepChange(event.target.value)}
            >
              <option>Select</option>
              {this.diplayFlowDropdown()}
            </select>
          ) : null}
          &nbsp;&nbsp;
          <button
            style={{ margin: 2 }}
            onClick={this.onconfirmCondition}
            disabled={this.state.disabled}
          >
            save
          </button>
        </div>
      </div>
    );
  }
}

export default LinkTabContent;
