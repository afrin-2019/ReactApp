import React, { Component } from "react";
import Axios from "axios";
import Editor from "./Editor";

class ActionTabContent extends Component {
  state = {
    action: this.props.selectedAction || "0",
    file: this.props.file || "",
    command: this.props.val || "",
    disabled: false,
    openEditor: false,
    variable: this.props.val || "",
    message: this.props.message || "",
    editorId:
      "Editor-" +
      this.props.flowSelected +
      "-" +
      this.props.stepNo +
      "-" +
      this.props.editorId,
    content: "",
    result: "",
    alreadySaved: false,
    eId: this.props.eId || 0,
    cId: this.props.cId || 0,
    nId: this.props.nId || 0,
    conId: this.props.conId || 0,
    rvId: this.props.rvId || 0,
    mId: this.props.mId || 0,
    uniqueId:
      this.props.eId ||
      this.props.cId ||
      this.props.nId ||
      this.props.conId ||
      this.props.rvId ||
      this.props.mId,
  };

  componentDidMount() {
    console.log("in mount", this.state.variable);
    if (this.state.action !== "0") {
      this.setState({ disabled: true });
      this.setState({ alreadySaved: true });
    }
    let i = 0,
      j = 0,
      k = 0,
      l = 0,
      m = 0,
      n = 0;
    Axios.get("http://localhost:5001/get/flows/flowContent").then((res) => {
      if (res.data.length !== 0) {
        res.data.map((array, index) => {
          if (array.Flow === this.props.flowSelected) {
            if (array.Step === this.props.stepNo) {
              if (array.Action.length !== 0) {
                array.Action.map((action) => {
                  if (action.Type === "Find NodeDetails") {
                    k = parseInt(action.id) + 1;
                  }
                  if (action.Type === "Connect") {
                    l = parseInt(action.id) + 1;
                  }
                  if (action.Type === "Parse the Output") {
                    i = parseInt(action.id) + 1;
                  }
                  if (action.Type === "Run a Command") {
                    j = parseInt(action.id) + 1;
                  }
                  if (action.Type === "Receive Variable") {
                    m = parseInt(action.id) + 1;
                  }
                  if (action.Type === "Add Text Message") {
                    n = parseInt(action.id) + 1;
                  }
                });
              }
            }
          }
        });
      }
      this.setState({ eId: i });
      this.setState({ cId: j });
      this.setState({ nId: k });
      this.setState({ conId: l });
      this.setState({ rvId: m });
      this.setState({ mId: n });
    });
  }

  onOpenEditor = () => {
    console.log("opopen", this.state.openEditor);
    console.log("editorid", this.state.editorId);
    Axios.get("http://localhost:5001/get/flows/editorContent").then((res) => {
      console.log("table", res.data);
      res.data.map((editor, index) => {
        if (editor.EditorId === this.state.editorId) {
          this.setState({ content: res.data[index].content });
          this.setState({ result: res.data[index].result });
        }
      });
      this.setState({ openEditor: !this.state.openEditor });
    });
  };

  onCloseEditor = () => {
    this.setState({ openEditor: false });
  };
  handleActionChange = (actionType) => {
    console.log("handle action");
    this.setState({ action: actionType });
    // this.props.enable();
  };

  handleClick = () => {
    this.refs.fileUploader.click();
  };
  handleChange = (e) => {
    let file = e.target.files[0].name;
    console.log("file", file);
    this.setState({ file: file });
  };

  handleCommand = (e) => {
    this.setState({ command: e.target.value });
  };

  handleVariable = (e) => {
    this.setState({ disabled: false });
    this.setState({ variable: e.target.value });
  };

  handleTextMessage = (e) => {
    this.setState({ disabled: false });
    this.setState({ message: e.target.value });
  };

  onConfirmNode = () => {
    this.setState({ uniqueId: this.state.nId.toString() });
    Axios.get("http://localhost:5001/flow/content/action", {
      params: {
        flowName: this.props.flowSelected,
        stepNo: this.props.stepNo,
        type: "Find NodeDetails",
        id: this.state.nId,
      },
    }).then((res) => {
      console.log("res", res);
      this.setState({ disabled: true });
      this.props.enableAdd();
    });
  };

