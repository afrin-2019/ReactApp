import React, { Component } from "react";
import AddNode from "./AddNode";
import PropertyBar from "./PropertyBar";
//var pos1, pos2, pos3, pos4;
var divList = [];
class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      x: 20,
      y: 60,
      openSideBar: false,
      selectedStep: "",
      d1: "M 287 122 L 417 122",
    };
    this.reff = React.createRef();
  }

  addNode = () => {
    this.setState({ count: this.state.count + 1 }, () =>
      this.props.addStep(this.state.count)
    );
  };

  refreshFlow = () => {
    this.props.refreshFlowList();
  };
  onNodeClick = (step) => {
    this.setState({ selectedStep: step }, () =>
      this.setState({ openSideBar: true })
    );
    console.log("step nodeclick", step);
    //document.getElementById("main1").style.marginRight = "250px";
  };

  onCloseBar = () => {
    this.setState({ openSideBar: false });
    //document.getElementById("main1").style.marginRight = "0";
  };
  drawLine = () => {
    console.log(
      "draw line canvas",
      this.reff.current.offsetLeft + "," + this.reff.current.offsetTop
    );
  };
  render() {
    // var divList = [],
    //   no = 1;
    // {
    //   Array.from({ length: this.state.count }, (_, index) =>
    //     divList.push(
    //       <AddNode
    //         key={index}
    //         index={index}
    //         x={this.state.x}
    //         y={this.state.y}
    //         no={no++}
    //       />
    //     )
    //   );

    let divList;
    divList = (
      <div>
        {this.props.flowList.map((flow) => {
          if (flow.name === this.props.flowName) {
            return flow.steps.map((step, index) => {
              console.log("step", step);
              return (
                <AddNode
                  key={index}
                  index={index}
                  x={step.axis[0]}
                  y={step.axis[1]}
                  x1={step.axis1[0]}
                  y1={step.axis1[1]}
                  stepName={step.name}
                  flowName={this.props.flowName}
                  refresh={this.refreshFlow}
                  handleNodeClick={this.onNodeClick}
                  drawLine={this.drawLine}
                />
              );
            });
          }
        })}
      </div>
    );

    return (
      <div style={{ marginLeft: 210 }}>
        {/* <div id="canvaswrapper"> */}

        <div
          id="canvas"
          ref="canvas"
          //style={{ width: this.state.openSideBar ? "40%" : "70%" }}
        >
          <div id="topcanvas">
            <button
              className="btn btn-sm btn-outline-secondary "
              style={{ margin: 5 }}
              onClick={this.addNode}
            >
              click me
            </button>
            {this.props.flowName}
          </div>
          {/* <div id="canvas1" ref={this.reff}>
            <svg height="200" width="500">
              <path
                d={this.state.d1}
                stroke="grey"
                strokeWidth="2"
                fill="none"
              ></path>
            </svg>
          </div> */}
          <div>{divList}</div>
        </div>

        {/* </div> */}
        {this.state.openSideBar ? (
          <PropertyBar
            handleClose={this.onCloseBar}
            step={this.state.selectedStep}
            flowList={this.props.flowList}
            selectedFlow={this.props.flowName}
          />
        ) : null}
      </div>
    );
  }
}

export default Canvas;
