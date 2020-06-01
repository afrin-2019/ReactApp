import React, { Component } from "react";
import axios from "axios";
import PropertyBar from "./PropertyBar";
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
    };
    this.reff = React.createRef();
  }
  componentDidMount() {
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
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
    this.setState(
      {
        y1: this.reff.current.offsetTop - this.pos2 + 10 + "px",
        x1: this.reff.current.offsetLeft - this.pos1 + 99 + "px",
      },
      () => console.log(this.state.x1, this.state.y1)
    );
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
    this.props.handleNodeClick(this.props.stepName);
  };

  startLine = () => {
    console.log(
      "draw line",
      this.reff.current.offsetLeft + "," + this.reff.current.offsetTop
    );
    this.setState(
      {
        d1:
          "M " +
          this.reff.current.offsetLeft +
          " " +
          this.reff.current.offsetTop +
          " L " +
          this.reff.current.offsetLeft +
          1 +
          " " +
          this.reff.current.offsetTop,
      },
      () => console.log("d1", this.state.d1)
    );
    // document.onmousemove = this.closeDragElement1;
  };

  closeDragElement1 = () => {
    console.log("draw line");
    this.setState(
      {
        d2:
          "L " +
          this.reff.current.offsetLeft +
          " " +
          this.reff.current.offsetTop,
      },
      () => console.log("d2", this.state.d2)
    );
  };

  render() {
    console.log("state", this.state);
    return (
      <div key={this.props.index}>
        <div
          className="itembox"
          style={{ left: this.state.x, top: this.state.y }}
          onMouseDown={this.dragMouseDown}
          ref={this.reff}
          onDoubleClick={this.doubleClick}
        >
          {this.props.stepName}
        </div>
        <div
          className="itembox1"
          style={{ left: this.state.x1, top: this.state.y1 }}
          onMouseDown={this.startLine}
          onMouseMove={this.props.drawLine}
        ></div>
      </div>
    );
  }
}

export default AddNode;
