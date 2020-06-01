import React, { Component } from "react";
import ActionTabContent from "./ActionTabContent";
import LinkTabContent from "./LinkTabContent";
import Axios from "axios";
let i = 1;
//let enable = false;
class StepDetails1 extends Component {
  state = {
    btnId: 1,
    link_content: [],
    content: [],
  };

  componentDidMount() {
    document.getElementById("defaultOpen").click();
    this.setState(
      {
        content: [
          ...this.state.content,
          <ActionTabContent
            key={this.state.btnId}
            //enable={this.enableButton}
            handleDelete={this.deleteAction}
            id={this.state.btnId}
            flowList={this.props.handleFlowList}
            flowSelected={this.props.flowSelected}
            stepNo={this.props.selectedStep}
          />,
        ],
      }
      //   () => {
      //     document.getElementById(1).disabled = true;
      //   }
    );

    this.setState({
      link_content: [
        ...this.state.link_content,
        <LinkTabContent
          key={1}
          id={1}
          flowList={this.props.handleFlowList}
          flowSelected={this.props.flowSelected}
          linkContent={this.onLinkContent}
          handleDelete={this.deleteLink}
          stepNo={this.props.selectedStep}
        />,
      ],
    });
  }

  openCity = (evt, name) => {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";
  };

  addContent = () => {
    this.setState({ btnId: this.state.btnId + 1 }, () =>
      this.setState({
        content: [
          ...this.state.content,
          <ActionTabContent
            key={this.state.btnId}
            id={this.state.btnId}
            //enable={this.enableButton}
            handleDelete={this.deleteAction}
            flowList={this.props.handleFlowList}
            flowSelected={this.props.flowSelected}
            stepNo={this.props.selectedStep}
          />,
        ],
      })
    );
  };

  //   enableButton = () => {
  //     if (!enable) {
  //       console.log("enable", this.state.enable);
  //       document.getElementById(1).disabled = false;
  //       enable = true;
  //     }
  //   };

  onLinkContent = () => {
    i++;
    this.setState({
      link_content: [
        ...this.state.link_content,
        <LinkTabContent
          key={i}
          id={i}
          flowList={this.props.handleFlowList}
          flowSelected={this.props.flowSelected}
          linkContent={this.onLinkContent}
          handleDelete={this.deleteLink}
          stepNo={this.props.selectedStep}
        />,
      ],
    });
  };

  deleteAction = (id, action, value) => {
    let contentArray = Object.assign([], this.state.content);
    contentArray.map((content, index) => {
      if (content.props.id === id) {
        contentArray.splice(index, 1);
        this.setState({ content: contentArray });
      }
    });
    let request = {};
    if (action === "3") {
      request = {
        flowname: this.props.flowSelected,
        stepNo: this.props.selectedStep,
        Type: "Run a Command",
        Command: value,
      };
      Axios.delete("http://localhost:5001/delete/flow/action", {
        data: request,
      }).then((res) => console.log("res", res));
    } else if (action === "4") {
      request = {
        flowname: this.props.flowSelected,
        stepNo: this.props.selectedStep,
        Type: "Parse the Output",
        File: value,
      };
      Axios.delete("http://localhost:5001/delete/flow/action", {
        data: request,
      }).then((res) => console.log("res", res));
    }
  };

  deleteLink = (id, condition, step) => {
    let contentArray = Object.assign([], this.state.link_content);
    contentArray.map((content, index) => {
      console.log("props", content.props.id);
      console.log("id", id);
      if (content.props.id === id) {
        contentArray.splice(index, 1);
        this.setState({ link_content: contentArray });
      }
    });
    let request = {};
    request = {
      flowname: this.props.flowSelected,
      stepNo: this.props.selectedStep,
      condition: condition,
      step: step,
    };
    Axios.delete("http://localhost:5001/delete/flow/link", {
      data: request,
    }).then((res) => console.log("res", res));
  };
  render() {
    console.log("content", this.state.content);
    return (
      <React.Fragment>
        <div
          style={{
            margin: 5,
            padding: 5,
            border: "2px solid #D3D3D3",
            fontSize: 12,
          }}
        >
          <div className="tab">
            <button
              className="tablinks"
              onClick={(event) => this.openCity(event, "Action")}
              id="defaultOpen"
            >
              Action
            </button>
            <button
              className="tablinks"
              onClick={(event) => this.openCity(event, "Link")}
            >
              Link
            </button>
          </div>

          <div id="Action" className="tabcontent">
            <div
              style={{
                position: "-webkit-sticky",
                position: "sticky",
                top: 0,
              }}
            >
              <button
                // id={this.state.btnId}
                onClick={this.addContent}
                className="btn btn-sm btn-outline-secondary m-2"
                title="Add action"
              >
                <i className="fa fa-plus" style={{ margin: 1 }}></i>
              </button>
            </div>
            {this.state.content}
          </div>

          <div id="Link" className="tabcontent">
            <div
              style={{
                position: "-webkit-sticky",
                position: "sticky",
                top: 0,
              }}
            >
              <button
                className="btn btn-sm btn-outline-secondary m-2 "
                onClick={this.onLinkContent}
                title="Add Link"
              >
                <i className="fa fa-plus" style={{ margin: 1 }}></i>
              </button>
            </div>
            {this.state.link_content}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default StepDetails1;
