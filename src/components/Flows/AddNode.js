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
    };
    this.reff = React.createRef();
  }
  componentDidMount() {
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
    //this.newPathId = 10;
    axios.get("http://localhost:5001/get/flows/flowContent").then((res) => {
      this.setState({ flowContent: res.data });
      res.data.map((content) => {
        if (content.Flow === this.props.flowName) {
          if (content.Step === this.props.stepName) {
            content.Link.map((link, index) => {
              this.attachFlow(link.Condition, link.NextStep.path);
              console.log("flowlist in attach flow", this.props.flowList);
              this.props.flowList.map((flow) => {
                if (flow.name === this.props.flowName) {
                  console.log("flow", flow.steps);
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
        console.log("newpathId", newPathId);
      }
    });
  }

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

    for (let it = 0; it < a.length; it++) {
      console.log(a[it].innerHTML);
      let newId = a[it].innerHTML.split("-");
      console.log("newId", newId);
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
      //console.log("new d", d);
      b.setAttribute("d", d);
      let req = {
        flowName: this.props.flowName,
        path: d,
        pathname: a[it].innerHTML,
      };
      axios
        .put("http://localhost:5001/update/flows/pathInfo", { data: req })
        .then((res) => console.log(res));
    }
    sp = dragitem.getElementsByTagName("span");
    //console.log("sp", sp);
    for (let it = 0; it < sp.length; it++) {
      console.log(sp[it].innerHTML);
      let newId = sp[it].innerHTML.split("-");
      console.log("newId span", newId);
      b = document.getElementById(newId[0]);
      console.log("b", b);
      sp1 = b.getAttribute("d").split(" ");

      //idofitembox1 = dragitem.id.substring(7, 9);
      //console.log(idofitembox1);
      // console.log(
      //   "parent id",
      //   document.getElementById(e.target.parentElement.id)
      // );
      //console.log("targetid", targetid.offsetTop);
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
      axios
        .put("http://localhost:5001/update/flows/pathInfo", { data: req })
        .then((res) => {
          console.log(res);
          //b.setAttribute("d", d);
        });
    }
  };
  closeDragElement = (e) => {
    console.log("mouse up ", this.state.lineStart);
    let request = {
      flowName: this.props.flowName,
      step: this.props.stepName,
      oldAxis: this.state.oldAxis,
      newAxis: [this.state.x, this.state.y],
      newAxis1: [this.state.x1, this.state.y1],
    };
    axios
      .put("http://localhost:5001/update/flows/steps/axis", { data: request })
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

    document.onmouseup = null;
    document.onmousemove = null;
  };

  doubleClick = () => {
    console.log("double click");
    //this.props.handleNodeClick(this.props.stepName);

    this.setState({ openSideBar: true });
  };

  onStepClicked = () => {
    this.props.stepClicked(this.props.stepName);
  };

  onCloseBar = () => {
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
                      <span key={index} hidden>
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
    console.log("pathid when line starts", newPathId);
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
    parentTarget = document.getElementById("item" + this.props.index);
    newPathId += 1;
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
      this.hiddenel = document.createElement("p");
      this.hiddenel.hidden = "true";
      this.hiddenel.innerHTML = pathname;
      this.endid.appendChild(this.hiddenel);
      this.hiddenspan = document.createElement("span");
      this.hiddenspan.hidden = "true";
      this.hiddenspan.innerHTML = pathname;
      console.log("exact", targetid.parentElement.parentElement);
      console.log(parentTarget.children);
      targetid.parentElement.appendChild(this.hiddenspan);
      let req = {
        flowName: this.props.flowName,
        pathid: lined.id,
        path: d,
        pathname: pathname,
        endStep: this.props.stepName,
      };
      axios
        .post("http://localhost:5001/insert/flows/pathInfo", { data: req })
        .then((res) => {
          console.log(res);
          this.props.endLine();
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

  deleteFlow = (req) => {
    console.log("req del", req);
    console.log("div", this.state.addDiv);
    this.state.addDiv.map((div, index) => {
      console.log("child", div.props.children);
      let child = div.props.children;
      console.log(child.props.children[0].props.children);
      if (req.condition === child.props.children[0].props.children) {
        let divArray = [...this.state.addDiv];
        divArray.splice(index, 1);
        this.setState({ addDiv: divArray });
      }
    });
  };

  render() {
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
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default AddNode;
