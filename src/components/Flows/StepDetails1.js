import React, { Component } from "react";
import ActionTabContent from "./ActionTabContent";
import LinkTabContent from "./LinkTabContent";
import Axios from "axios";
let i = 1;
let linkKey;
//let enable = false;
class StepDetails1 extends Component {
  state = {
    btnId: 1,
    link_content: [],
    content: [],
    flowContent: [],
    disabled: true,
    disableLink: true,
  };

  componentDidMount() {
    document.getElementById("defaultOpen").click();
    console.log("step detail mount");
    ///this.refresh();
    //this.setContent();
    Axios.get("http://localhost:5001/get/flows/flowContent").then((res) => {
      this.setState({ flowContent: res.data });

      res.data.map((content) => {
        console.log("content", content + ", ", this.props.flowSelected);
        if (content.Flow === this.props.flowSelected) {
          if (content.Step === this.props.selectedStep) {
            if (content.Link.length !== 0) {
              content.Link.map((link, index) => {
                linkKey = index + 1;
                this.addLink(index, link);
              });
            }
          }
        } else {
          linkKey = 0;
        }
      });
      this.setContent();
    });
  }

  refresh = () => {
    Axios.get("http://localhost:5001/get/flows/flowContent").then((res) => {
      console.log("flow content", res.data);
      this.setState({ flowContent: res.data });
    });
  };

