import React, { Component } from "react";
import { Navbar } from "react-bootstrap";
import AddDialog from "./AddDialog";
import { Button } from "react-bootstrap";
import StepDialog from "./StepDialog";
import { Menu } from "primereact/menu";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import StepDetails from "./StepDetails1";
import SideNavBar from "../SideNavBar";
import LogOut from "../LogOut";
class Flow extends Component {
  state = {
    addDialog: false,
    flowList: [],
    flowClicked: false,
    selectedFlow: "",
    showDeleteDialog: false,
    showInsertDialog: false,
    showDupDialog: false,
    showStepDetails: false,
    DupName: "",
    step: "",
    options: [
      {
        label: "Delete",
        icon: "fa fa-fw fa-trash",
        command: () => {
          this.onDeleteFlow();
        },
      },
      {
        label: "Duplicate",
        icon: "fa fa-fw fa-files-o",
        command: () => {
          this.onDuplicateFlow();
        },
      },
    ],
  };

  componentDidMount() {
    this.refreshFlowList();
  }

  refreshFlowList = () => {
    axios.get("http://localhost:5001/get/flows/flowList").then((response) => {
      console.log("res", response);
      this.setState({ flowList: response.data });
    });
  };

  onClick = () => {
    this.setState({ addDialog: true });
    this.setState({ flowClicked: false });
    this.setState({ selectedFlow: "" });
  };

  onHide = () => {
    this.setState({ addDialog: false });
  };

  onHideDup = () => {
    this.setState({ showDupDialog: false });
  };

  closeDeleteDialog = () => {
    this.setState({ showDeleteDialog: false });
  };

  closeInsertDialog = () => {
    this.setState({ showInsertDialog: false });
  };

  addFlowList = (list) => {
    let isExist = this.checkUniqueness(list);
    if (isExist) {
      alert("already exist");
    } else {
      let list_to_add = { name: list, steps: [] };
      axios
        .post("http://localhost:5001/insert/flows/flowList", {
          data: list_to_add,
        })
        .then((res) => {
          console.log("res after insert", res);
          this.refreshFlowList();
        });
      //this.setState({ flowList: [...this.state.flowList, list_to_add] });
    }
  };

