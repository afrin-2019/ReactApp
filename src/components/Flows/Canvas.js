import React, { Component } from "react";
import AddNode from "./AddNode";
import PropertyBar from "./PropertyBar";
import axios from "axios";
import SvgLines from "./SvgLines";
import { Menu } from "primereact/menu";
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
      // pathList: [],
      pathList: [],
      newPath: [],
      selectPath: false,
      pathId: "",
    };
    this.canvasreff = React.createRef();
  }

  componentDidMount() {
    //console.log("in canvas mount", this.props.flowName);
    this.setPath();
  }

  onDeletePath = () => {
    console.log("delete");
    this.setState({ selectPath: false });
    let req = {
      flowName: this.props.flowName,
      pathid: this.state.pathId,
    };
    axios
      .delete("http://localhost:5001/delete/flows/path", {
        data: req,
      })
      .then((res) => {
        console.log(res);
        // let arr = [];
        // arr = [...this.state.pathList];
        // arr.map((path, index) => {
        //   if (path.props.id === this.state.pathId) {
        //     arr.splice(index, 1);
        //     this.setState({ pathList: arr });
        //   }
        // });

        //this.refreshFlow();

        //this.props.refreshPath();
        // this.endLine();
        this.props.rerender(this.props.flowName);
        //this.forceUpdate();
      });
  };

  onPathClick = (pathid) => {
    console.log("on click -", pathid);
    this.setState({ pathId: pathid }, () =>
      console.log("pathid", this.state.pathId)
    );
    this.setState({ selectPath: true });
  };

  setPath = () => {
    let pathArray = [];
    this.props.pathInfo.map((path, index) => {
      ind = index;
      if (path.flowname === this.props.flowName) {
        let pathname = path.pathname.split("-");
        pathArray.push(
          <path
            key={index}
            id={pathname[0]}
            d={path.path}
            onClick={(e) => this.onPathClick(e.target.id)}
            className={this.state.pathId === pathname[0] ? "active-path" : ""}
          />
        );
      }
    });
    // this.state.pathList.map((path, index) => {
    //   ind = index;
    //   let pathname = path.pathname.split("-");
    //   pathArray.push(<path key={index} id={pathname[0]} d={path.path} />);
    // });
    this.setState({ pathList: pathArray });
  };

  componentWillReceiveProps() {
    console.log("receive props", this.props);
    this.setPath();
  }

  addNode = () => {
    this.setState({ count: this.state.count + 1 }, () =>
      this.props.addStep(this.state.count)
    );
  };

  showMenu = (event) => {
    this.menu.toggle(event);
  };

  endLine = () => {
    console.log("in end line canvas");
    let pathArray = [],
      pathname;
    axios.get("http://localhost:5001/get/flows/pathinfo").then((res) => {
      res.data.map((path, index) => {
        ind = index;
        if (path.flowname === this.props.flowName) {
          pathname = path.pathname.split("-");
          pathArray.push(
            <path
              key={index}
              id={pathname[0]}
              d={path.path}
              onClick={(e) => this.onPathClick(e.target.id)}
              className={this.state.pathId === pathname[0] ? "active-path" : ""}
            />
          );
          console.log("patharray", pathArray);
        }
      });
      this.setState({ pathList: pathArray });
    });
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
  addPath = (pathid, d, flowname) => {
    //console.log("add path in - ", flowname);
    if (flowname === this.props.flowName) {
      ind = ++ind;
      this.setState({
        pathList: [
          ...this.state.pathList,
          <path
            key={ind}
            id={pathid}
            d={d}
            onClick={(e) => this.onPathClick(e.target.id)}
            className={this.state.pathId === pathid ? "active-path" : ""}
          />,
        ],
      });
    }
  };

  removePath = () => {
    let updatedPathList = [...this.state.pathList];
    let index = updatedPathList.length - 1;
    updatedPathList.splice(index, 1);
    console.log("after remove", updatedPathList);
    this.setState({ pathList: updatedPathList });
  };

  // drawLine = (pathid, d) => {
  //   this.state.pathList.map((path) => {
  //     console.log("path", path);
  //   });
  // };
  render() {
    //console.log("in canvas render");
    console.log("pathlist", this.state.pathList);
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
                  addPath={this.addPath}
                  drawLine={this.drawLine}
                  endLine={this.endLine}
                  refreshPath={this.props.refreshPath}
                  removePath={this.removePath}
                  //canvasRef={this.canvasreff}
                />
              );
            });
          }
        })}
      </div>
    );
    // let pathname;
    // pathList = this.props.pathInfo.map((path, index) => {
    //   console.log(
    //     "pathlist flow name",
    //     this.props.flowName + " -" + path.flowname
    //   );
    //   if (path.flowname === this.props.flowName) {
    //     pathname = path.pathname.split("-");
    //     console.log("pathname", pathname);
    //     //ind = index;
    //     return <path key={index} id={pathname[0]} d={path.path} />;
    //   }
    // });

    return (
      <React.Fragment>
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
              {this.state.selectPath ? (
                <button
                  className="btn btn-sm btn-outline-secondary "
                  style={{ margin: 5 }}
                  onClick={this.onDeletePath}
                >
                  delete path
                </button>
              ) : null}
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
              <svg id="svg">{this.state.pathList} </svg>
              {/* <SvgLines
              svgId={this.props.flowName}
              pathInfo={this.props.pathInfo}
              flowName={this.props.flowName}
            /> */}
            </div>
            <div>{divList}</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Canvas;
