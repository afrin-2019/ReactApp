/* eslint-disable */
import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import AddDialog from "./AddDialog";
import { Button } from "react-bootstrap";
import DeleteStepDialog from "./DeleteStepDialog";
class Flow extends Component {
  state = {
    addDialog: false,
    flowList: [],
    flowClicked: false,
    selectedFlow: "",
    showDeleteDialog: false
  };

  onClick = () => {
    this.setState({ addDialog: true });
    this.setState({ flowClicked: false });
    this.setState({ selectedFlow: "" });
  };

  onHide = () => {
    this.setState({ addDialog: false });
  };

  closeDeleteDialog = () => {
    this.setState({ showDeleteDialog: false });
  };

  addFlowList = list => {
    let isExist = this.checkUniqueness(list);
    if (isExist) {
      alert("already exist");
    } else {
      console.log("flowlist before adding", this.state.flowList);
      let list_to_add = { name: list, steps: [] };
      this.setState({ flowList: [...this.state.flowList, list_to_add] }, () =>
        console.log("after", this.state.flowList)
      );
    }
  };

  checkUniqueness = flow => {
    let isExist = false;
    this.state.flowList.map(item => {
      if (!isExist) {
        if (item.name === flow) {
          isExist = true;
        } else {
          isExist = false;
        }
      }
    });
    return isExist;
  };

  onButtonClick = flow => {
    this.setState({ selectedFlow: flow }, () =>
      console.log("flow clicked", this.state.selectedFlow)
    );
    this.setState({ flowClicked: true });
  };

  addStep = () => {
    this.state.flowList.map((flow, index) => {
      if (flow.name === this.state.selectedFlow) {
        let stepNo = flow.steps.length + 1;
        let stepName = "Step" + stepNo;
        flow.steps.push(stepName);
        console.log(flow + "index" + index);
        this.setState({ flowList: [...this.state.flowList] });
      }
    });
  };

  deleteStep = () => {
    console.log("delete", this.state.selectedFlow);
    this.setState({ showDeleteDialog: true });
  };

  render() {
    console.log("this.state.flowList", this.state.flowList);
    const displayFlow = this.state.flowList.map((flow, index) => {
      return (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "center"
          }}
        >
          {flow.name}
          <button
            style={{
              marginLeft: 50,
              backgroundColor: "Transparent",
              border: "none"
            }}
            onClick={() => this.onButtonClick(flow.name)}
          >
            <i className="fa fa-play"></i>
          </button>
        </div>
      );
    });
    let addStep, deleteStep, insertStep, stepsBar;
    if (this.state.selectedFlow !== "") {
      addStep = <Button onClick={this.addStep}>Add Step</Button>;
      deleteStep = <Button onClick={this.deleteStep}>Delete Step</Button>;
      insertStep = <Button>Insert Step</Button>;
      stepsBar = (
        <div className="steps">
          <p style={{ display: "flex", justifyContent: "center" }}>
            {" "}
            {this.state.selectedFlow}
          </p>
          {this.state.flowList.map(flow => {
            if (flow.name === this.state.selectedFlow) {
              return flow.steps.map((step, index) => {
                return (
                  <div
                    key={index}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <button className="btn btn-link">{step}</button>
                  </div>
                );
              });
            }
          })}
        </div>
      );
    }
    return (
      <div style={{ marginLeft: 200 }}>
        <Navbar bg="light" expand="lg">
          <button onClick={this.onClick}>
            <i className="fa fa-fw fa-plus" style={{ margin: 10 }}></i>
          </button>
          <div>
            {addStep} {deleteStep} {insertStep}
          </div>
        </Navbar>

        <div className="panelbar_flow">{displayFlow}</div>
        <div style={{ marginLeft: 200 }}>{stepsBar}</div>
        {this.state.addDialog ? (
          <AddDialog onHide={this.onHide} onAddFlow={this.addFlowList} />
        ) : null}
        {this.state.showDeleteDialog ? (
          <DeleteStepDialog onHide={this.closeDeleteDialog} />
        ) : null}
      </div>
    );
  }
}

export default Flow;