  onConfirmConnect = () => {
    this.setState({ uniqueId: this.state.conId.toString() });
    Axios.get("http://localhost:5001/flow/content/action", {
      params: {
        flowName: this.props.flowSelected,
        stepNo: this.props.stepNo,
        type: "Connect",
        id: this.state.conId,
      },
    }).then((res) => {
      console.log("res", res);
      this.setState({ disabled: true });
      this.props.enableAdd();
    });
  };

  onconfirmCommand = () => {
    this.setState({ uniqueId: this.state.cId.toString() });
    console.log("command", this.state.command);
    console.log("flowList", this.props.flowList);
    console.log("flow", this.props.flowSelected);
    console.log("step", this.props.stepNo);
    Axios.get("http://localhost:5001/flow/content/action", {
      params: {
        id: this.state.cId,
        flowName: this.props.flowSelected,
        stepNo: this.props.stepNo,
        command: this.state.command,
        type: "Run a Command",
      },
    }).then((res) => {
      console.log("res", res);
      this.setState({ disabled: true });
      this.props.enableAdd();
    });
  };

  onConfirmParse = () => {
    this.setState({ uniqueId: this.state.eId.toString() });
    this.setState({
      editorId:
        "Editor-" +
        this.props.flowSelected +
        "-" +
        this.props.stepNo +
        "-" +
        this.state.eId,
    });
    Axios.get("http://localhost:5001/flow/content/action", {
      params: {
        id: this.state.eId,
        flowName: this.props.flowSelected,
        stepNo: this.props.stepNo,
        file: this.state.file,
        type: "Parse the Output",
        EditorId:
          "Editor-" +
          this.props.flowSelected +
          "-" +
          this.props.stepNo +
          "-" +
          this.state.eId,
      },
    }).then((res) => {
      console.log("res", res);
      this.setState({ disabled: true });
      this.props.enableAdd();
    });
  };

  onConfirmVariable = () => {
    if (!this.state.alreadySaved) {
      this.setState({ uniqueId: this.state.rvId.toString() });
      // Axios.post("http://localhost:5001/insert/receivevariable", {
      //   data: {
      //     flowName: this.props.flowSelected,
      //     step: this.props.stepNo,
      //     variable: this.state.variable,
      //     id: this.props.stepNo + "-" + this.state.rvId,
      //   },
      // }).then((res) => console.log(res));
      Axios.get("http://localhost:5001/flow/content/action", {
        params: {
          id: this.state.rvId,
          flowName: this.props.flowSelected,
          stepNo: this.props.stepNo,
          variable: this.state.variable,
          type: "Receive Variable",
        },
      }).then((res) => {
        console.log("res", res);
        this.setState({ disabled: true });
        this.setState({ alreadySaved: true });
        this.props.enableAdd();
      });
    } else {
      Axios.put("http://localhost:5001/update/content/action", {
        flowName: this.props.flowSelected,
        stepNo: this.props.stepNo,
        type: "Receive Variable",
        id: this.state.uniqueId,
        variable: this.state.variable,
      }).then((res) => {
        console.log(res);
        this.setState({ disabled: true });
        this.setState({ alreadySaved: true });
        this.props.enableAdd();
      });
    }
  };

  onConfirmMessage = () => {
    if (!this.state.alreadySaved) {
      this.setState({ uniqueId: this.state.mId.toString() });
      Axios.get("http://localhost:5001/flow/content/action", {
        params: {
          id: this.state.mId,
          flowName: this.props.flowSelected,
          stepNo: this.props.stepNo,
          message: this.state.message,
          type: "Add Text Message",
        },
      }).then((res) => {
        console.log("res", res);
        this.setState({ disabled: true });
        this.setState({ alreadySaved: true });
        this.props.enableAdd();
      });
    } else {
      Axios.put("http://localhost:5001/update/content/action", {
        flowName: this.props.flowSelected,
        stepNo: this.props.stepNo,
        type: "Add Text Message",
        id: this.state.uniqueId,
        message: this.state.message,
      }).then((res) => {
        console.log(res);
        this.setState({ disabled: true });
        this.setState({ alreadySaved: true });
        this.props.enableAdd();
      });
    }
  };

