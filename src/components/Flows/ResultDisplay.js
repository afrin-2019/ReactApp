import React, { Component } from "react";
import Axios from "axios";
class ResultDisplay extends Component {
  state = {
    alignment: this.props.alignment,
    alignOption: true,
  };

  setAlignment = (event) => {
    this.setState({ alignment: event.target.value });
  };
  onEdit = () => {
    this.setState({ alignOption: false });
  };
  saveAlignment = (result) => {
    this.setState({ alignOption: true });
    let request = {
      editorId: this.props.id,
      result: result,
      alignment: this.state.alignment,
    };
    Axios.put("http://localhost:5001/update/flows/editorContent/alignment", {
      data: request,
    }).then((response) => console.log(response));
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
        <span>
          {" "}
          Alignment:
          <select
            style={{ margin: 2 }}
            name="alignment"
            value={this.state.alignment}
            onChange={(event) => this.setAlignment(event)}
            disabled={this.state.alignOption}
          >
            <option>Select</option>
            <option value="left aligned">left aligned</option>
            <option value="right aligned">right aligned</option>
          </select>{" "}
          <button className="btn" onClick={this.onEdit} title="Edit">
            {" "}
            <i className="fa fa-edit" />
          </button>
          {!this.state.alignOption ? (
            <button
              className="btn"
              title="Save"
              onClick={() => this.saveAlignment(res)}
            >
              <i className="fa fa-save" />
            </button>
          ) : null}
        </span>
      </span>
    );
  }
}

export default ResultDisplay;
