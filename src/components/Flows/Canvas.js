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
      flowList: this.props.flowList,
      isOpen: false,
      //deleteStep: this.props.deleteStep,
    };
    this.canvasreff = React.createRef();
  }

  componentDidMount() {
    //console.log("in canvas mount", this.props.flowName);
    //console.log("in mount canvas");
    this.setPath();
  }

  onDeletePath = () => {
    console.log("delete");
    this.setState({ selectPath: false });
    this.props.pathInfo.map((pathinfo) => {
      if (pathinfo.pathid === this.state.pathId) {
        console.log("in delete-update");
        axios
          .put("http://localhost:5001/update/flow/link", {
            flowName: this.props.flowName,
            stepno: pathinfo.startStep,
            condition: pathinfo.condition,
            nextstep: "",
          })
          .then((res) => console.log("after path delete", res));
      }
    });
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
        let ptag = document.getElementById("P-" + this.state.pathId);
        if (ptag !== null) {
          ptag.remove();
        }
        let spantag = document.getElementById("Span-" + this.state.pathId);
        if (spantag !== null) {
          spantag.remove();
        }
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

  onDeleteStep = () => {
    //console.log("in canvas delete step");
    axios
      .put("http://localhost:5001/delete/flows/steps", {
        flowName: this.props.flowName,
        step: this.state.selectedStep,
      })
      .then((res) => {
        let request = {
          flowName: this.props.flowName,
          step: this.state.selectedStep,
        };
        axios
          .delete("http://localhost:5001/delete/flows/path/stepDelete", {
            data: request,
          })
          .then((res) => {
            console.log("after path delete", res);

            axios
              .get("http://localhost:5001/get/flows/flowContent")
              .then((res) => {
                res.data.map((flow) => {
                  if (flow.Flow === this.props.flowName) {
                    if (flow.Step === this.state.selectedStep)
                      axios
                        .delete("http://localhost:5001/delete/flowcontent", {
                          data: request,
                        })
                        .then((res) => {
                          console.log(res);
                          this.refFlowListInCanvas();
                          //this.props.refreshFlowList();
                          //this.props.refreshPath();
                        });
                  }
                });
              });
          });
        //this.props.rerender(this.props.flowName);
        console.log("after del step", this.props.flowList);
      });
    this.setState({ deleteStep: false });
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
    //console.log("receive props", this.props);
    this.setPath();
  }

  addNode = () => {
    console.log("in add node", this.state.flowList);
    this.setState(
      { count: this.state.count + 1 },
      () => this.props.addStep(this.state.count)
      // {
      //   this.state.flowList.map((flow, index) => {
      //     console.log("inside map", flow);
      //     if (flow.name === this.props.flowName) {
      //       let stepNo = flow.steps.length + 1;
      //       let stepName = "Step" + stepNo;
      //       let obj = {};
      //       obj["name"] = stepName;
      //       obj["axis"] = [20, 60];
      //       obj["axis1"] = [120, 70];

      //       let request = {
      //         flowName: flow.name,
      //         step: obj,
      //       };
      //       axios
      //         .put("http://localhost:5001/insert/flows/steps", {
      //           data: request,
      //         })
      //         .then((response) => {
      //           console.log("res after step insert", response);
      //           this.refFlowListInCanvas();
      //         });
      //     }
      //   });
      // }
    );
  };

  refFlowListInCanvas = () => {
    //console.log("flowlist refresh in canvas");
    axios.get("http://localhost:5001/get/flows/flowList").then((response) => {
      console.log("res", response);
      this.setState({ flowList: response.data });
      this.refreshFlow();
    });
  };

  showMenu = (event) => {
    this.menu.toggle(event);
  };

  endLine = () => {
    //console.log("in end line canvas");
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
          //console.log("patharray", pathArray);
        }
      });
      console.log("patharray", pathArray);
      this.setState({ pathList: pathArray });
    });
  };

  // endLine = (d, pathid) => {
  //   let pathlist = [...this.state.pathList];
  //   pathlist.map((pathDetail, index) => {
  //     if (pathDetail.props.id === pathid) {
  //       let path = (
  //         <path
  //           key={index}
  //           id={pathid}
  //           d={d}
  //           onClick={(e) => this.onPathClick(e.target.id)}
  //           className={this.state.pathId === pathid ? "active-path" : ""}
  //         />
  //       );
  //       console.log("after change", path);
  //       pathlist.splice(index, 1, path);
  //       //     pathlist[index].props.d = d;
  //       //     // pathlist[index] = path;
  //       console.log("pathlist after change", pathlist);
  //       this.setState({ pathList: pathlist }, () =>
  //         console.log("state", this.state.pathList)
  //       );
  //     }
  //   });
  // };

  refreshFlow = () => {
    this.props.refreshFlowList();
  };

  handleStepClick = (step) => {
    this.setState({ selectedStep: step });
    // this.props.flowList.map((flow) => {
    //   if (flow.name === this.props.flowName) {
    //     let len = flow.steps.length;
    //     if (len > 0) {
    //       console.log(flow.steps[len - 1].name + " and " + step);
    //       if (flow.steps[len - 1].name === step) {
    //         //this.setState({ deleteStep: true });
    //         this.props.ondeleteStep(true);
    //       } else {
    //         this.props.ondeleteStep(false);
    //       }
    //     }
    //   }
    // });
  };

  onCloseBar = () => {
    this.setState({ openSideBar: false });
  };
  addPath = (pathid, d, flowname) => {
    console.log("add path ", pathid, " in - ", flowname);
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
  ondeleteItem = (itemId) => {
    //this.props.rerender(this.props.flowName);
    document.getElementById(itemId).remove();
  };

  onPropertyBar = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    //console.log("in canvas render");
    //console.log("props in canvas", this.props);
    // console.log("state", this.state);
    let divList, pathList;
    divList = (
      <div>
        {this.props.flowList.map((flow) => {
          if (flow.name === this.props.flowName) {
            return flow.steps.map((step, index) => {
              // console.log("step - rendering add node", step);
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
                  rerender={(name) => this.props.rerender(name)}
                  deleteItem={this.ondeleteItem}
                  //canvasRef={this.canvasreff}
                  canvasRefresh={this.refFlowListInCanvas}
                  deleteStep={this.onDeleteStep}
                  handlePropertyBar={this.onPropertyBar}
                  isOpen={this.state.isOpen}
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

              {/* {this.props.deleteStep ? (
                <button
                  className="btn btn-sm btn-outline-secondary "
                  style={{ margin: 5 }}
                  onClick={this.onDeleteStep}
                >
                  delete {this.state.selectedStep}
                </button>
              ) : null} */}
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

            <div id="canvas1">
              {/* <div id="wrap"> */}
              <svg id="svg">{this.state.pathList} </svg>
              {/* <SvgLines
              svgId={this.props.flowName}
              pathInfo={this.props.pathInfo}
              flowName={this.props.flowName}
            /> */}
            </div>
            <div>{divList}</div>
            {/* </div> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Canvas;
