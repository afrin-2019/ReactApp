import React, { Component } from "react";
import axios from "axios";
import PropertyBar from "./PropertyBar";
let i = 0,
  j = 0;
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
    };
    this.reff = React.createRef();
  }
  componentDidMount() {
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
    axios.get("http://localhost:5001/get/flows/flowContent").then((res) => {
      this.setState({ flowContent: res.data });
      res.data.map((content) => {
        if (content.Flow === this.props.flowName) {
          if (content.Step === this.props.stepName) {
            content.Link.map((link, index) => {
              this.attachFlow(link.Condition, link.NextStep.path);
            });
          }
        }
      });
      console.log("flow content", res.data);
    });
  }

  dragMouseDown = (e) => {
    e.preventDefault();
    this.pos3 = e.clientX;
    this.pos4 = e.clientY;
    document.onmouseup = this.closeDragElement;
    document.onmousemove = this.elementDrag;
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
  };
  closeDragElement = () => {
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
      });
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
    i++;
    j++;
    if (value === "Flow") {
      this.setState({
        addDiv: [
          ...this.state.addDiv,
          <React.Fragment key={i}>
            <div className="itembox" id={"itembox" + j}>
              {condition}
            </div>
          </React.Fragment>,
        ],
      });
    } else {
      this.setState({
        addDiv: [
          ...this.state.addDiv,
          <React.Fragment key={i}>
            <div className="wrapItem">
              <div className="stepitembox" id={"stepitembox" + j}>
                {condition}
              </div>
              <div
                className="sideitembox"
                id={"sideitembox" + j}
                // onMouseDown={this.startLine}
              >
                {" "}
              </div>
            </div>
          </React.Fragment>,
        ],
      });
    }
  };

  startLine = (event) => {
    console.log("start line");
    let svg = document.getElementById("svg");
    //e.preventDefault();
    console.log(event.target.offsetTop, event.target.offsetLeft);
    let startpositionleft =
      document.getElementById(event.target.parentElement.id).offsetLeft +
      event.target.offsetLeft;
    let startpositiontop =
      document.getElementById(event.target.parentElement.id).offsetTop +
      event.target.offsetTop -
      20;
    let newsvgline = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    i = i + 1;
    newsvgline.id = "path" + i;
    let pathid = "path" + i;
    let d =
      "M" +
      startpositionleft +
      " " +
      startpositiontop +
      " L" +
      (startpositionleft + 20) +
      " " +
      startpositiontop;
    console.log(d);
    newsvgline.setAttribute("d", d);
    svg.appendChild(newsvgline);
    let targetid = document.getElementById(event.target.id);
    //  canvas.onmousemove=function() {drawline()};
    //  canvas.onmouseup=function() {endline()};
  };

  disableAttach = () => {
    this.setState({ attachFlow: false });
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
          onMouseDown={this.dragMouseDown}
          ref={this.reff}
        >
          <div
            className="dragbox"
            id={"dragbox" + i}
            onDoubleClick={this.doubleClick}
          >
            {this.props.stepName}
          </div>
          {this.state.addDiv}
        </div>
        {this.state.openSideBar ? (
          <PropertyBar
            handleClose={this.onCloseBar}
            step={this.props.stepName}
            flowList={this.props.flowList}
            selectedFlow={this.props.flowName}
            attachFlow={(condition, value) => this.attachFlow(condition, value)}
            disableAttach={() => this.disableAttach()}
          />
        ) : null}
      </React.Fragment>
    );
  }
}

export default AddNode;
