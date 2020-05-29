import React, { Component } from "react";
//var pos1, pos2, pos3, pos4;
class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      x: 20,
      y: 60,
    };
    this.reff = React.createRef();
  }

  componentDidMount() {
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
  }

  addNode = () => {
    this.setState({ count: this.state.count + 1 });
  };

  dragMouseDown = (e) => {
    e.preventDefault();
    console.log("x:", e.clientX);
    console.log("pos", this.pos3);
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
    console.log("offsetTop", this.reff.current.offsetTop);
    this.setState({
      y: this.reff.current.offsetTop - this.pos2 + "px",
      x: this.reff.current.offsetLeft - this.pos1 + "px",
    });
  };

  closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  };

  render() {
    var divList = [],
      no = 1;
    {
      Array.from({ length: this.state.count }, (_, index) =>
        divList.push(
          <div
            key={index}
            className="itembox"
            style={{ left: this.state.x, top: this.state.y }}
            onMouseDown={this.dragMouseDown}
            ref={this.reff}
          >
            Step {no++}
          </div>
        )
      );
    }
    return (
      <div style={{ marginLeft: 200 }}>
        <div id="canvas">
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
          <div>{divList}</div>
        </div>
      </div>
    );
  }
}

export default Canvas;
