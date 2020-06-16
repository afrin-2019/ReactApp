import React, { Component } from "react";

class SvgLines extends Component {
  state = {};
  render() {
    console.log("in svg lines");
    let pathname, pathList;
    pathList = this.props.pathInfo.map((path, index) => {
      console.log("pathlist flow name", this.props.flowName);
      if (path.flowname === this.props.flowName) {
        pathname = path.pathname.split("-");
        return <path key={index} id={pathname[0]} d={path.path} />;
      }
    });
    return <svg id="svg">{pathList}</svg>;
  }
}

export default SvgLines;
