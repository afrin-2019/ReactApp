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
      condition3: false,
      id: "",
      content: this.props.content || "",
      result: this.props.result || [],
      options: [
        {
          label: "Mark Position to extract",
          command: () => {
            this.condition3();
          },
        },
        {
          separator: true,
        },
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
    console.log("editor-id", this.props.id);
    this.pos1 = 0;
    this.pos2 = 0;
    this.pos3 = 0;
    this.pos4 = 0;
    // Axios.get("http://localhost:5001/get/flows/editorContent").then((res) => {
    //   console.log("table", res.data);
    //   let len = res.data.length;
    //   // if (len !== 0) {
    //   //   this.setState({ id: res.data[len - 1]._id });
    //   //   this.setState({ content: res.data[len - 1].content });
    //   //   var element = document.createElement(null);
    //   //   element.innerHTML = res.data[len - 1].content;
    //   //   element = element.firstChild;
    //   //   this.refs.myDiv.appendChild(element);
    //   //   document.getElementById("ta").onmousedown = this.tableMouseDown;
    //   //   this.setState({ showCondition: true });
    //   //   this.setState({ result: res.data[len - 1].result }, () =>
    //   //     this.changeMarkColor()
    //   //   );
    //   // }
    // });
    if (this.state.content !== "") {
      var element = document.createElement(null);
      element.innerHTML = this.state.content;
      element = element.firstChild;
      this.refs.myDiv.appendChild(element);
      document.getElementById("ta").onmousedown = this.tableMouseDown;
      this.setState({ showCondition: true });
      this.changeMarkColor();
    }
  }
  condition1 = () => {
    this.setState({ editable: false });
    this.setState({ condition1: true });
    this.setState({ condition2: false });
    this.setState({ condition3: false });
  };

  condition2 = () => {
    this.setState({ editable: false });
    this.setState({ condition2: true });
    this.setState({ condition1: false });
    this.setState({ condition3: false });
  };

  condition3 = () => {
    this.setState({ editable: false });
    this.setState({ condition1: false });
    this.setState({ condition2: false });
    this.setState({ condition3: true });
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
    console.log("el", el);
    console.log("el", el.children.length);
    let newContent = [];
    let table = document.createElement("table");
    if (el.children.length === 0) {
      //for (let i in el) {
      console.log("no children", el.innerHTML);
      let data = el.innerHTML;
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

      let tr = document.createElement("tr");

      //data.push(el.innerHTML);
      // console.log("style", content.style.cssText);
      console.log("data", data);
      tr.style.userSelect = "none";
      //tr.append(data);
      tbody.append(tr);
      let cntnue = true;
      if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
          //console.log("text", data[i], typeof data[i]);
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
            } else if (data[i] === " ") {
              //console.log("in empty string");
              let td = document.createElement("td");
              td.innerHTML = "&nbsp;";
              tr.append(td);
            } else {
              let td = document.createElement("td");
              td.append(data[i]);
              //console.log("td", td);
              tr.append(td);
            }
          }
        }
      }
      console.log("table", table);
      //appContent.append(table);
      console.log("appContent", appContent);
      el.append(table);

      console.log("newcontent", newContent);
      clearInterval(interval);
      this.setState({ content: table.outerHTML });
    } else {
      for (let i in el.children) {
        console.log(el.children[i].tagName);
        if (el.children[i].tagName === "P") {
          console.log("child", el.children[i].children[0]);
          newContent = [...newContent, el.children[i].children[0]];
          console.log("newcontent", newContent);
        } else if (el.children[i].tagName === "DIV") {
          console.log("child", el.children[i].innerHTML);
          newContent = [...newContent, el.children[i]];
        }
      }

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
        console.log("data", data);
        console.log("content", content);
        // console.log("style", content.style.cssText);
        if (content.style) {
          tr.style.cssText = content.style.cssText;
        }
        tr.style.userSelect = "none";
        //tr.append(data);
        tbody.append(tr);
        let cntnue = true;
        if (data.length !== 0) {
          for (let i = 0; i < data.length; i++) {
            //console.log("text", data[i], typeof data[i]);
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
              } else if (data[i] === " ") {
                //console.log("in empty string");
                let td = document.createElement("td");
                td.innerHTML = "&nbsp;";
                tr.append(td);
              } else {
                let td = document.createElement("td");
                td.append(data[i]);
                //console.log("td", td);
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
    }
    let req = {
      EditorId: this.props.id,
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
    } else if (this.state.condition3 && startrow1 !== endrow1) {
      endrow1 = startrow1;
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
    let result = {};
    Axios.get("http://localhost:5001/get/flows/editorContent/id", {
      params: {
        editorId: this.props.id,
      },
    }).then((res) => {
      console.log("res after eid", res.data);
      let parseVar;
      let len1 = res.data[0].result.length;
      if (len1 === 0) {
        parseVar = "parseoutput1";
        console.log(parseVar);
      } else {
        let lastVal = res.data[0].result[len1 - 1].outputVar;
        let nextVal = lastVal.substring(11);
        console.log("nextVal", nextVal);
        let addVariable = parseInt(nextVal) + 1;
        parseVar = "parseoutput" + addVariable;
      }
      if (this.state.condition1 || this.state.condition2) {
        result = {
          condition: "Mark Text",
          text: value,
          value: value1,
          index: [
            this.state.startRow,
            this.state.startCell,
            this.state.endRow,
            this.state.endCell,
          ],
        };
      } else if (this.state.condition3) {
        var mytable = document.getElementById("ta");
        var myrows = mytable.getElementsByTagName("tr");
        var selrow = myrows[this.state.startRow];
        console.log("end cell pos", this.state.endCell);
        var mycells = selrow.getElementsByTagName("td");
        var len = mycells.length - 1;
        console.log("length", len);
        var endCellValue = mycells[this.state.endCell].innerText;
        console.log("value", endCellValue);
        let cellType = "NOT EOL";
        if (this.state.endCell === len) {
          cellType = "EOL";
        }
        console.log(this.state.editorId);

        result = {
          condition: "Mark Position",
          startPos: this.state.startCell,
          endPos: this.state.endCell,
          lineNo: this.state.startRow,
          endCellType: cellType,
          endChar: endCellValue,
          outputVar: parseVar,
        };
      }

      console.log("result", result);
      this.setState({ result: [...this.state.result, result] }, () => {
        this.changeMarkColor();
      });
      let request = {
        editorId: this.props.id,
        content: this.state.content,
        result: result,
      };
      Axios.put("http://localhost:5001/update/flows/editorContent", {
        data: request,
      }).then((res) => console.log(res));
    });
    parent.onmousemove = null;
    parent.onmouseup = null;
  };

  changeMarkColor = () => {
    console.log("state result", this.state.result);
    let array = [...this.state.result];
    array.map((value) => {
      console.log("value now", value);
      if (value.condition === "Mark Text") {
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
      } else if (value.condition === "Mark Position") {
        let startcell = parseInt(value.startPos);
        let endcell = parseInt(value.endPos);
        let row = parseInt(value.lineNo);
        for (startcell; startcell <= endcell; startcell++) {
          console.log(document.getElementById("ta"));
          document.getElementById("ta").rows[row].cells[startcell].style.color =
            "red";
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
          <button
            className="btn btn-sm btn-outline-secondary m-2 closebutton"
            onClick={this.props.handleClose}
          >
            ×
          </button>
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
                {res.condition === "Mark Text" ? (
                  <p>
                    <span>Text to look for : &nbsp;</span>
                    <span>{res.text}</span>
                    <br />
                    <span>value : &nbsp;</span>
                    <span>{res.value}</span>
                  </p>
                ) : null}
                {res.condition === "Mark Position" ? (
                  <p>
                    <span>Start Position : &nbsp;</span>
                    <span>{res.startPos}</span>
                    <br />
                    <span>End Position : &nbsp;</span>
                    {res.endCellType === "EOL" ? (
                      <span>{res.endCellType}</span>
                    ) : (
                      <span>{res.endPos}</span>
                    )}
                    <br />
                    {res.endChar === ";" || res.endChar === "," ? (
                      <span>
                        End Char : &nbsp; {res.endChar} <br />
                      </span>
                    ) : null}
                    <span>Line No : &nbsp;</span>
                    <span>{parseInt(res.lineNo) + 1}</span>
                    <br />
                    <span>variable:&nbsp;{res.outputVar}</span>
                  </p>
                ) : null}
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
