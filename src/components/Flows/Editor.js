import React, { Component } from "react";
import { render } from "@testing-library/react";
//import "./editor.css";
import $ from "jquery";
let interval;
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
      divVal: "",
      selectedText: "",
      highlightedText: [],
      editable: true,
      newSelect: [],
      format: false,
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
    this.mouse.x = e.clientX - 50;
    this.mouse.y = e.clientY - 40;
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
    this.mouse.x = e.clientX - 50;
    this.mouse.y = e.clientY - 40;
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
    this.canvas.onmouseup = this.highlightText;
    this.canvas.onmousemove = null;
  }

  onDivChange = (e) => {
    this.setState(
      {
        divVal: e.target.value,
      },
      () => console.log("value", this.state.divVal)
    );
  };
  onMark = () => {
    this.setState((prevState) => ({ editable: !prevState.editable }));
  };

  highlightText = (e) => {
    var range;
    var selValue = window.getSelection().toString();
    var sel = window.getSelection();
    console.log("sel", sel.toString());
    if (sel.toString() !== "") {
      range = sel.getRangeAt(0);
      range.deleteContents();
      // Create the marker element containing a single invisible character using DOM methods and insert it
      var markerEl = document.createElement("mark");
      markerEl.id = "markerid" + i;
      markerEl.style.backgroundColor = "yellow";
      markerEl.style.color = "black";
      markerEl.appendChild(document.createTextNode(selValue));
      range.insertNode(markerEl);
      i++;
    }
  };

  onPaste = (e) => {
    //e.preventDefault();
    var el = this.refs.myDiv;
    console.log("el", el);
    this.setState({ format: true });
    interval = setInterval(() => {
      this.format();
    }, 1000);

    // e.clipboardData.items[0].getAsString((text) => {
    //   console.log("text", text);
    //   text.split("\n").map((line) => console.log("line", line));
    // });
    //var text = e.clipboardData.getData("text/html");
    // console.log("text", text);
    //document.execCommand("insertText", false, text);
  };

  format = () => {
    var el = this.refs.myDiv;
    console.log("el", el.children.length);
    let newContent = [];
    for (let i in el.children) {
      if (el.children[i].tagName === "P") {
        console.log("child", el.children[i].children[0]);
        newContent = [...newContent, el.children[i].children[0]];
      }
    }
    el.innerHTML = "";
    let appContent = "";
    newContent.map((content) => {
      console.log(content);
      appContent = document.createElement("div");
      appContent.append(content);
      console.log("appContent", appContent);
      el.append(appContent);
    });

    console.log("newcontent", newContent);
    clearInterval(interval);
  };

  render() {
    return (
      <div
        className="editor"
        style={{ position: "fixed", left: 50, top: 10 }}
        ref="mainDiv"
      >
        <div className="header">
          <button
            //onClick={this.highlightText}
            onClick={this.onMark}
          >
            Mark
          </button>
          {this.state.format ? (
            <button onClick={this.format}>Format</button>
          ) : null}
          {/* <button onClick={this.marktext}>select</button> */}
        </div>
        <div className="realeditw" id="realeditw">
          <div
            className="realedit"
            id="realedit"
            ref="myDiv"
            contentEditable={this.state.editable}
            onMouseUp={
              !this.state.editable ? (e) => this.highlightText(e) : null
            }
            onPaste={(e) => this.onPaste(e)}
          ></div>
        </div>
        <div className="sideedit"></div>
        <div className="footer"></div>
      </div>
    );
  }
}

export default Editor;
