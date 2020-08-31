import React, { Component } from "react";
import Axios from "axios";

class BlockResult extends Component {
  state = {
    option: this.props.endline,
    textValue: this.props.value,
    showSave: false,
  };

  onRadioChange = (e) => {
    this.setState({ showSave: true });
    this.setState({ option: e.target.value });
  };

  onTextChange = (e) => {
    this.setState({ textValue: e.target.value });
  };

  saveText = (result) => {
    if (this.state.option === "EOL") {
      this.setState({ textValue: "" });
    }
    let request = {
      editorId: this.props.id,
      result: result,
      endLine: this.state.option,
      value: this.state.textValue,
    };
    console.log("req", request);
    Axios.put("http://localhost:5001/update/flows/editorContent/endLineValue", {
      data: request,
    }).then((response) => {
      console.log(response);
      this.setState({ showSave: false });
    });
  };
  render() {
    let res = this.props.result;
    return (
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
          onBlur={(e) => this.props.handleOutput(e, res)}
          suppressContentEditableWarning={true}
        >
          {res.outputVar}
        </span>
        <br />
        <span>End of Last Line ? &nbsp; </span>
        <span>
          <input
            type="radio"
            id="option1"
            value="EOL"
            name={"blocktext" + this.props.radio}
            onChange={this.onRadioChange}
            checked={this.state.option === "EOL"}
          />
          <label htmlFor="option1">Yes</label> &nbsp;
          <input
            type="radio"
            id="option2"
            value="Not EOL"
            name={"blocktext" + this.props.radio}
            onChange={this.onRadioChange}
            checked={this.state.option === "Not EOL"}
          />
          <label htmlFor="option2">No</label>
          {this.state.showSave ? (
            <button
              className="btn"
              title="Save"
              onClick={() => this.saveText(res)}
            >
              <i className="fa fa-save" />
            </button>
          ) : null}
          <br />
          {this.state.option === "Not EOL" ? (
            <span>
              {" "}
              Value : &nbsp;
              <input
                type="text"
                value={this.state.textValue}
                onChange={this.onTextChange}
              />
            </span>
          ) : null}
        </span>
      </span>
    );
  }
}

export default BlockResult;
