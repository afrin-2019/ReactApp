import React, { Component } from "react";
import axios from "axios";
import PropertyBar from "./PropertyBar";
// let i = 0,
//   j = 0;
let pathid,
  targetid,
  startpositionleft,
  startpositiontop,
  d,
  canvas,
  lined,
  canvas1,
  dragitem,
  a,
  sp,
  b,
  sp1,
  drawline,
  parentTarget,
  startStep,
  condition,
  newPathId = 10;

class AddNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: this.props.x,
      y: this.props.y,
      x1: this.props.x1,
      y1: this.props.y1,
      oldAxis: [this.props.x, this.props.y],
      d1: "M 287 122 L 417 122",
      openSideBar: false,
      attachFlow: false,
      addDiv: [],
      flowContent: [],
      lineStart: false,
      i: 0,
      j: 0,
      isPath: false,
      reqObj: [],
      reqObj1: [],
    };
    this.reff = React.createRef();
  }
  componentDidMount() {
    //console.log("in add node mount");
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
    this.refreshAddNode();
  }
  refreshAddNode = () => {
    //console.log("in refresh add node", this.props.stepName);
    axios.get("http://localhost:5001/get/flows/flowContent").then((res) => {
      this.setState({ flowContent: res.data });
      res.data.map((content) => {
        if (content.Flow === this.props.flowName) {
          if (content.Step === this.props.stepName) {
            content.Link.map((link, index) => {
              this.attachFlow(link.Condition, link.NextStep.path);
              //console.log("flowlist in attach flow", this.props.flowList);
              this.props.flowList.map((flow) => {
                if (flow.name === this.props.flowName) {
                  //console.log("flow", flow.steps);
                }
              });
            });
          }
        }
      });
      //console.log("flow content", res.data);
      {
        this.props.pathInfo.map((path, index) => {
          if (path.flowname === this.props.flowName) {
            if (path.endstep === this.props.stepName) {
              // let p = (
              //   <p key={index} hidden>
              //     {path.pathname}
              //   </p>
              // );
              let p = document.createElement("p");
              p.hidden = "true";
              p.innerHTML = path.pathname;
              p.key = index;
              p.id = "P-" + path.pathid;
              let doc = document.getElementById("item" + this.props.index);
              doc.appendChild(p);
            }
          }
        });
      }
    });
    axios.get("http://localhost:5001/get/flows/pathinfo").then((res) => {
      if (res.data.length !== 0) {
        newPathId = res.data[res.data.length - 1].pathname.split("-");
        newPathId = newPathId[0].slice(-2);

        newPathId = parseInt(newPathId) + 1;
        //console.log("newpathId", newPathId);
      }
    });
  };

  dragMouseDown = (e) => {
    e.preventDefault();
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;

    document.onmousemove = this.elementDrag;
    dragitem = document.getElementById(e.target.parentElement.id);
    //console.log("drag item", dragitem);
    // document.onmouseup = this.state.lineStart
    //   ? this.endLine
    //   : this.closeDragElement;
  };

  elementDrag = (e) => {
    e.preventDefault();
    this.pos1 = this.pos3 - e.clientX;
    this.pos2 = this.pos4 - e.clientY;
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;
    this.setState({
      y: this.reff.current.offsetTop - this.pos2 + "px",
      x: this.reff.current.offsetLeft - this.pos1 + "px",
    });
    this.setState({
      y1: this.reff.current.offsetTop - this.pos2 + 10 + "px",
      x1: this.reff.current.offsetLeft - this.pos1 + 99 + "px",
    });
    a = dragitem.getElementsByTagName("p");

    //console.log("a", a);
    let reqArray = [];
    for (let it = 0; it < a.length; it++) {
      //console.log(a[it].innerHTML);
      let newId = a[it].innerHTML.split("-");
      // console.log("newId", newId);
      b = document.getElementById(newId[0]);
      sp = b.getAttribute("d").split(" ");
      //console.log("sp", sp);
      d =
        sp[0] +
        " " +
        sp[1] +
        " L" +
        dragitem.offsetLeft +
        " " +
        (dragitem.offsetTop - 10);
      //console.log("p change", d);
      b.setAttribute("d", d);
      let req = {
        flowName: this.props.flowName,
        path: d,
        pathname: a[it].innerHTML,
      };
      reqArray.push(req);
      this.setState({ isPath: true });
      this.setState({ reqObj: reqArray });
      // axios
      //   .put("http://localhost:5001/update/flows/pathInfo", { data: req })
      //   .then((res) => console.log(res));
    }
    sp = dragitem.getElementsByTagName("span");
    //console.log("sp", sp);
    let reqArray1 = [];
    for (let it = 0; it < sp.length; it++) {
      //console.log(sp[it].innerHTML);
      let newId = sp[it].innerHTML.split("-");
      //console.log("newId span", newId);
      b = document.getElementById(newId[0]);
      //console.log("b", b);
      sp1 = b.getAttribute("d").split(" ");
      startpositionleft =
        document.getElementById(e.target.parentElement.id).offsetLeft + 100;
      startpositiontop =
        document.getElementById(e.target.parentElement.id).offsetTop +
        document.getElementById(newId[1]).offsetTop -
        50;
      //d= sp[0]+" "+sp[1]+" L"+(dragitem.offsetLeft+50)+" "+(dragitem.offsetTop);
      d =
        "M" +
        startpositionleft +
        " " +
        startpositiontop +
        " " +
        sp1[2] +
        " " +
        sp1[3];

      b.setAttribute("d", d);
      let req = {
        flowName: this.props.flowName,
        path: d,
        pathname: sp[it].innerHTML,
      };
      this.setState({ isPath: true });
      reqArray1.push(req);
      this.setState({ reqObj1: reqArray1 });
      // axios
      //   .put("http://localhost:5001/update/flows/pathInfo", { data: req })
      //   .then((res) => {
      //     console.log(res);
      //     //b.setAttribute("d", d);
      //   });
    }
  };
  closeDragElement = (e) => {
    console.log("mouse up ", this.state.lineStart);
    if (this.state.isPath) {
      console.log("reqobj", this.state.reqObj);
      if (this.state.reqObj.length !== 0) {
        this.state.reqObj.map((reqObj) => {
          axios
            .put("http://localhost:5001/update/flows/pathInfo", {
              data: reqObj,
            })
            .then((res) => {
              console.log("update only once", res);
              this.setState({ isPath: false });
            });
        });
      }
      if (this.state.reqObj1.length !== 0) {
        this.state.reqObj1.map((reqObj) => {
          axios
            .put("http://localhost:5001/update/flows/pathInfo", {
              data: reqObj,
            })
            .then((res) => {
              console.log("update only once", res);
              this.setState({ isPath: false });
            });
        });
      }
    }
    let request = {
      flowName: this.props.flowName,
      step: this.props.stepName,
      oldAxis: this.state.oldAxis,
      newAxis: [this.state.x, this.state.y],
      newAxis1: [this.state.x1, this.state.y1],
    };
    axios
      .put("http://localhost:5001/update/flows/steps/axis", {
        data: request,
      })
      .then((response) => {
        console.log(response);
        this.props.refresh();
        //this.props.refreshPath();
      });
    console.log("line start", drawline);
    if (drawline === true) {
      this.endLine(e);
    }
    this.props.refreshPath();
    this.props.canvasRefresh();

    document.onmouseup = null;
    document.onmousemove = null;
  };

  doubleClick = () => {
    console.log("double click");
    //this.props.handleNodeClick(this.props.stepName);
    console.log(this.props.isOpen);
    this.props.handlePropertyBar();
    this.setState({ openSideBar: true });
  };

  onStepClicked = () => {
    this.props.stepClicked(this.props.stepName);
  };

  onCloseBar = () => {
    this.props.handlePropertyBar();
    this.setState({ openSideBar: false });
  };

  attachFlow = (condition, value) => {
    // i++;
    // j++;
    this.setState({ i: this.state.i + 1 });
    this.setState({ j: this.state.j + 1 });
    let pathid, spanId;
    if (value === "Flow") {
      this.setState({
        addDiv: [
          ...this.state.addDiv,
          // <React.Fragment key={i}>
          <div
            className="itembox"
            id={"itembox" + this.state.j}
            key={this.state.i}
            style={{ userSelect: "none" }}
            //onMouseUp={this.endLine}
          >
            {condition}
          </div>,
          // </React.Fragment>,
        ],
      });
    } else {
      this.setState({
        addDiv: [
          ...this.state.addDiv,
          <React.Fragment key={this.state.i}>
            <div className="wrapItem" id={"wrapitem" + this.state.i}>
              <div
                className="stepitembox"
                id={"stepitembox" + this.state.j}
                //onMouseUp={this.endLine}
                style={{ userSelect: "none" }}
              >
                {condition}
              </div>

              <div
                className="sideitembox"
                id={"item" + this.props.index + "sideitembox" + this.state.j}
                onMouseDown={this.startLine}
              ></div>
              {this.props.pathInfo.map((path, index) => {
                if (path.flowname === this.props.flowName) {
                  pathid = path.pathname.split("-");
                  spanId =
                    "item" + this.props.index + "sideitembox" + this.state.j;

                  if (pathid[1] === spanId) {
                    return (
                      <span key={index} hidden id={"Span-" + pathid[0]}>
                        {path.pathname}
                      </span>
                    );
                  }
                }
              })}
            </div>
          </React.Fragment>,
        ],
      });
    }
  };

  onflowClick = () => {
    this.endLine();
  };

  disableAttach = () => {
    this.setState({ attachFlow: false });
  };

  startLine = (event) => {
    // let newPathId;
    // axios.get("http://localhost:5001/get/flows/pathinfo").then(res =>{
    //   newPathId = res.data[
    //   res.data.length - 1
    // ].pathname.split("-");
    // newPathId = newPathId[0].slice(-2);
    // console.log("newpathid", newPathId);
    // newPathId=parseInt(newPathId)
    this.setState({ lineStart: true });
    drawline = true;
    //let svg = document.getElementById("svg");
    startpositionleft = this.reff.current.offsetLeft + event.target.offsetLeft;
    startpositiontop =
      this.reff.current.offsetTop + event.target.offsetTop - 50;
    // let newsvgline = document.createElementNS(
    //   "http://www.w3.org/2000/svg",
    //   "path"
    // );
    //i = i + 1;
    //newsvgline.id = "path" + newPathId;
    pathid = "path" + newPathId;
    d =
      "M" +
      startpositionleft +
      " " +
      startpositiontop +
      " L" +
      (startpositionleft + 20) +
      " " +
      startpositiontop;
    this.props.addPath(pathid, d, this.props.flowName);
    //newsvgline.setAttribute("d", d);
    //svg.appendChild(newsvgline);
    canvas = document.getElementById("canvas1");
    //console.log(canvas);
    //canvas.appendChild(svg);
    console.log("event", event.target.id);
    targetid = document.getElementById(event.target.id);
    condition = targetid.parentElement.childNodes[0].innerHTML;
    parentTarget = document.getElementById("item" + this.props.index);
    newPathId += 1;
    startStep = this.props.stepName;
    canvas.onmousemove = this.drawLine;
    canvas.onmouseup = this.endLine;
    // })
  };

  drawLine = (event) => {
    lined = document.getElementById(pathid);
    event.preventDefault();
    canvas1 = document.getElementById("canvas");

    this.posx1 = event.clientX - canvas1.offsetLeft;
    this.posy1 = event.clientY - canvas1.offsetTop - 50;

    d =
      "M" +
      startpositionleft +
      " " +
      startpositiontop +
      " L" +
      this.posx1 +
      " " +
      this.posy1;
    //this.props.drawLine(pathid, d);
    lined.setAttribute("d", d);
    //canvas.onmouseup = this.endLine;
  };

  endLine = (event) => {
    event.preventDefault();

    if (
      document
        .elementFromPoint(event.clientX, event.clientY)
        .id.indexOf("dragbox") !== -1
    ) {
      this.endid = document.getElementById(
        document.elementFromPoint(event.clientX, event.clientY).parentElement.id
      );
      console.log("endid", this.endid);

      d =
        "M" +
        startpositionleft +
        " " +
        startpositiontop +
        " L" +
        this.endid.offsetLeft +
        " " +
        (this.endid.offsetTop - 20);
      let pathname = lined.id + "-" + targetid.id;
      console.log("end d - ", d);
      lined.setAttribute("d", d);
      //this.props.endLine(d, lined.id);
      this.hiddenel = document.createElement("p");
      this.hiddenel.hidden = "true";
      this.hiddenel.id = "P-" + lined.id;
      this.hiddenel.innerHTML = pathname;
      this.endid.appendChild(this.hiddenel);
      this.hiddenspan = document.createElement("span");
      this.hiddenspan.hidden = "true";
      this.hiddenspan.innerHTML = pathname;
      this.hiddenspan.id = "Span-" + lined.id;
      console.log("exact", targetid.parentElement.parentElement);
      console.log(parentTarget.children);
      targetid.parentElement.appendChild(this.hiddenspan);
      console.log(
        "start step is",
        startStep + " end step is" + this.props.stepName
      );
      let req = {
        flowName: this.props.flowName,
        pathid: lined.id,
        path: d,
        pathname: pathname,
        startStep: startStep,
        endStep: this.props.stepName,
        condition: condition,
      };
      axios
        .post("http://localhost:5001/insert/flows/pathInfo", { data: req })
        .then((res) => {
          console.log(res);
          axios
            .put("http://localhost:5001/update/flow/link", {
              flowName: this.props.flowName,
              stepno: startStep,
              condition: condition,
              nextstep: this.props.stepName,
            })
            .then((res) => {
              console.log(res);
              this.props.endLine();
            });

          //this.props.refreshPath();
        });
    } else {
      //lined.remove();
      //this.setState({ lineStart: false });
      drawline = false;
      this.props.removePath();
    }

    drawline = false;
    canvas.onmouseup = null;
    canvas.onmousemove = null;
  };

  editFlow = (condition, oldcondition) => {
    console.log("div", this.state.addDiv);
    let editDiv = [...this.state.addDiv];
    //let editDiv = Object.assign([], this.state.addDiv);
    console.log("edited condition", condition, oldcondition);
    editDiv.map((div, index) => {
      let child = div.props.children;
      if (child.type === "div") {
        console.log("condition = ", child.props.children[0].props.children);
        if (child.props.children[0].props.children === oldcondition) {
          console.log("div", div);
          editDiv.splice(
            index,
            1,
            <React.Fragment key={div.key}>
              <div className="wrapItem" id={child.props.id}>
                <div
                  className="stepitembox"
                  id={child.props.children[0].props.id}
                  //onMouseUp={this.endLine}
                  style={{ userSelect: "none" }}
                >
                  {condition}
                </div>

                <div
                  className="sideitembox"
                  id={child.props.children[1].props.id}
                  onMouseDown={this.startLine}
                ></div>
                {this.props.pathInfo.map((path, index) => {
                  if (path.flowname === this.props.flowName) {
                    let pathid = path.pathname.split("-");
                    let spanId = child.props.children[1].props.id;

                    if (pathid[1] === spanId) {
                      return (
                        <span key={index} hidden id={"Span-" + pathid[0]}>
                          {path.pathname}
                        </span>
                      );
                    }
                  }
                })}
              </div>
            </React.Fragment>
          );
          this.setState({ addDiv: editDiv });
        }
      } else {
        console.log("condition = ", child);
        if (child === oldcondition) {
          editDiv.splice(
            index,
            1,
            <div
              className="itembox"
              id={div.props.id}
              key={div.key}
              style={{ userSelect: "none" }}
              //onMouseUp={this.endLine}
            >
              {condition}
            </div>
          );
          this.setState({ addDiv: editDiv });
          console.log(this.state.addDiv);
        }
      }
    });
  };

  deleteFlow = (req) => {
    console.log("req del", req);
    console.log("div", this.state.addDiv);
    let isDel = false;
    this.state.addDiv.map((div, index) => {
      // if (!isDel) {
      let child = div.props.children;
      console.log("child", child);
      if (child.type === "div") {
        //    if (!req.step) {
        console.log("child", div.props.children);
        console.log(child.props.children[0].props.children);

        if (req.condition === child.props.children[0].props.children) {
          console.log("if condition satisfied");
          console.log(child.props.children[0].props.children);
          let sideItemId = child.props.children[1].props.id;
          console.log("path to be deleted from ", sideItemId);
          this.props.pathInfo.map((path) => {
            let sideid = path.pathname.split("-");
            if (sideItemId === sideid[1]) {
              console.log("path id", sideid[0]);
              let req1 = {
                flowName: this.props.flowName,
                pathid: sideid[0],
              };
              console.log("request when complete delete", req1);
              isDel = true;
              axios
                .delete("http://localhost:5001/delete/flows/path", {
                  data: req1,
                })
                .then((res) => {
                  console.log(res);
                  this.props.rerender(this.props.flowName);

                  let ptag = document.getElementById("P-" + sideid[0]);
                  if (ptag !== null) {
                    ptag.remove();
                  }
                  let spantag = document.getElementById("Span-" + sideid[0]);
                  if (spantag !== null) {
                    spantag.remove();
                  }
                });
            }
          });

          // if (req.condition === child.props.children[0].props.children) {
          let divArray = [...this.state.addDiv];
          divArray.splice(index, 1);
          this.setState({ addDiv: divArray });
        }
        //   }
      } else {
        if (req.condition === child) {
          let divArray = [...this.state.addDiv];
          divArray.splice(index, 1);
          this.setState({ addDiv: divArray });
        }
      }
      //}
    });
  };

  onDeleteStep = () => {
    //document.getElementById("item" + this.props.index).remove();
    let step = this.props.stepName;
    console.log("in delete step");
    console.log("this.props.stepName", this.props.stepName);
    axios
      .put("http://localhost:5001/delete/flows/steps", {
        flowName: this.props.flowName,
        step: this.props.stepName,
      })
      .then((res) => {
        this.props.canvasRefresh();
        let request = {
          flowName: this.props.flowName,
          step: this.props.stepName,
        };
        axios
          .delete("http://localhost:5001/delete/flows/path/stepDelete", {
            data: request,
          })
          .then((res) => {
            console.log("after path delete", res);
            this.props.rerender(this.props.flowName);
            axios
              .get("http://localhost:5001/get/flows/flowContent")
              .then((res) => {
                console.log("flowcontent", res.data);
                res.data.map((flow) => {
                  //console.log("flowcontent", this.state.flowContent);
                  //this.state.flowContent.map((flow) => {
                  console.log("flow", flow);
                  console.log(this.props.flowName + "-" + step);
                  console.log("this.props.stepName", this.props.stepName);
                  if (flow.Flow === this.props.flowName) {
                    console.log("true");
                    if (flow.Step === step) {
                      console.log("true");
                      axios
                        .delete("http://localhost:5001/delete/flowcontent", {
                          data: request,
                        })
                        .then((res) => {
                          console.log(res);

                          //this.props.rerender(this.props.flowName);
                          this.setState({ addDiv: [] });
                          this.props.canvasRefresh();
                          //this.props.refresh();
                          //this.refreshAddNode();
                          //this.props.refreshPath();
                        });
                    }
                  }
                });
              });
          });
        // this.props.deleteItem("item" + this.props.index);
      });
  };

  render() {
    //console.log("props in add node", this.props);
    //console.log("state of add node", this.state);
    let i = this.props.index;
    return (
      <React.Fragment>
        <div
          key={this.props.index}
          onClick={this.onStepClicked}
          className="item"
          id={"item" + i}
          style={{ left: this.state.x, top: this.state.y }}
          //onMouseDown={this.dragMouseDown}
          //onMouseUp={this.closeDragElement}
          ref={this.reff}
        >
          <div
            className="dragbox"
            id={"dragbox" + i}
            onDoubleClick={this.doubleClick}
            onMouseDown={this.dragMouseDown}
            onMouseUp={this.closeDragElement}
            style={{ userSelect: "none" }}
          >
            {this.props.stepName}
          </div>
          {this.state.addDiv}
          {/* {this.props.pathInfo.map((path, index) => {
            if (path.flowname === this.props.flowName) {
              if (path.endstep === this.props.stepName) {
                return (
                  <p key={index} hidden>
                    {path.pathname}
                  </p>
                );
              }
            }
          })} */}
          {/* <button
            style={{
              // position: "absolute",
              // top: 0,
              // right: 0,
              margin: 2,
              fontSize: 10,
              backgroundColor: "transparent",
              border: "none",
            }}
            onClick={this.onDeleteStep}
          >
            <i className="fa fa-trash" />
          </button> */}
        </div>

        {this.state.openSideBar ? (
          <PropertyBar
            handleClose={this.onCloseBar}
            step={this.props.stepName}
            flowList={this.props.flowList}
            selectedFlow={this.props.flowName}
            attachFlow={(condition, value) => this.attachFlow(condition, value)}
            disableAttach={() => this.disableAttach()}
            refresh={this.props.refresh}
            deleteFlow={(req) => this.deleteFlow(req)}
            editFlow={this.editFlow}
            rerender={(flowName) => this.props.rerender(flowName)}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default AddNode;
