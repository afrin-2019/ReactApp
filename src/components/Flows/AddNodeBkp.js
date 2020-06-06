import React, { Component } from "react";
import axios from "axios";
import PropertyBar from "./PropertyBar";
let i = 0;
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
    let x = this.state.x.toString();
    let y = this.state.y.toString();
    x = x.slice(0, -2);
    y = y.slice(0, -2);
    y = parseInt(y) + 30;
    y = y.toString();
    this.setState({ newDivAxis: [x, y] });
    x = parseInt(x) + 100;
    x = x.toString();
    y = parseInt(y) + 10;
    y = y.toString();
    this.setState({ sideDivAxis: [x, y] });
    console.log("x and y", x + "," + y);
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
    console.log("in attach flow");
    //this.setState({ attachFlow: true });
    i++;

    this.setState({
      addDiv: [
        ...this.state.addDiv,
        <div key={i}>
          <div
            className="itembox2"
            style={{
              left: this.state.newDivAxis[0] + "px",
              top: this.state.newDivAxis[1] + "px",
            }}
          >
            {condition}
          </div>
          {value === "Step" ? (
            <div
              className="itembox1"
              style={{
                left: this.state.sideDivAxis[0] + "px",
                top: this.state.sideDivAxis[1] + "px",
              }}
            ></div>
          ) : null}
        </div>,
      ],
    });
    let y = parseInt(this.state.newDivAxis[1]) + 32;
    y = y.toString();
    this.setState({
      newDivAxis: [this.state.newDivAxis[0], y],
    });
    y = parseInt(this.state.sideDivAxis[1]) + 32;
    y = y.toString();
    this.setState({ sideDivAxis: [this.state.sideDivAxis[0], y] });
  };

  disableAttach = () => {
    this.setState({ attachFlow: false });
  };

  // startLine = () => {
  //   console.log(
  //     "draw line",
  //     this.reff.current.offsetLeft + "," + this.reff.current.offsetTop
  //   );
  //   this.setState(
  //     {
  //       d1:
  //         "M " +
  //         this.reff.current.offsetLeft +
  //         " " +
  //         this.reff.current.offsetTop +
  //         " L " +
  //         this.reff.current.offsetLeft +
  //         1 +
  //         " " +
  //         this.reff.current.offsetTop,
  //     },
  //     () => console.log("d1", this.state.d1)
  //   );
  //   // document.onmousemove = this.closeDragElement1;
  // };

  // closeDragElement1 = () => {
  //   console.log("draw line");
  //   this.setState(
  //     {
  //       d2:
  //         "L " +
  //         this.reff.current.offsetLeft +
  //         " " +
  //         this.reff.current.offsetTop,
  //     },
  //     () => console.log("d2", this.state.d2)
  //   );
  // };

  render() {
    console.log("x - ", this.state.x, " y - ", this.state.y);
    return (
      <React.Fragment>
        <div
          key={this.props.index}
          onClick={this.onStepClicked}
          className="outer_div"
          //style={{ left: this.state.x, top: this.state.y }}
          //onMouseDown={this.dragMouseDown}
          //ref={this.reff}
        >
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
            //onMouseDown={this.startLine}
            //onMouseMove={this.props.drawLine}
          ></div>
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
