import React, { Component } from "react";
import AddNode from "./AddNode";
import PropertyBar from "./PropertyBar";
import Axios from "axios";
//var pos1, pos2, pos3, pos4;
var divList = [];
let ind;
class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      x: 20,
      y: 60,
      //openSideBar: false,
      selectedStep: "",
      pathList: [],
      newPath: [],
    };
    this.canvasreff = React.createRef();
  }

  componentDidMount() {
    console.log("in canvas mount", this.props.flowName);
    // this.props.pathInfo.map((path, index) => {
    //   if (path.flowname === this.props.flowName) {
    //     let pathname = path.pathname.split("-");
    //     this.setState({
    //       pathList: [
    //         ...this.state.pathList,
    //         <path key={index} id={pathname[0]} d={path.path} />,
    //       ],
    //     });
    //   }
    // });
  }

  addNode = () => {
    this.setState({ count: this.state.count + 1 }, () =>
      this.props.addStep(this.state.count)
    );
  };

  refreshFlow = () => {
    this.props.refreshFlowList();
  };
  // onNodeClick = (step) => {
  //   this.setState({ selectedStep: step }, () =>
  //     this.setState({ openSideBar: true })
  //   );
  // console.log("step nodeclick", step);
  //document.getElementById("main1").style.marginRight = "250px";
  // };

  handleStepClick = (step) => {
    this.setState({ selectedStep: step });
  };

  onCloseBar = () => {
    this.setState({ openSideBar: false });
    //document.getElementById("main1").style.marginRight = "0";
  };
  // addPath = (pathid, d, flowname) => {
  //   console.log("add path in - ", flowname);
  //   if (flowname === this.props.flowName) {
  //     ind = ++ind;
  //     this.setState({
  //       newPath: [...this.state.newPath, <path key={ind} id={pathid} d={d} />],
  //     });
  //   }
  // };
  render() {
    let divList, pathList;
    divList = (
      <div>
        {this.props.flowList.map((flow) => {
          if (flow.name === this.props.flowName) {
            return flow.steps.map((step, index) => {
              //console.log("step", step);
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
                  stepClicked={this.handleStepClick}
                  flowList={this.props.flowList}
                  pathInfo={this.props.pathInfo}
                  //addPath={this.addPath}
                  canvasRef={this.canvasreff}
                />
              );
            });
          }
        })}
      </div>
    );
    let pathname;
    pathList = this.props.pathInfo.map((path, index) => {
      console.log("pathlist flow name", this.props.flowName);
      if (path.flowname === this.props.flowName) {
        pathname = path.pathname.split("-");
        //ind = index;
        return <path key={index} id={pathname[0]} d={path.path} />;
      }
    });

    return (
      <div style={{ marginLeft: 210 }}>
        {/* <div id="canvaswrapper"> */}

        <div
          id="canvas"
          ref={this.canvasreff}
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
          <div id="canvas1">
            <svg id="svg">
              {pathList}
              {/* {this.state.newPath} */}
            </svg>
          </div>
          <div>{divList}</div>
        </div>
      </div>
    );
  }
}

export default Canvas;