  setContent = () => {
    this.setState(
      {
        content: [
          ...this.state.content,
          <ActionTabContent
            key={this.state.btnId}
            enableAdd={() => this.enableButton()}
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
    let j = -1;
    this.setState({
      link_content: [
        ...this.state.link_content,
        <LinkTabContent
          ind={j}
          // key={1}
          // id={1}
          key={linkKey}
          id={linkKey}
          flowList={this.props.handleFlowList}
          flowSelected={this.props.flowSelected}
          linkContent={this.onLinkContent}
          handleDelete={this.deleteLink}
          stepNo={this.props.selectedStep}
          enableAddLink={() => this.enableLinkButton()}
          attachFlow={(condition, value) => this.attachFlow(condition, value)}
        />,
      ],
    });
  };

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
    this.setState({ disabled: true });
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
            enableAdd={() => this.enableButton()}
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
    this.setState({ disableLink: true });
    this.props.disableAttach();
    i++;
    linkKey++;
    let j = -1;
    this.setState({
      link_content: [
        ...this.state.link_content,
        <LinkTabContent
          ind={j}
          // key={i}
          // id={i}
          key={linkKey}
          id={linkKey}
          flowList={this.props.handleFlowList}
          flowSelected={this.props.flowSelected}
          linkContent={this.onLinkContent}
          handleDelete={this.deleteLink}
          stepNo={this.props.selectedStep}
          enableAddLink={() => this.enableLinkButton()}
          attachFlow={(condition, value) => this.attachFlow(condition, value)}
        />,
      ],
    });
  };

  addLink = (index, link) => {
    console.log("in add link");
    this.setState({
      link_content: [
        ...this.state.link_content,

        <LinkTabContent
          ind={index}
          key={index}
          id={index}
          flowList={this.props.handleFlowList}
          flowSelected={this.props.flowSelected}
          linkContent={this.onLinkContent}
          handleDelete={this.deleteLink}
          stepNo={this.props.selectedStep}
          condition={link.Condition}
          path={link.NextStep.path}
          selectValue={link.NextStep.name}
          enableAddLink={() => this.enableLinkButton()}
          attachFlow={(condition, value) => this.attachFlow(condition, value)}
        />,
      ],
    });
  };

  deleteAction = (id, action, value) => {
    //console.log("delete", this.state.content);

    let contentArray = Object.assign([], this.state.content);
    console.log("contentArray", contentArray);
    contentArray.map((content, index) => {
      console.log("content in delete", content.props.id);
      if (content.props.id === id) {
        contentArray.splice(index, 1);
        this.setState({ content: contentArray }, () =>
          console.log("after delete")
        );
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
      }).then((res) => {
        console.log("res", res);
        this.refresh();
        //this.setContent();
      });
    } else if (action === "4") {
      request = {
        flowname: this.props.flowSelected,
        stepNo: this.props.selectedStep,
        Type: "Parse the Output",
        File: value,
      };
      Axios.delete("http://localhost:5001/delete/flow/action", {
        data: request,
      }).then((res) => {
        console.log("res", res);
        this.refresh();
        //this.setContent();
      });
    }
  };

  deleteLink = (id, condition, step) => {
    let contentArray = Object.assign([], this.state.link_content);
    console.log("in delete link", this.state.link_content);
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
    console.log("del req", request);
    Axios.delete("http://localhost:5001/delete/flow/link", {
      data: request,
    }).then((res) => {
      console.log("res", res);
      this.refresh();
      this.props.refresh();
      this.props.deleteFlow(request);

      //this.setContent();
    });
  };

  enableButton = () => {
    //console.log("enabled");
    this.setState({ disabled: false });
  };

  enableLinkButton = () => {
    //console.log("enabled");
    this.setState({ disableLink: false });
  };

  attachFlow = (condition, value) => {
    //console.log("in step attach", value);
    this.props.attachFlow(condition, value);
  };
  render() {
    // console.log("content", this.state.content);
    // console.log("flow content", this.state.flowContent);
    // console.log("prop in step detail", this.props);
    let action, val, file;
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
                //zIndex: 100,
              }}
            >
              <button
                // id={this.state.btnId}
                onClick={this.addContent}
                className="btn btn-sm btn-outline-secondary m-2"
                title="Add action"
                disabled={this.state.disabled}
              >
                <i className="fa fa-plus" style={{ margin: 1 }}></i>
              </button>
            </div>
            {this.state.flowContent.map((content) => {
              if (content.Flow === this.props.flowSelected) {
                if (content.Step === this.props.selectedStep) {
                  if (content.Action.length !== 0) {
                    return content.Action.map((action1, index) => {
                      if (
                        action1.Type === "Find NodeDetails" ||
                        action1.Type === "Connect"
                      ) {
                        if (action1.Type === "Find NodeDetails") {
                          action = "1";
                        } else {
                          action = "2";
                        }
                        return (
                          <ActionTabContent
                            key={index}
                            selectedAction={action}
                            id={index}
                            enableAdd={() => this.enableButton()}
                            handleDelete={this.deleteAction}
                            flowList={this.props.handleFlowList}
                            flowSelected={this.props.flowSelected}
                            stepNo={this.props.selectedStep}
                          />
                        );
                      } else if (action1.Type === "Run a Command") {
                        action = "3";
                        val = action1.Command;
                        return (
                          <ActionTabContent
                            key={index}
                            selectedAction={action}
                            val={val}
                            id={index}
                            enableAdd={() => this.enableButton()}
                            handleDelete={this.deleteAction}
                            flowList={this.props.handleFlowList}
                            flowSelected={this.props.flowSelected}
                            stepNo={this.props.selectedStep}
                          />
                        );
                      } else if (action1.Type === "Parse the Output") {
                        action = "4";
                        file = action1.File;
                        return (
                          <ActionTabContent
                            key={index}
                            selectedAction={action}
                            file={file}
                            id={index}
                            handleDelete={this.deleteAction}
                            flowList={this.props.handleFlowList}
                            flowSelected={this.props.flowSelected}
                            stepNo={this.props.selectedStep}
                            enableAdd={() => this.enableButton()}
                          />
                        );
                      } else if (action1.Type === "Find NodeDetails") {
                        action = "1";
                      } else if (action1.Type === "Connect") {
                        action = "2";
                      }
                    });
                  }
                }
              }
            })}
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
                disabled={this.state.disableLink}
              >
                <i className="fa fa-plus" style={{ margin: 1 }}></i>
              </button>
            </div>
            {/* {this.state.flowContent.map((content) => {
              console.log("content", content + ", ", this.props.flowSelected);
              if (content.Flow === this.props.flowSelected) {
                if (content.Step === this.props.selectedStep) {
                  if (content.Link.length !== 0) {
                    return content.Link.map((link, index) => {
                      //console.log("link", link, "index", index);
                      this.addLink(index, link);
                      // return (
                      //   <LinkTabContent
                      //     ind={index}
                      //     key={index}
                      //     id={index}
                      //     flowList={this.props.handleFlowList}
                      //     flowSelected={this.props.flowSelected}
                      //     linkContent={this.onLinkContent}
                      //     handleDelete={this.deleteLink}
                      //     stepNo={this.props.selectedStep}
                      //     condition={link.Condition}
                      //     path={link.NextStep.path}
                      //     selectValue={link.NextStep.name}
                      //     enableAddLink={() => this.enableLinkButton()}
                      //     attachFlow={(condition, value) =>
                      //       this.attachFlow(condition, value)
                      //     }
                      //   />
                      // );
                    });
                  }
                }
              }
            })} */}
            {this.state.link_content}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default StepDetails1;