  checkUniqueness = (flow) => {
    let isExist = false;
    this.state.flowList.map((item) => {
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

  onButtonClick = (flow) => {
    this.setState({ selectedFlow: flow });
    this.setState({ flowClicked: true });
  };

  addStep = () => {
    console.log("in add step", this.state.flowList);
    this.state.flowList.map((flow, index) => {
      console.log("inside map", flow);
      if (flow.name === this.state.selectedFlow) {
        let stepNo = flow.steps.length + 1;
        let stepName = "Step" + stepNo;
        let request = {
          flowName: flow.name,
          step: stepName,
        };
        axios
          .put("http://localhost:5001/insert/flows/steps", { data: request })
          .then((response) => {
            console.log("res after step insert", response);
            this.refreshFlowList();
          });
        // flow.steps = [...flow.steps, stepName];
        // console.log("after adding step", flow);
        // this.setState({ flowList: this.state.flowList });
      }
    });
  };

  deleteStep = () => {
    this.setState({ showDeleteDialog: true });
  };

  updateFlow = (flowList, selectedStep) => {
    console.log("in update", flowList, "and step no is" + selectedStep);
    flowList.map((flow) => {
      console.log("inside map", flow);
      if (flow.name === this.state.selectedFlow) {
        flow.steps.map((step, index) => {
          var selectedStepNo = selectedStep.replace(/\D/g, "");
          console.log("stepname", step);
          var stepNo = step.replace(/\D/g, "");
          if (stepNo >= selectedStepNo) {
            let updated_stepNo = stepNo - 1;
            step = "Step" + updated_stepNo;
            flow.steps[index] = step;
          }
        });
        console.log("after step changes", flow);
      }
    });
  };

  insertStep = () => {
    this.setState({ showInsertDialog: true });
  };

  onDeleteFlow = () => {
    // let newFlowList = [...this.state.flowList];
    // newFlowList.map((flow, index) => {
    //   if (flow.name === this.state.selectedFlow) {
    //     newFlowList.splice(index, 1);
    //   }
    // });
    // console.log("after delete", newFlowList);
    // this.setState({ selectedFlow: "" });
    // this.setState({ flowList: newFlowList });
    let req = {};
    req = {
      flowName: this.state.selectedFlow,
    };
    axios
      .delete("http://localhost:5001/delete/flows/flowList", { data: req })
      .then((res) => {
        console.log("res", res);
        this.refreshFlowList();
      });
  };

  onDuplicateFlow = () => {
    this.setState({ showDupDialog: true });
  };

  handleDuplicate = () => {
    let isExist = this.checkUniqueness(this.state.DupName);
    if (isExist) {
      alert("already exist");
    } else {
      let list_to_add = { name: this.state.DupName, steps: [] };
      this.state.flowList.map((flow) => {
        if (flow.name === this.state.selectedFlow) {
          flow.steps.map((step) => {
            list_to_add.steps.push(step);
          });
        }
      });
      axios
        .post("http://localhost:5001/insert/flows/flowList", {
          data: list_to_add,
        })
        .then((res) => {
          console.log("res after insert", res);
          this.refreshFlowList();
        });
    }
    this.onHideDup();
  };

  showMenu = (event, flowName) => {
    this.menu.toggle(event);
    this.setState({ selectedFlow: flowName });
  };

  onChange = (e) => {
    this.setState({ DupName: e.target.value });
  };

  setStep = (step) => {
    this.setState({ step: step });
    this.setState({ showStepDetails: true });
  };
  render() {
    console.log("this.state.flowList", this.state.flowList);
    const displayFlow = this.state.flowList.map((flow, index) => {
      return (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "center",
          }}
          className={this.state.selectedFlow === flow.name ? "active-flow" : ""}
        >
          <button
            style={{
              backgroundColor: "Transparent",
              border: "none",
              outline: "none",
            }}
            onClick={() => this.onButtonClick(flow.name)}
          >
            {flow.name}
          </button>
          <div>
            <button
              onClick={(event) => this.showMenu(event, flow.name)}
              aria-controls="popup_menu"
              aria-haspopup={true}
              style={{
                marginLeft: 50,
                backgroundColor: "Transparent",
                border: "none",
              }}
            >
              <i className="fa fa-lg fa-sort-desc"></i>
            </button>
          </div>
        </div>
      );
    });
    let addStep, deleteStep, insertStep, stepsBar;
    if (this.state.selectedFlow !== "") {
      addStep = (
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={this.addStep}
          style={{ marginRight: 10 }}
        >
          Add Step
        </button>
      );
      deleteStep = (
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={this.deleteStep}
          style={{ marginRight: 10 }}
        >
          Delete Step
        </button>
      );
      insertStep = (
        <button
          className="btn btn-sm btn-outline-secondary "
          onClick={this.insertStep}
        >
          Insert Step
        </button>
      );
      stepsBar = (
        <div className="steps">
          {/* <p style={{ display: "flex", justifyContent: "center" }}>
            {" "}
            {this.state.selectedFlow}
          </p> */}
          {this.state.flowList.map((flow) => {
            if (flow.name === this.state.selectedFlow) {
              return flow.steps.map((step, index) => {
                return (
                  <div
                    key={index}
                    style={{ display: "flex", flexDirection: "column" }}
                    className={
                      this.state.selectedFlow === flow.name &&
                      this.state.step === step
                        ? "active-step"
                        : ""
                    }
                  >
                    <button
                      className="btn btn-link"
                      onClick={() => this.setStep(step)}
                    >
                      {step}
                    </button>
                  </div>
                );
              });
            }
          })}
        </div>
      );
    }
    const footer = (
      <div>
        <Button onClick={this.handleDuplicate}>Confirm</Button>
        <Button onClick={this.onHideDup}>Cancel</Button>
      </div>
    );
    return (
      <React.Fragment>
        <SideNavBar />
        <div style={{ marginLeft: 200 }}>
          <Menu
            model={this.state.options}
            popup={true}
            ref={(el) => (this.menu = el)}
            id="popup_menu"
            style={{ margin: 5 }}
          />
          <Navbar bg="light" expand="lg">
            <button
              className="btn btn-sm btn-outline-secondary "
              onClick={this.onClick}
              title="Add Flow"
            >
              <i className="fa fa-plus" style={{ margin: 5 }}></i>
            </button>
            <div
              // style={{ marginLeft: 300 }}
              className="ml-auto"
            >
              {addStep} {deleteStep} {insertStep}
            </div>
            <LogOut />
          </Navbar>

          <div className="panelbar_flow">{displayFlow}</div>
          <div style={{ marginLeft: 210 }}>{stepsBar}</div>

          {this.state.addDialog ? (
            <AddDialog onHide={this.onHide} onAddFlow={this.addFlowList} />
          ) : null}
          {this.state.showDeleteDialog ? (
            <StepDialog
              onHide={this.closeDeleteDialog}
              handleFlowList={this.state.flowList}
              flowSelected={this.state.selectedFlow}
              updateflow={this.updateFlow}
              dialogContent="delete"
            />
          ) : null}
          {this.state.showInsertDialog ? (
            <StepDialog
              onHide={this.closeInsertDialog}
              dialogContent="insert"
              handleFlowList={this.state.flowList}
              flowSelected={this.state.selectedFlow}
            />
          ) : null}
          {this.state.showStepDetails ? (
            <StepDetails
              selectedStep={this.state.step}
              handleFlowList={this.state.flowList}
              flowSelected={this.state.selectedFlow}
            />
          ) : null}
          <Dialog
            visible={this.state.showDupDialog}
            style={{ width: "30vw" }}
            closable={false}
            footer={footer}
            onHide={this.onHideDup}
          >
            Name of the duplicate flow :
            <input
              type="text"
              value={this.state.DupName}
              onChange={this.onChange}
              style={{ marginRight: 10 }}
            />
          </Dialog>
        </div>
      </React.Fragment>
    );
  }
}

export default Flow;