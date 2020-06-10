import React, { Component } from "react";
import { render } from "@testing-library/react";
//import "./editor.css";
let i = 1;
class Editor extends Component {
  constructor(props) {
    super(props);
    this.onlytext = this.onlytext.bind(this);
    this.marktext = this.marktext.bind(this);
    this.rectstop = this.rectstop.bind(this);
    this.showrectangle = this.showrectangle.bind(this);
    this.state = {
      pastetext: "",
      rectangles: [],
      drawRect: false,
    };
  }

  componentDidMount() {
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
  }
  onlytext(e) {
    // alert("Hi");
    var clearText = e.clipboardData.getData("text/plain");
    alert(clearText);
    //this.setState({pastetext:clearText})
    //window.document.execCommand('insertHTML',false,clearText);
    window.document
      .getElementById("realedit")
      .execCommand("insertHTML", false, clearText);
    //event.clipboardData.getData('text/plain');
  }
  marktext = (e) => {
    //window.document.getElementById("realedit").setAttribute("readonly", true);
    this.canvas = document.getElementById("realeditw");
    this.mouse = {
      x: 0,
      y: 0,
      startX: 0,
      startY: 0,
    };
    this.canvas.style.cursor = "crosshair";
    document
      .getElementById("realeditw")
      .addEventListener("mousedown", this.showrectangle);
  };

  showrectangle(e) {
    console.log("start");
    e.preventDefault();
    // if (this.element !== null) {
    //   this.element = null;
    //   this.canvas.style.cursor = "default";
    //   console.log("finsihed.");
    // } else {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    this.element = null;
    console.log("begun.");
    this.mouse.startX = this.mouse.x;
    this.mouse.startY = this.mouse.y;
    this.element = document.createElement("div");
    this.element.className = "rectangle";
    this.element.id = "rect" + i;
    this.element.style.zIndex = 20;
    this.element.style.left = this.mouse.x + "px";
    this.element.style.top = this.mouse.y + "px";
    this.canvas.appendChild(this.element);
    console.log("xy", this.mouse.x + "," + this.mouse.y);
    console.log(this.element);
    this.canvas.onmousemove = this.drawRect;
    this.canvas.onmouseup = this.rectstop;
    i++;

    //  }

    // document
    //   .getElementById("realedit")
    //   .addEventListener("mousemove", this.drawRect);
    // document
    //   .getElementById("realedit")
    //   .addEventListener("mouseup", this.rectstop);
  }

  drawRect = (e) => {
    e.preventDefault();
    console.log("in draw rect", this.mouse.x);
    console.log("in draw rect", this.mouse.startX);
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    if (this.element !== null) {
      this.element.style.width = this.mouse.x - this.mouse.startX + "px";
      this.element.style.height = this.mouse.y - this.mouse.startY + "px";
      this.element.style.left =
        this.mouse.x - this.mouse.startX < 0
          ? this.mouse.x + "px"
          : this.mouse.startX + "px";
      this.element.style.top =
        this.mouse.y - this.mouse.startY < 0
          ? this.mouse.y + "px"
          : this.mouse.startY + "px";
      console.log("width", this.element.style.width);
    }
  };
  rectstop() {
    this.canvas.onmouseup = null;
    this.canvas.onmousemove = null;
  }
  render() {
    return (
      <div className="editor" style={{ position: "fixed", left: 50, top: 10 }}>
        <div className="header">
          <button onClick={this.marktext}>Mark</button>
        </div>
        <div className="realeditw" id="realeditw">
          <textarea className="realedit" id="realedit"></textarea>
        </div>
        <div className="footer"></div>
        <div id="result"></div>
      </div>
    );
  }
}

export default Editor;
