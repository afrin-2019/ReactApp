import React, { Component } from "react";
import AddNode from "./AddNode";
//var pos1, pos2, pos3, pos4;
var divList = [];
class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      x: 20,
      y: 60,
    };
  }

  addNode = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    var divList = [],
      no = 1;
    {
      Array.from({ length: this.state.count }, (_, index) =>
        divList.push(
          <AddNode
            key={index}
            index={index}
            x={this.state.x}
            y={this.state.y}
            no={no++}
          />
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