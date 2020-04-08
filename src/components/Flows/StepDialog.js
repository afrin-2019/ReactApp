import React, { Component } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

class DeleteStepDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      steps: "Step1"
    };
  }

  onDelete = () => {
    let flowList = [...this.props.handleFlowList];
    flowList.map(flow => {
      if (flow.name === this.props.flowSelected) {
        flow.steps.map((step, index) => {
          if (step === this.state.steps) {
            flow.steps.splice(index, 1);
          }
        });
      }
    });
    console.log("in delete", flowList);
    this.props.updateflow(flowList, this.state.steps);
    this.props.onHide();
  };

  dispalyStepDropdown = () => {
    let option = [];
    let flowList = [...this.props.handleFlowList];
    flowList.map(flow => {
      if (flow.name === this.props.flowSelected) {
        flow.steps.map((step, index) => {
          option.push(
            <option key={index} value={step}>
              {step}
            </option>
          );
        });
      }
    });
    return option;
  };

  handleStepChange = step => {
    this.setState({ steps: step });
  };

  onInsert = () => {
    let flowList = [...this.props.handleFlowList];
    let indexToedit = null;
    flowList.map(flow => {
      if (flow.name === this.props.flowSelected) {
        flow.steps.map((step, index) => {
          console.log("flow.steps", flow.steps);
          console.log("step", step);
          console.log("selected step", this.state.steps);
          var selectedStepNo = this.state.steps.replace(/\D/g, "");
          var stepNo = step.replace(/\D/g, "");
          console.log("stepno", stepNo + "selected step", selectedStepNo);
          let updated_stepNo;
          if (step === this.state.steps) {
            updated_stepNo = ++stepNo;
            step = "Step" + updated_stepNo;
            indexToedit = index + 1;
            flow.steps.splice(index + 1, 0, step);
            console.log("step to add", flow);
          }
          console.log("indexToedit", indexToedit, "index", index);
        });
      }
    });

    flowList.map(flow => {
      if (flow.name === this.props.flowSelected) {
        flow.steps.map((step, index) => {
          var stepNo = step.replace(/\D/g, "");
          if (index > indexToedit) {
            let updated_stepNo = ++stepNo;

            step = "Step" + updated_stepNo;
            console.log("step change", step);
            flow.steps[index] = step;
          }
        });
      }
    });
    this.props.onHide();
  };

  render() {
    let footer;
    if (this.props.dialogContent === "delete") {
      footer = (
        <div>
          <Button label="Delete" onClick={this.onDelete} />
          <Button label="Cancel" onClick={this.props.onHide} />
        </div>
      );
    } else if (this.props.dialogContent === "insert") {
      footer = (
        <div>
          <Button label="Insert" onClick={this.onInsert} />
          <Button label="Cancel" onClick={this.props.onHide} />
        </div>
      );
    }
    return (
      <Dialog
        visible={this.state.visible}
        header={this.props.flowSelected}
        style={{ width: "30vw" }}
        closable={false}
        footer={footer}
        onHide={this.props.onHide}
      >
        Please select a step to {this.props.dialogContent} :
        <select
          name="steps"
          value={this.state.steps}
          onChange={event => this.handleStepChange(event.target.value)}
        >
          {this.dispalyStepDropdown()}
        </select>
      </Dialog>
    );
  }
}

export default DeleteStepDialog;