  onDelete = () => {
    if (this.state.action === "4") {
      Axios.get("http://localhost:5001/get/flows/editorContent").then((res) => {
        if (res.data.length !== 0) {
          res.data.map((edContent) => {
            if (edContent.EditorId === this.state.editorId) {
              Axios.delete("http://localhost:5001/delete/flows/editorContent", {
                data: {
                  flowName: this.props.flowSelected,
                  step: this.props.stepNo,
                  editorId: this.state.editorId,
                },
              }).then((res) => console.log(res));
            }
          });
        }
      });
    }
    this.props.handleDelete(
      this.props.id,
      this.state.action,
      this.state.uniqueId
    );
  };
  render() {
    // console.log("props in action", this.props);
    // console.log("action state", this.state);
    let commandContent;
    if (this.state.action === "1") {
      commandContent = (
        <button
          style={{ margin: 2 }}
          onClick={this.onConfirmNode}
          disabled={this.state.disabled}
        >
          {" "}
          save
        </button>
      );
    }
    if (this.state.action === "2") {
      commandContent = (
        <button
          style={{ margin: 2 }}
          onClick={this.onConfirmConnect}
          disabled={this.state.disabled}
        >
          {" "}
          save
        </button>
      );
    }
    if (this.state.action === "3") {
      commandContent = (
        <div style={{ margin: 10 }}>
          <input
            type="text"
            value={this.state.command}
            onChange={this.handleCommand}
          />
          <button
            style={{ margin: 2 }}
            onClick={this.onconfirmCommand}
            disabled={this.state.disabled}
          >
            save
          </button>
        </div>
      );
    }
    if (this.state.action === "4") {
      commandContent = (
        <div style={{ margin: 10 }}>
          <button
            style={{ margin: 2 }}
            onClick={this.onOpenEditor}
            disabled={!this.state.disabled}
          >
            Editor{" "}
          </button>
          <input
            type="file"
            id="file"
            ref="fileUploader"
            onChange={(e) => this.handleChange(e)}
            style={{ display: "none" }}
          />
          <label htmlFor="file">{this.state.file}</label>
          <button style={{ margin: 2 }} onClick={this.handleClick}>
            Browse
          </button>
          <button
            style={{ margin: 2 }}
            onClick={this.onConfirmParse}
            disabled={this.state.disabled}
          >
            save
          </button>
        </div>
      );
    }
    if (this.state.action === "5") {
      commandContent = (
        <div style={{ margin: 10 }}>
          <input
            type="text"
            value={this.state.variable}
            onChange={this.handleVariable}
          />
          <button
            style={{ margin: 2 }}
            onClick={this.onConfirmVariable}
            disabled={this.state.disabled}
          >
            save
          </button>
        </div>
      );
    }
    if (this.state.action === "6") {
      commandContent = (
        <div style={{ margin: 10 }}>
          <input
            type="text"
            value={this.state.message}
            onChange={this.handleTextMessage}
          />
          <button
            style={{ margin: 2 }}
            onClick={this.onConfirmMessage}
            disabled={this.state.disabled}
          >
            save
          </button>
        </div>
      );
    }

    return (
      <div
        id={this.props.id}
        style={{
          border: "1px solid #d3d3d3",
          borderRadius: 10,
          padding: 6,
          marginLeft: 2,
          marginTop: 10,
          backgroundColor: "#f1f1f1",
          position: "relative",
        }}
      >
        <button
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            margin: 2,
            fontSize: 10,
          }}
          className="btn"
          onClick={this.onDelete}
          title="Delete"
        >
          {" "}
          <i className="fa fa-trash" />
        </button>
        <div
        //style={{ display: "flex", justifyContent: "center" }}
        >
          Select an action:&nbsp;
          <select
            name="action"
            value={this.state.action}
            onChange={(event) => this.handleActionChange(event.target.value)}
          >
            <option value="0">Select</option>
            <option value="1">Find NodeDetails</option>
            <option value="2">Connect</option>
            <option value="3">Run a command</option>
            <option value="4">Parse the output</option>
            <option value="5">Receive Variable</option>
            <option value="6">Add Text Message</option>
          </select>
        </div>

        <div
        //style={{ display: "flex", justifyContent: "center" }}
        >
          {" "}
          {commandContent}
        </div>

        {this.state.openEditor ? (
          <Editor
            id={this.state.editorId}
            // id={
            //   "Editor-" +
            //   this.props.flowSelected +
            //   "-" +
            //   this.props.stepNo +
            //   "-" +
            //   this.state.eId
            // }
            flowName={this.props.flowSelected}
            stepNo={this.props.stepNo}
            content={this.state.content}
            result={this.state.result}
            handleClose={this.onCloseEditor}
          />
        ) : null}
      </div>
    );
  }
}

export default ActionTabContent;
