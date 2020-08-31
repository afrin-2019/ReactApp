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
      index: this.props.ind,
      isError: false,
      alreadySaved: false,
    };
  }

  componentDidMount() {
    if (this.state.value) {
      this.setState({ disabled: true });
      this.setState({ alreadySaved: true });
      this.setState({ oldCondition: this.state.value });
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
    //this.props.disableAdd();
    this.setState({ value: e.target.value });
  };

  handleStepChange = (value) => {
    this.setState({ disabled: false });
    this.setState({ step: value });
  };

  onSave = () => {
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
      if (!this.state.alreadySaved) {
        console.log(this.state.alreadySaved);
        this.props.attachFlow(this.state.value, this.state.radio);
        this.setState({ alreadySaved: true });
      } else {
        console.log(this.props.id);
        let doc = document.getElementById("wrapitem" + this.props.id);
        console.log(doc);
        this.props.handleEdit(
          this.props.id,
          this.state.value,
          this.state.radio,
          this.state.step,
          this.state.oldCondition
        );
        //   this.props.rerender(this.props.flowSelected);
      }
      this.setState({ oldCondition: this.state.value });
      this.props.enableAddLink();
    });
  };
  onconfirmCondition = () => {
    // console.log("stepno", this.props.stepNo);
    // console.log("index", this.state.index);

    if (!this.state.value || !this.state.radio) {
      this.setState({ isError: true });
    } else if (this.state.radio === "Flow") {
      if (!this.state.step) {
        this.setState({ isError: true });
      } else {
        this.onSave();
      }
    } else {
      this.onSave();
    }
  };

  onDelete = () => {
    this.props.handleDelete(this.props.id, this.state.value, this.state.step);
  };

  setRadio = (e) => {
    //this.setState({ disabled: false });
    this.setState({ radio: e.target.value }, () =>
      console.log("radio clicked", this.state.radio)
    );
  };
  render() {
    //console.log("props in link", this.props);
    // console.log("index", this.state.index);
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
          <div style={{ display: "flex", flexDirection: "row" }}>
            <select
              style={{ margin: 2 }}
              name="floworstep"
              value={this.state.radio}
              onChange={(event) => this.setRadio(event)}
              disabled={this.state.alreadySaved ? true : false}
            >
              <option>Select</option>
              <option value="Flow">Flow</option>
              <option value="Step">Step</option>
            </select>
            {this.state.radio === "Flow" ? (
              <select
                style={{ margin: 2 }}
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
      </div>
    );
  }
}

export default LinkTabContent;
