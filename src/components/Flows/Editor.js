import React, { Component } from "react";
import { Menu } from "primereact/menu";
import { render } from "@testing-library/react";
//import "./editor.css";
import $ from "jquery";
import Axios from "axios";
let interval;
let i = 1;
let mousedown = false;
let value, value1;
let prevrow, prevcell;
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
      mouseDown: false,
      startRow: "",
      endRow: "",
      startCell: "",
      endCell: "",
      marked: false,
      showCondition: false,
      result: [],
      condition1: false,
      condition2: false,
      id: "",
      options: [
        {
          label: "Mark Text to look for and its value",
          command: () => {
            this.condition1();
          },
        },
        {
          separator: true,
        },
        {
          label: "Mark Block to extract",
          command: () => {
            this.condition2();
          },
        },
      ],
    };
  }

  componentDidMount() {
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
    Axios.get("http://localhost:5001/get/flows/editorContent").then((res) => {
      console.log("table", res.data);
      let len = res.data.length;
      if (len !== 0) {
        this.setState({ id: res.data[len - 1]._id });
        this.setState({ content: res.data[len - 1].content });
        var element = document.createElement(null);
        element.innerHTML = res.data[len - 1].content;
        element = element.firstChild;
        this.refs.myDiv.appendChild(element);
        document.getElementById("ta").onmousedown = this.tableMouseDown;
        this.setState({ showCondition: true });
        this.setState({ result: res.data[len - 1].result }, () =>
          this.changeMarkColor()
        );
      }
    });
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

  condition1 = () => {
    this.setState({ editable: false });
    this.setState({ condition1: true });
    this.setState({ condition2: false });
  };

  condition2 = () => {
    this.setState({ editable: false });
    this.setState({ condition2: true });
    this.setState({ condition1: false });
  };

  onPaste = (e) => {
    //e.preventDefault();
    var el = this.refs.myDiv;
    console.log("el", el);
    interval = setInterval(() => {
      this.format();
    }, 1000);
    this.setState({ showCondition: true });
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
    let table = document.createElement("table");
    //table.style.userSelect = "none";
    //table.className = "noselect";
    table.contentEditable = "false";
    table.setAttribute("readonly", true);
    table.cellSpacing = "0";
    table.cellPadding = "0";
    table.id = "ta";
    table.onmousedown = this.tableMouseDown;

    let tbody = document.createElement("tbody");
    table.append(tbody);
    el.innerHTML = "";
    let appContent = "";
    newContent.map((content) => {
      let tr = document.createElement("tr");

      let data = content.innerHTML;
      console.log("data", content.style);
      console.log("content", content);
      tr.style.cssText = content.style.cssText;
      tr.style.userSelect = "none";
      //tr.append(data);
      tbody.append(tr);
      let cntnue = true;
      if (data.length !== 0) {
        for (let i = 0; i <= data.length; i++) {
          // console.log("text", data[i]);
          if (cntnue) {
            if (data[i] === "&") {
              i++;
              if (data[i] === "n") {
                i++;
                if (data[i] === "b") {
                  i++;
                  if (data[i] === "s") {
                    i++;
                    if (data[i] === "p") {
                      i++;
                      if (data[i] === ";") {
                        let td = document.createElement("td");
                        td.innerHTML = "&nbsp;";
                        tr.append(td);
                      }
                    }
                  }
                }
              }
            } else if (data[i] === "<") {
              cntnue = false;
            } else {
              let td = document.createElement("td");
              td.append(data[i]);
              tr.append(td);
            }
          }
        }
      }
      console.log("table", table);
      //appContent.append(table);
      console.log("appContent", appContent);
      el.append(table);
    });

    console.log("newcontent", newContent);
    clearInterval(interval);
    this.setState({ content: table.outerHTML });
    let req = {
      flowName: this.props.flowName,
      stepNo: this.props.stepNo,
      content: table.outerHTML,
    };
    Axios.post("http://localhost:5001/post/editorContent", {
      data: req,
    }).then((res) => console.log(res));
  };

  tableMouseDown = (e) => {
    console.log("in mouse down");
    if (!this.state.editable) {
      let el = e.target.parentElement;
      console.log("el", el);
      let parent = el.parentElement;
      if (this.state.marked) {
        this.removeMark();
      }
      this.setState({ startRow: el.rowIndex });
      this.setState({ endRow: el.rowIndex });
      this.setState({ startCell: e.target.cellIndex });
      this.setState({ endCell: e.target.cellIndex });
      this.setState({ rowBegin: el.rowIndex });
      this.setState({ cellBegin: e.target.cellIndex });

      parent.onmousemove = this.selectedData;
      parent.onmouseup = this.mouseUp;
    }
  };

  selectedData = (e) => {
    let el = e.target;
    let parent = el.parentElement;

    console.log("prev row", prevrow);
    console.log("rowbegin", this.state.rowBegin);
    if (prevrow !== parent.rowIndex || prevcell !== el.cellIndex) {
      if (prevrow !== parent.rowIndex) {
        console.log("row not equal");
        if (this.state.rowBegin > prevrow) {
          if (prevrow < parent.rowIndex) {
            console.log("row to cut", prevrow);
            this.cutrow(prevrow);
          }
        } else if (this.state.rowBegin < prevrow) {
          if (prevrow > parent.rowIndex) {
            console.log("row to cut", prevrow);
            this.cutrow(prevrow);
          }
        }
      }
      if (prevcell !== el.cellIndex) {
        //console.log("cell not equal", cellbegin, prevcell, el.cellIndex);
        if (this.state.cellBegin > prevcell) {
          if (prevcell < el.cellIndex) {
            console.log("cell to cut", prevcell);
            this.cutcell(prevcell);
          }
        } else if (this.state.cellBegin < prevcell) {
          if (prevcell > el.cellIndex) {
            console.log("cell to cut", prevcell);
            this.cutcell(prevcell);
          }
        }
      }
      prevrow = parent.rowIndex;
      prevcell = el.cellIndex;
      if (this.state.startRow === parent.rowIndex) {
        this.setState({ endRow: this.state.startRow });
        this.checkCell(el);
      } else if (this.state.startRow < parent.rowIndex) {
        this.setState({ endRow: parent.rowIndex });
        this.checkCell(el);
      } else if (this.state.startRow > parent.rowIndex) {
        this.setState({ startRow: parent.rowIndex });
        this.checkCell(el);
      }
    }
  };

  checkCell = (el) => {
    let startcell = this.state.startCell;
    if (startcell < el.cellIndex) {
      this.setState({ endCell: el.cellIndex });
      console.log(
        this.state.startRow,
        ":",
        this.state.startCell,
        "--",
        this.state.endRow,
        ":",
        this.state.endCell
      );
    } else if (startcell > el.cellIndex) {
      this.setState({ startCell: el.cellIndex });
      console.log(
        this.state.startRow,
        ":",
        this.state.startCell,
        "--",
        this.state.endRow,
        ":",
        this.state.endCell
      );
    } else if (startcell === el.cellIndex) {
      this.setState({ startCell: el.cellIndex });
      this.setState({ endCell: el.cellIndex });
      console.log(
        this.state.startRow,
        ":",
        this.state.startCell,
        "--",
        this.state.endRow,
        ":",
        this.state.endCell
      );
    }
    this.markSelected();
  };

  markSelected = () => {
    let startrow1 = parseInt(this.state.startRow);
    let endrow1 = parseInt(this.state.endRow);
    let firstRow = startrow1;
    let secondRow = startrow1 + 1;
    if (this.state.condition1 && startrow1 !== endrow1) {
      endrow1 = secondRow;
    }
    value = "";
    value1 = "";

    for (startrow1; startrow1 <= endrow1; startrow1++) {
      console.log("rowno:", startrow1);

      let endcell1 = parseInt(this.state.endCell);
      let startcell1 = parseInt(this.state.startCell);

      if (
        endcell1 > document.getElementById("ta").rows[startrow1].cells.length
      ) {
        endcell1 = document.getElementById("ta").rows[startrow1].cells.length;
        endcell1 = endcell1 - 1;
      }

      for (startcell1; startcell1 <= endcell1; startcell1++) {
        document.getElementById("ta").rows[startrow1].cells[
          startcell1
        ].className = "highlighted";
        if (firstRow === startrow1) {
          console.log("add value");
          value += document.getElementById("ta").rows[startrow1].cells[
            startcell1
          ].textContent;
        } else if (secondRow === startrow1) {
          value1 += document.getElementById("ta").rows[startrow1].cells[
            startcell1
          ].textContent;
        }
      }
    }
    console.log("val", value);
    console.log("val", value1);

    this.setState({ marked: true });
  };

  removeMark = () => {
    let startrow1 = parseInt(this.state.startRow);
    let endrow1 = parseInt(this.state.endRow);
    for (startrow1; startrow1 <= endrow1; startrow1++) {
      this.cutrow(startrow1);
    }
    this.setState({ marked: false });
  };

  cutrow = (rowi) => {
    let i;
    console.log("cut", rowi);
    for (
      i = 0;
      i < document.getElementById("ta").rows[rowi].cells.length;
      i++
    ) {
      document.getElementById("ta").rows[rowi].cells[i].className = ""; //  color="black";
      console.log(document.getElementById("ta").rows[rowi].cells[i]);
      //console.log(document.getElementById("ta").rows[startrow1].cells[startcell1]);
      //console.log(startcell1,endcell1,startrow1,endrow1);
      console.log("cut", rowi, i);
    }
  };
  cutcell = (celli) => {
    let i;
    console.log("cut cell", celli);
    for (i = 0; i < document.getElementById("ta").rows.length; i++) {
      if (document.getElementById("ta").rows[i].cells.length > celli) {
        console.log(
          "length",
          document.getElementById("ta").rows[i].cells.length
        );
        document.getElementById("ta").rows[i].cells[celli].className = ""; //  color="black";
        console.log(
          "change to black",
          document.getElementById("ta").rows[i].cells[celli]
        );
        //console.log(document.getElementById("ta").rows[startrow1].cells[startcell1]);
        //console.log(startcell1,endcell1,startrow1,endrow1);
        console.log("cut", celli, i);
      }
    }
  };

  mouseUp = (e) => {
    let parent = e.target.parentElement.parentElement;
    let result = {
      text: value,
      value: value1,
      index: [
        this.state.startRow,
        this.state.startCell,
        this.state.endRow,
        this.state.endCell,
      ],
    };
    console.log("result", result);
    this.setState({ result: [...this.state.result, result] }, () => {
      this.changeMarkColor();
    });
    let request = {
      content: this.state.content,
      result: result,
    };
    Axios.put("http://localhost:5001/update/flows/editorContent", {
      data: request,
    }).then((res) => console.log(res));
    parent.onmousemove = null;
    parent.onmouseup = null;
  };

  changeMarkColor = () => {
    console.log("state result", this.state.result);
    let array = [...this.state.result];
    array.map((value) => {
      let startrow = parseInt(value.index[0]);
      let endrow = parseInt(value.index[2]);
      for (startrow; startrow <= endrow; startrow++) {
        let startcell = parseInt(value.index[1]);
        let endcell = parseInt(value.index[3]);
        for (startcell; startcell <= endcell; startcell++) {
          document.getElementById("ta").rows[startrow].cells[
            startcell
          ].style.color = "red";
        }
      }
    });
  };

  showMenu = (event) => {
    this.menu.toggle(event);
  };
  render() {
    return (
      <div
        className="editor"
        style={{ position: "fixed", left: 50, top: 10 }}
        ref="mainDiv"
      >
        <Menu
          model={this.state.options}
          popup={true}
          ref={(el) => (this.menu = el)}
          id="popup_menu"
          style={{ fontSize: 12 }}
        />
        <div className="header">
          {this.state.showCondition ? (
            <button
              onClick={(event) => this.showMenu(event)}
              aria-controls="popup_menu"
              aria-haspopup={true}
              //onClick={this.highlightText}
              //onClick={this.onMark}
            >
              condition
            </button>
          ) : null}
        </div>
        <div className="realeditw" id="realeditw">
          <div
            className="realedit"
            id="realedit"
            ref="myDiv"
            contentEditable={this.state.editable}
            // onMouseUp={
            //   !this.state.editable ? (e) => this.highlightText(e) : null
            // }
            onPaste={(e) => this.onPaste(e)}
          ></div>
        </div>
        <div className="sideedit">
          {this.state.result.map((res, index) => {
            return (
              // <p key={index}>
              //   Text to look for : {res.text}
              //   <br />
              //   Start Position :{res.start}
              // </p>
              <div
                key={index}
                //className="table-bordered"
                //style={{ margin: 5, padding: 5, border: "1px solid" }}
              >
                <p>
                  <span>Text to look for : &nbsp;</span>
                  <span>{res.text}</span>
                  <br />
                  <span>value : &nbsp;</span>
                  <span>{res.value}</span>
                </p>
              </div>
            );
          })}
        </div>
        <div className="footer"></div>
      </div>
    );
  }
}

export default Editor;
