import React, { Component } from "react";

class AddNode extends Component {
  constructor(props) {
    super(props);
    this.state = {
      x: this.props.x,
      y: this.props.y,
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
  };
  closeDragElement = () => {
    document.onmouseup = null;
    document.onmousemove = null;
  };
  render() {
    return (
      <div
        key={this.props.index}
        className="itembox"
        style={{ left: this.state.x, top: this.state.y }}
        onMouseDown={this.dragMouseDown}
        ref={this.reff}
      >
        Step {this.props.no}
      </div>
    );
  }
}

export default AddNode;
