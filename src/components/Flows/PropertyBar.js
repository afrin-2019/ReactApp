import React, { Component } from "react";
import StepDetails from "./StepDetails1";
class PropertyBar extends Component {
  constructor(props) {
    super(props);
  }

  closeBar = () => {
    this.props.handleClose();
  };

  render() {
    //console.log("in prp", this.props.step);
    //console.log("props", this.props);
    return (
      <div
        className="sidebar_right"
        id={"rightSideBar" + this.props.step}
        style={{ userSelect: "none" }}
      >
        <button
          className="btn btn-sm btn-outline-secondary m-2 closebtn"
          onClick={this.closeBar}
        >
          ×
        </button>
        {this.props.step}
        <StepDetails
          selectedStep={this.props.step}
          handleFlowList={this.props.flowList}
          flowSelected={this.props.selectedFlow}
          attachFlow={(condition, value) =>
            this.props.attachFlow(condition, value)
          }
          disableAttach={() => this.props.disableAttach()}
          refresh={this.props.refresh}
          deleteFlow={(req) => this.props.deleteFlow(req)}
          editFlow={this.props.editFlow}
          rerender={(flowName) => this.props.rerender(flowName)}
        />
      </div>
    );
  }
}

export default PropertyBar;
