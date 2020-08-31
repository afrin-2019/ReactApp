import React, { Component } from "react";
import { Menu } from "primereact/menu";
import { TieredMenu } from "primereact/tieredmenu";
import Axios from "axios";
import ResultDisplay from "./ResultDisplay";
import BlockResult from "./BlockResult";
import FilterTextResult from "./FIlterTextResult";
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
      select: true,
      newSelect: [],
      mouseDown: false,
      startRow: "",
      endRow: "",
      startCell: "",
      endCell: "",
      marked: false,
      showCondition: false,
      result: [],
      condition1a: false,
      condition1b_1: false,
      condition2: false,
      condition3: false,
      condition4: false,
      alignment: "left aligned",
      alignOption: true,
      id: "",
      content: this.props.content || "",
      result: this.props.result || [],
      isTextSelect: false,
      text: [],
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
          // command: () => {
          //   this.condition1();
          // },
          items: [
            {
              label: "same line",
              command: () => {
                this.condition1a();
              },
            },
            {
              label: "different line",
              items: [
                {
                  label: "Based on word position",
                  command: () => {
                    this.condition1b_1();
                  },
                },
                {
                  separator: true,
                },
                {
                  label: "Based on text position",
                  command: () => {
                    this.condition1b_2();
                  },
                },
              ],
            },
          ],
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
        {
          separator: true,
        },
        {
          label: "Mark Text to Filter",
          command: () => {
            this.condition4();
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
  // condition1 = () => {
  //   this.setState({ editable: false });
  //   this.setState({ condition1: true });
  //   this.setState({ condition2: false });
  //   this.setState({ condition3: false });
  // };

  condition1a = (e) => {
    this.showMenu(e);
    console.log(this.state.select);
    this.setState({ editable: false });
    //this.setState({ condition1: false });
    this.setState({ condition2: false });
    this.setState({ condition3: false });
    this.setState({ condition1a: true });
    this.setState({ condition1b_1: false });
    this.setState({ condition1b_2: false });
    this.setState({ select: true });
  };
  condition1b_1 = (e) => {
    this.showMenu(e);
    this.setState({ editable: false });
    //this.setState({ condition1: false });
    this.setState({ condition2: false });
    this.setState({ condition3: false });
    this.setState({ condition1a: false });
    this.setState({ condition1b_1: true });
    this.setState({ condition1b_2: false });
    this.setState({ select: true });
  };

  condition1b_2 = (e) => {
    this.showMenu(e);
    this.setState({ editable: false });
    //this.setState({ condition1: false });
    this.setState({ condition2: false });
    this.setState({ condition3: false });
    this.setState({ condition1a: false });
    this.setState({ condition1b_1: false });
    this.setState({ condition1b_2: true });
    this.setState({ select: true });
  };

  condition2 = (e) => {
    this.showMenu(e);
    this.setState({ editable: false });
    this.setState({ condition2: true });
    this.setState({ condition3: false });
    this.setState({ condition1a: false });
    this.setState({ condition1b_1: false });
    this.setState({ condition1b_2: false });
    this.setState({ select: true }); //flag set to true which makes the mousedown function to work
  };

  condition3 = (e) => {
    this.showMenu(e);
    this.setState({ editable: false });
    this.setState({ condition2: false });
    this.setState({ condition3: true });
    this.setState({ condition1a: false });
    this.setState({ condition1b_1: false });
    this.setState({ condition1b_2: false });
    this.setState({ select: true }); //flag set to true which makes the mousedown function to work
  };

  condition4 = (e) => {
    this.showMenu(e);
    this.setState({ editable: false });
    this.setState({ condition2: false });
    this.setState({ condition3: false });
    this.setState({ condition1a: false });
    this.setState({ condition1b_1: false });
    this.setState({ condition1b_2: false });
    this.setState({ condition4: true });
    this.setState({ select: true }); //flag set to true which makes the mousedown function to work
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
      //console.log("table", table);
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
        //console.log("table", table);
        //appContent.append(table);
        console.log("appContent", appContent);
        el.append(table);
      });

      console.log("newcontent", newContent);
      clearInterval(interval);
      this.editTable(table);
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

  editTable = (table) => {
    console.log("in edit table", table);
    let tr_len = table.rows.length;
    let lenArray = [];
    for (let i = 0; i < tr_len; i++) {
      //get the cell length of all the row and store it in an array
      let len = table.rows[i].cells.length;
      lenArray.push(len);
    }

    var largest = 0;
    for (let j = 0; j <= largest; j++) {
      //find the largest value in the array
      if (lenArray[j] > largest) {
        largest = lenArray[j];
      }
    }

    for (let k = 0; k < tr_len; k++) {
      let len1 = table.rows[k].cells.length;
      if (len1 < largest)
        for (let l = len1; l <= largest; l++) {
          let tr = table.rows[k];
          let td = document.createElement("td");
          tr.append(td);
        }
    }
  };

  tableMouseDown = (e) => {
    console.log("in mouse down");
    if (this.state.condition1a && this.state.isTextSelect) {
      //check if option1 of mark text is selected and text is already selected
      let el = e.target.parentElement;
      if (this.state.startRow !== el.rowIndex) {
        //check if text and value are on same line
        this.setState({ select: false }); //select set to false if value selected in different row
      } else {
        this.setState({ select: true });
      }
    }

    if (!this.state.editable && this.state.select) {
      //check if contenteditable is false and slect flag true to ensure if it should be selected
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
    if (prevrow !== parent.rowIndex || prevcell !== el.cellIndex) {
      if (prevrow !== parent.rowIndex) {
        if (this.state.rowBegin > prevrow) {
          if (prevrow < parent.rowIndex) {
            this.cutrow(prevrow);
          }
        } else if (this.state.rowBegin < prevrow) {
          if (prevrow > parent.rowIndex) {
            this.cutrow(prevrow);
          }
        }
      }
      if (prevcell !== el.cellIndex) {
        if (this.state.cellBegin > prevcell) {
          if (prevcell < el.cellIndex) {
            this.cutcell(prevcell);
          }
        } else if (this.state.cellBegin < prevcell) {
          if (prevcell > el.cellIndex) {
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
    } else if (startcell > el.cellIndex) {
      this.setState({ startCell: el.cellIndex });
    } else if (startcell === el.cellIndex) {
      this.setState({ startCell: el.cellIndex });
      this.setState({ endCell: el.cellIndex });
    }
    this.markSelected();
  };

  markSelected = () => {
    let startrow1 = parseInt(this.state.startRow);
    let endrow1 = parseInt(this.state.endRow);
    let firstRow = startrow1;
    let secondRow = startrow1 + 1;
    if (this.state.condition1b_1 && startrow1 !== endrow1) {
      endrow1 = secondRow;
    } else if (this.state.condition1b_2 && startrow1 !== endrow1) {
      endrow1 = secondRow;
    } else if (this.state.condition3 && startrow1 !== endrow1) {
      endrow1 = startrow1;
    } else if (this.state.condition1a && startrow1 !== endrow1) {
      endrow1 = startrow1;
    } else if (this.state.condition4 && startrow1 !== endrow1) {
      endrow1 = startrow1;
    }
    value = "";
    value1 = "";

    for (startrow1; startrow1 <= endrow1; startrow1++) {
      //console.log("rowno:", startrow1);

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
    // console.log("val", value);
    // console.log("val", value1);

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
    for (
      i = 0;
      i < document.getElementById("ta").rows[rowi].cells.length;
      i++
    ) {
      document.getElementById("ta").rows[rowi].cells[i].className = ""; //  color="black";
      // console.log(document.getElementById("ta").rows[rowi].cells[i]);
      //console.log(document.getElementById("ta").rows[startrow1].cells[startcell1]);
      //console.log(startcell1,endcell1,startrow1,endrow1);
    }
  };
  cutcell = (celli) => {
    let i;
    for (i = 0; i < document.getElementById("ta").rows.length; i++) {
      if (document.getElementById("ta").rows[i].cells.length > celli) {
        document.getElementById("ta").rows[i].cells[celli].className = ""; //  color="black";
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
      // let precision = 10000;
      // let randomNo =
      //   Math.floor(
      //     Math.random() * (10 * precision - 1 * precision) + 1 * precision
      //   ) /
      //   (1 * precision);

      const min = 1;
      const max = 100;
      const randomNo = Math.floor(min + Math.random() * (max - min));

      let parseVar = "parseoutput" + randomNo;
      // let len1 = res.data[0].result.length;
      // if (len1 === 0) {
      //   parseVar = "parseoutput1";
      //   console.log(parseVar);
      // } else {
      //   let lastVal = res.data[0].result[len1 - 1].outputVar;
      //   let nextVal = lastVal.substring(11);
      //   console.log("nextVal", nextVal);
      //   let addVariable = parseInt(nextVal) + 1;
      //   parseVar = "parseoutput" + addVariable;
      // }
      // if (this.state.condition2) {
      //   result = {
      //     condition: "Mark Text",
      //     text: value,
      //     value: value1,
      //     index: [
      //       this.state.startRow,
      //       this.state.startCell,
      //       this.state.endRow,
      //       this.state.endCell,
      //     ],
      //   };
      // } else
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
      if (this.state.condition3) {
        //if Mark position is selected

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
        console.log("result", result);
        this.updateResult(result);
      } else if (this.state.condition1a) {
        if (!this.state.isTextSelect) {
          //text not selected
          this.setState({ isTextSelect: true });
          this.setState({
            text: [value, this.state.startCell, this.state.endCell],
          }); //make the selected value as text
          let startcell = parseInt(this.state.startCell);
          let endcell = parseInt(this.state.endCell);
          let lineNo = parseInt(this.state.startRow);
          for (startcell; startcell <= endcell; startcell++) {
            document.getElementById("ta").rows[lineNo].cells[
              startcell
            ].style.color = "red";
          }
        } else {
          //make the selected one as value
          //console.log(this.state.text + ":" + value);
          this.setState({ condition1a: false });
          this.setState({ select: false });
          this.setState({ isTextSelect: false });
          result = {
            condition: "Mark Text Same Line",
            startPos: this.state.startCell,
            endPos: this.state.endCell,
            lineNo: this.state.startRow,
            endCellType: cellType,
            endChar: endCellValue,
            outputVar: parseVar,
            text: this.state.text,
            value: value,
          };
          console.log("result", result);
          this.updateResult(result);
        }
      } else if (this.state.condition1b_1) {
        this.setState({ condition1b_1: false });
        this.setState({ select: false });
        this.setState({
          text: [value, this.state.startCell, this.state.endCell],
        });
        result = {
          condition: "Mark Text different Line|Position",
          index: [
            this.state.startRow,
            this.state.startCell,
            this.state.endRow,
            this.state.endCell,
          ],
          outputVar: parseVar,
          text: value,
          endCellType: cellType,
          endChar: endCellValue,
        };
        console.log("result", result);
        this.updateResult(result);
      } else if (this.state.condition1b_2) {
        this.setState({ condition1b_2: false });
        this.setState({ select: false });
        this.setState({
          text: [value, this.state.startCell, this.state.endCell],
        });
        result = {
          condition: "Mark Text different Line|Text",
          index: [
            this.state.startRow,
            this.state.startCell,
            this.state.endRow,
            this.state.endCell,
          ],
          alignment: this.state.alignment,
          outputVar: parseVar,
          text: value,
          endCellType: cellType,
          endChar: endCellValue,
        };
        console.log("result", result);
        this.updateResult(result);
      }
      //if mark text as block is selected
      else if (this.state.condition2) {
        console.log("mark block");
        this.setState({ condition2: false });
        this.setState({ select: false });
        result = {
          condition: "Mark Text as Block",
          index: [
            this.state.startRow,
            this.state.startCell,
            this.state.endRow,
            this.state.endCell,
          ],
          outputVar: parseVar,
          text: value,
          endLine: "EOL", //select block of text till last line
          endLineValue: "",
        };
        this.updateResult(result);
      } else if (this.state.condition4) {
        console.log("mark to filter");
        this.setState({ condition4: false });
        this.setState({ select: false });
        result = {
          condition: "Mark Text to Filter",
          index: [
            this.state.startRow,
            this.state.startCell,
            this.state.endRow,
            this.state.endCell,
          ],
          outputVar: parseVar,
          text: value,
          filterText: "",
          delimiter: "",
          wordPosition: "",
        };
        this.updateResult(result);
      }
    });
    parent.onmousemove = null;
    parent.onmouseup = null;
  };

  updateResult = (result) => {
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
  };

  changeMarkColor = () => {
    console.log("state result", this.state.result);
    let array = [...this.state.result];
    array.map((value) => {
      console.log("value now", value);
      if (
        value.condition === "Mark Text different Line|Position" ||
        value.condition === "Mark Text different Line|Text" ||
        value.condition === "Mark Text as Block" ||
        value.condition === "Mark Text to Filter"
      ) {
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
      } else if (value.condition === "Mark Position" || "Mark Text Same Line") {
        if (value.condition === "Mark Text Same Line") {
          let startcell = parseInt(value.text[1]);
          let endcell = parseInt(value.text[2]);
          let row = parseInt(value.lineNo);
          for (startcell; startcell <= endcell; startcell++) {
            //console.log(document.getElementById("ta"));
            document.getElementById("ta").rows[row].cells[
              startcell
            ].style.color = "red";
          }
        }
        let startcell = parseInt(value.startPos);
        let endcell = parseInt(value.endPos);
        let row = parseInt(value.lineNo);
        for (startcell; startcell <= endcell; startcell++) {
          //console.log(document.getElementById("ta"));
          document.getElementById("ta").rows[row].cells[startcell].style.color =
            "red";
        }
      }
    });
  };

  removeRedMark = (value) => {
    console.log("in remove", value.condition);
    if (value.condition === "Mark Position" || "Mark Text Same Line") {
      if (value.condition === "Mark Text Same Line") {
        let startcell = parseInt(value.text[1]);
        let endcell = parseInt(value.text[2]);
        let row = parseInt(value.lineNo);
        for (startcell; startcell <= endcell; startcell++) {
          console.log(document.getElementById("ta"));
          document.getElementById("ta").rows[row].cells[startcell].style.color =
            "black";
        }
      }
      let startcell = parseInt(value.startPos);
      let endcell = parseInt(value.endPos);
      let row = parseInt(value.lineNo);
      for (startcell; startcell <= endcell; startcell++) {
        console.log(document.getElementById("ta"));
        document.getElementById("ta").rows[row].cells[startcell].style.color =
          "black";
      }
    }
    if (
      value.condition === "Mark Text different Line|Position" ||
      value.condition === "Mark Text different Line|Text" ||
      value.condition === "Mark Text as Block" ||
      value.condition === "Mark Text to Filter"
    ) {
      console.log("change color after delete");
      let startrow = parseInt(value.index[0]);
      let endrow = parseInt(value.index[2]);
      for (startrow; startrow <= endrow; startrow++) {
        let startcell = parseInt(value.index[1]);
        let endcell = parseInt(value.index[3]);
        for (startcell; startcell <= endcell; startcell++) {
          document.getElementById("ta").rows[startrow].cells[
            startcell
          ].style.color = "black";
        }
      }
    }
  };

  showMenu = (event) => {
    this.menu.toggle(event);
  };

  onDeleteResult = (ind) => {
    let request = {
      result: ind,
      editorId: this.props.id,
    };
    console.log(ind);
    Axios.delete("http://localhost:5001/delete/flows/editorresult", {
      data: request,
    }).then((res) => {
      console.log("res after del", res.data);
      Axios.get("http://localhost:5001/get/flows/editorContent/id", {
        params: {
          editorId: this.props.id,
        },
      }).then((resp) => {
        console.log(resp.data);
        this.removeRedMark(ind);
        this.setState({ result: resp.data[0].result });
      });
    });
  };
  //change the value of the ouput variable by user and update in db
  handleOutputVar = (e, res) => {
    console.log("res", res);
    console.log("outvar", e.target.innerText);
    let request = {
      result: res,
      output: e.target.innerHTML,
      editorId: this.props.id,
    };
    Axios.put("http://localhost:5001/update/flows/editorContent/result", {
      data: request,
    }).then((res) => console.log("after variable change", res.data));
  };

  // setAlignment = (event) => {
  //   this.setState({ alignment: event.target.value });
  // };
  // onEdit = () => {
  //   this.setState({ alignOption: false });
  // };

  // saveAlignment = (result) => {
  //   this.setState({ alignOption: true });
  //   let request = {
  //     editorId: this.props.id,
  //     result: result,
  //     alignment: this.state.alignment,
  //   };
  //   Axios.put("http://localhost:5001/update/flows/editorContent/alignment", {
  //     data: request,
  //   }).then((response) => console.log(response));
  // };
  render() {
    return (
      <div
        className="editor"
        style={{ position: "fixed", left: 50, top: 10 }}
        ref="mainDiv"
      >
        <TieredMenu
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
              //className="btn btn-sm"
              style={{ position: "absolute", left: 10, margin: 1 }}
              title="condition"
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
          {/* <button
            className="btn btn-sm btn-outline-secondary m-2 savebtn"
            onClick={this.props.handleSave}
          >
            save
          </button> */}
          <button
            className="btn btn-sm btn-outline-secondary m-2 closebutton"
            onClick={this.props.handleClose}
            title="close"
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
                style={{
                  border: "1px solid gray",
                  borderRadius: 10,
                  width: "80%",
                  margin: 2,
                  padding: 5,
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <button
                  style={{
                    //position: "absolute",
                    fontSize: 10,
                  }}
                  className="btn"
                  onClick={() => this.onDeleteResult(res)}
                  title="Delete"
                >
                  <i className="fa fa-trash" />
                </button>
                {res.condition === "Mark Text Same Line" ? (
                  <span>
                    <span>Condition : &nbsp; {res.condition}</span>
                    <br />
                    <span>Text : &nbsp;{res.text[0]}</span>
                    <br />
                    <span>value : &nbsp;{res.value}</span>
                    <br />
                    <span>Start Position : &nbsp;{res.startPos}</span>
                    <br />
                    <span>End Position : &nbsp;</span>
                    {res.endCellType === "EOL" ? (
                      <span>{res.endCellType}</span>
                    ) : (
                      <span>{res.endPos}</span>
                    )}
                    <br />
                    <span>variable:&nbsp;</span>
                    <span
                      contentEditable="true"
                      onBlur={(e) => this.handleOutputVar(e, res)}
                      suppressContentEditableWarning={true}
                    >
                      {res.outputVar}
                    </span>
                  </span>
                ) : null}
                {res.condition === "Mark Text different Line|Position" ? (
                  <span>
                    <span>Condition : &nbsp; {res.condition}</span>
                    <br />
                    <span>Text : &nbsp;{res.text}</span>
                    <br />
                    <span>Start Position : &nbsp;{res.index[1]}</span>
                    <br />
                    <span>End Position : &nbsp;</span>
                    <span>{res.index[3]}</span>
                    <br />
                    <span>variable:&nbsp;</span>
                    <span
                      contentEditable="true"
                      onBlur={(e) => this.handleOutputVar(e, res)}
                      suppressContentEditableWarning={true}
                    >
                      {res.outputVar}
                    </span>
                  </span>
                ) : null}
                {res.condition === "Mark Text different Line|Text" ? (
                  <ResultDisplay
                    result={res}
                    handleOutput={this.handleOutputVar}
                    alignment={res.alignment}
                    id={this.props.id}
                  />
                ) : null}
                {res.condition === "Mark Position" ? (
                  <span>
                    <span>Condition : &nbsp; {res.condition}</span> <br />
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
                    <span>variable:&nbsp;</span>
                    <span
                      contentEditable="true"
                      onBlur={(e) => this.handleOutputVar(e, res)}
                      suppressContentEditableWarning={true}
                    >
                      {res.outputVar}
                    </span>
                  </span>
                ) : null}
                {res.condition == "Mark Text as Block" ? (
                  <BlockResult
                    radio={index}
                    result={res}
                    handleOutput={this.handleOutputVar}
                    endline={res.endLine}
                    value={res.endLineValue}
                    id={this.props.id}
                  />
                ) : null}
                {res.condition == "Mark Text to Filter" ? (
                  <FilterTextResult
                    result={res}
                    index={index}
                    filterText={res.filterText}
                    delimiter={res.delimiter}
                    wordPosition={res.wordPosition}
                    id={this.props.id}
                    handleOutput={this.handleOutputVar}
                  />
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
