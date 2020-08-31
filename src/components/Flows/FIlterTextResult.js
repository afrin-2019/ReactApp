import React, { Component } from "react";
import Axios from "axios";

class FilterTextResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: this.props.filterText,
      delimiter: this.props.delimiter,
      wordPosition: this.props.wordPosition,
      disabled: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ filterText: nextProps.filterText });
    this.setState({ delimiter: nextProps.delimiter });
    this.setState({ wordPosition: nextProps.wordPosition });
  }

  handleFilterText = (e) => {
    this.setState({ disabled: false });
    this.setState({ filterText: e.target.value });
  };

  handleDelimiter = (e) => {
    this.setState({ disabled: false });
    this.setState({ delimiter: e.target.value });
  };

  handleWordPosition = (e) => {
    this.setState({ disabled: false });
    this.setState({ wordPosition: e.target.value });
  };

  onSave = () => {
    let request = {
      editorId: this.props.id,
      result: this.props.result,
      filterText: this.state.filterText,
      delimiter: this.state.delimiter,
      wordPosition: this.state.wordPosition,
    };
    console.log("req", request);
    Axios.put("http://localhost:5001/update/flows/editorContent/filterValue", {
      data: request,
    }).then((response) => {
      console.log(response);
      this.setState({ disabled: true });
    });
  };

  render() {
    let res = this.props.result;
    return (
      <span style={{ position: "relative" }}>
        <button
          className="btn"
          style={style.savebtn}
          title="Save"
          onClick={this.onSave}
          disabled={this.state.disabled}
        >
          <i className="fa fa-save" />
        </button>
        <span>Condition : &nbsp; {res.condition}</span>
        <br />
        <span>Text : &nbsp;{res.text}</span>
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
          Filter Text : &nbsp;
          <input
            style={style.input}
            //id={"filter" + this.props.index}
            type="text"
            value={this.state.filterText}
            onChange={this.handleFilterText}
          />
        </span>
        <br />
        <span>
          {" "}
          Delimiter : &nbsp;
          <input
            style={style.input}
            //id={"delimiter" + this.props.index}
            type="text"
            value={this.state.delimiter}
            onChange={this.handleDelimiter}
          />
        </span>
        <br />
        <span>
          {" "}
          Word Position : &nbsp;
          <input
            style={style.input}
            //id={"wordposition" + this.props.index}
            type="text"
            value={this.state.wordPosition}
            onChange={this.handleWordPosition}
          />
        </span>
      </span>
    );
  }
}

const style = {
  input: {
    margin: 2,
    width: 150,
    // height: 20,
  },
  savebtn: {
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 10,
  },
};

export default FilterTextResult;
