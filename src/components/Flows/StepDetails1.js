import React, { Component } from "react";
import ActionTabContent from "./ActionTabContent";
import LinkTabContent from "./LinkTabContent";
import Axios from "axios";

let i = 1;
let linkKey = 0;
let actionKey = 0;
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
    document.getElementById("defaultOpen" + this.props.selectedStep).click();
    console.log("step detail mount", this.props.selectedStep);
    let isContent = false;
    ///this.refresh();
    //this.setContent();
    Axios.get("http://localhost:5001/get/flows/flowContent").then((res) => {
      this.setState({ flowContent: res.data });

      res.data.map((content) => {
        console.log("content", content + ", ", this.props.flowSelected);
        if (content.Flow === this.props.flowSelected) {
          if (content.Step === this.props.selectedStep) {
            if (content.Link.length !== 0) {
              this.setState({ disableLink: false });
              content.Link.map((link, index) => {
                linkKey = index + 1;
                isContent = true;
                this.addLink(index, link);
              });
            } else {
              linkKey = 0;
              let j = -1;
              isContent = true;
              this.setState({
                link_content: [
                  ...this.state.link_content,
                  <LinkTabContent
                    ind={j}
                    key={linkKey}
                    id={linkKey}
                    flowList={this.props.handleFlowList}
                    flowSelected={this.props.flowSelected}
                    linkContent={this.onLinkContent}
                    handleDelete={this.deleteLink}
                    stepNo={this.props.selectedStep}
                    enableAddLink={() => this.enableLinkButton()}
                    attachFlow={(condition, value) =>
                      this.attachFlow(condition, value)
                    }
                    handleEdit={this.editLink}
                    rerender={this.props.rerender}
                  />,
                ],
              });
            }
          }
        }
      });
      if (!isContent) {
        this.onLinkContent();
      }
      //this.addReceiveVariable();
      this.addAction();
      //this.setContent();
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
            key={actionKey}
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
          rerender={this.props.rerender}
          handleEdit={this.editLink}
        />,
      ],
    });
  };

  addReceiveVariable = () => {
    console.log("in add variable");
    Axios.get("http://localhost:5001/get/receivevariable").then((res) => {
      res.data.map((val) => {
        if (val.flowName === this.props.flowSelected) {
          val.variable.map((variable) => {
            actionKey++;
            this.setState({
              content: [
                ...this.state.content,
                <ActionTabContent
                  val={variable}
                  key={actionKey}
                  selectedAction={"5"}
                  id={actionKey}
                  handleDelete={this.deleteAction}
                  flowList={this.props.handleFlowList}
                  flowSelected={this.props.flowSelected}
                  stepNo={this.props.selectedStep}
                  enableAdd={() => this.enableButton()}
                />,
              ],
            });
          });
        }
      });
      this.addAction();
    });
  };

  addAction = () => {
    let action, val, file;
    let isContent = false;
    this.state.flowContent.map((content) => {
      if (content.Flow === this.props.flowSelected) {
        if (content.Step === this.props.selectedStep) {
          if (content.Action.length !== 0) {
            let i = 0,
              j = 0;
            this.setState({ disabled: false });
            content.Action.map((action1, index) => {
              //actionKey = index + 1;
              actionKey++;
              isContent = true;
              if (action1.Type === "Find NodeDetails") {
                action = "1";
                this.setState({
                  content: [
                    ...this.state.content,
                    <ActionTabContent
                      key={actionKey}
                      nId={action1.id}
                      selectedAction={action}
                      id={actionKey}
                      enableAdd={() => this.enableButton()}
                      handleDelete={this.deleteAction}
                      flowList={this.props.handleFlowList}
                      flowSelected={this.props.flowSelected}
                      stepNo={this.props.selectedStep}
                    />,
                  ],
                });
              } else if (action1.Type === "Connect") {
                action = "2";

                this.setState({
                  content: [
                    ...this.state.content,
                    <ActionTabContent
                      key={actionKey}
                      conId={action1.id}
                      selectedAction={action}
                      id={actionKey}
                      enableAdd={() => this.enableButton()}
                      handleDelete={this.deleteAction}
                      flowList={this.props.handleFlowList}
                      flowSelected={this.props.flowSelected}
                      stepNo={this.props.selectedStep}
                    />,
                  ],
                });
              } else if (action1.Type === "Run a Command") {
                action = "3";
                val = action1.Command;
                ++j;
                this.setState({
                  content: [
                    ...this.state.content,
                    <ActionTabContent
                      //cId={j}
                      cId={action1.id}
                      val={val}
                      key={actionKey}
                      selectedAction={action}
                      id={actionKey}
                      handleDelete={this.deleteAction}
                      flowList={this.props.handleFlowList}
                      flowSelected={this.props.flowSelected}
                      stepNo={this.props.selectedStep}
                      enableAdd={() => this.enableButton()}
                    />,
                  ],
                });
              } else if (action1.Type === "Parse the Output") {
                action = "4";
                file = action1.File;
                console.log("in parse", ++i);
                this.setState({
                  content: [
                    ...this.state.content,
                    <ActionTabContent
                      //edId={i}
                      eId={action1.id}
                      editorId={action1.EditorId}
                      file={file}
                      key={actionKey}
                      selectedAction={action}
                      id={actionKey}
                      handleDelete={this.deleteAction}
                      flowList={this.props.handleFlowList}
                      flowSelected={this.props.flowSelected}
                      stepNo={this.props.selectedStep}
                      enableAdd={() => this.enableButton()}
                    />,
                  ],
                });
              } else if (action1.Type === "Receive Variable") {
                this.setState({
                  content: [
                    ...this.state.content,
                    <ActionTabContent
                      rvId={action1.id}
                      val={action1.variable}
                      key={actionKey}
                      selectedAction={"5"}
                      id={actionKey}
                      handleDelete={this.deleteAction}
                      flowList={this.props.handleFlowList}
                      flowSelected={this.props.flowSelected}
                      stepNo={this.props.selectedStep}
                      enableAdd={() => this.enableButton()}
                    />,
                  ],
                });
              } else if (action1.Type === "Add Text Message") {
                this.setState({
                  content: [
                    ...this.state.content,
                    <ActionTabContent
                      mId={action1.id}
                      message={action1.message}
                      key={actionKey}
                      selectedAction={"6"}
                      id={actionKey}
                      handleDelete={this.deleteAction}
                      flowList={this.props.handleFlowList}
                      flowSelected={this.props.flowSelected}
                      stepNo={this.props.selectedStep}
                      enableAdd={() => this.enableButton()}
                    />,
                  ],
                });
              } else if (action1.Type === "Add Json Object") {
                this.setState({
                  content: [
                    ...this.state.content,
                    <ActionTabContent
                      jsonId={action1.id}
                      objMessage={action1.message}
                      key={actionKey}
                      selectedAction={"7"}
                      id={actionKey}
                      handleDelete={this.deleteAction}
                      flowList={this.props.handleFlowList}
                      flowSelected={this.props.flowSelected}
                      stepNo={this.props.selectedStep}
                      enableAdd={() => this.enableButton()}
                    />,
                  ],
                });
              }
            });
          } else {
            isContent = true;
            this.setState({
              content: [
                ...this.state.content,
                <ActionTabContent
                  key={actionKey}
                  enableAdd={() => this.enableButton()}
                  handleDelete={this.deleteAction}
                  id={this.state.btnId}
                  flowList={this.props.handleFlowList}
                  flowSelected={this.props.flowSelected}
                  stepNo={this.props.selectedStep}
                />,
              ],
            });
          }
        }
      }
    });
    if (!isContent) {
      this.addContent();
    }
  };

  openCity = (evt, name) => {
    // Declare all variables
    var i, tabcontent, tablinks;
    var tabcontent1, tabcontent2;
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      let tabId = tabcontent[i].id;
      if (tabId.indexOf(this.props.selectedStep) !== -1) {
        tabcontent[i].style.display = "none";
      }
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      let tabId = tablinks[i].id;
      if (tabId.indexOf(this.props.selectedStep) !== -1) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(name).style.display = "block";
    evt.currentTarget.className += " active";
  };

  addContent = () => {
    this.setState({ disabled: true });
    actionKey++;
    this.setState({ btnId: this.state.btnId + 1 }, () =>
      this.setState({
        content: [
          ...this.state.content,
          <ActionTabContent
            key={actionKey}
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
          handleEdit={this.editLink}
          rerender={this.props.rerender}
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
          handleEdit={this.editLink}
          rerender={this.props.rerender}
        />,
      ],
    });
  };

  deleteAction = (id, action, uId) => {
    //console.log("delete", this.state.content);
    console.log("uid type in delete action", typeof uId);
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
    let type;
    if (action === "1") {
      type = "Find NodeDetails";
    } else if (action === "2") {
      type = "Connect";
    } else if (action === "3") {
      type = "Run a Command";
    } else if (action === "4") {
      type = "Parse the Output";
    } else if (action === "5") {
      type = "Receive Variable";
    } else if (action === "6") {
      type = "Add Text Message";
    } else if (action === "7") {
      type = "Add Json Object";
    }
    request = {
      flowname: this.props.flowSelected,
      stepNo: this.props.selectedStep,
      Type: type,
      id: uId,
    };
    console.log("del req", request);
    Axios.delete("http://localhost:5001/delete/flow/action", {
      data: request,
    }).then((res) => {
      console.log("res", res);
      this.refresh();
    });
    let req1 = {
      flowName: this.props.flowSelected,
      id: this.props.selectedStep + "-" + uId,
    };

    // Axios.delete("http://localhost:5001/delete/receivevariable", {
    //   data: req1,
    // }).then((res) => console.log(res));
  };

  editLink = (id, condition, path, nextstep, oldcondition) => {
    let contentArray = Object.assign([], this.state.link_content);
    contentArray.map((content, index) => {
      console.log("props", content.props.id);
      console.log("id", id);
      if (content.props.id === id) {
        console.log("condition", condition);
        contentArray.splice(
          index,
          1,
          <LinkTabContent
            ind={index}
            key={index}
            id={index}
            flowList={this.props.handleFlowList}
            flowSelected={this.props.flowSelected}
            linkContent={this.onLinkContent}
            handleDelete={this.deleteLink}
            stepNo={this.props.selectedStep}
            condition={condition}
            path={path}
            selectValue={nextstep}
            enableAddLink={() => this.enableLinkButton()}
            attachFlow={(condition, value) => this.attachFlow(condition, value)}
            handleEdit={this.editLink}
            rerender={this.props.rerender}
          />
        );
        console.log(contentArray);
        this.setState({ link_content: contentArray });
        this.props.editFlow(condition, oldcondition);
      }
    });
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
      //this.props.refresh();
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
              onClick={(event) =>
                this.openCity(event, "Action" + this.props.selectedStep)
              }
              id={"defaultOpen" + this.props.selectedStep}
            >
              Action
            </button>
            <button
              className="tablinks"
              onClick={(event) =>
                this.openCity(event, "Link" + this.props.selectedStep)
              }
              id={"linkTab" + this.props.selectedStep}
            >
              Link
            </button>
          </div>

          <div id={"Action" + this.props.selectedStep} className="tabcontent">
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
            {/* {this.state.flowContent.map((content) => {
              if (content.Flow === this.props.flowSelected) {
                if (content.Step === this.props.selectedStep) {
                  if (content.Action.length !== 0) {
                    let i = 0,
                      j = 0;
                    return content.Action.map((action1, index) => {
                      if (
                        action1.Type === "Find NodeDetails" ||
                        action1.Type === "Connect"
                      ) {
                        if (action1.Type === "Find NodeDetails") {
                          action = "1";
                          return (
                            <ActionTabContent
                              key={index}
                              nId={action1.id}
                              selectedAction={action}
                              id={index}
                              enableAdd={() => this.enableButton()}
                              handleDelete={this.deleteAction}
                              flowList={this.props.handleFlowList}
                              flowSelected={this.props.flowSelected}
                              stepNo={this.props.selectedStep}
                            />
                          );
                        } else {
                          action = "2";
                        }
                        return (
                          <ActionTabContent
                            key={index}
                            conId={action1.id}
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
                        ++j;
                        return (
                          <ActionTabContent
                            //cId={j}
                            cId={action1.id}
                            val={val}
                            key={index}
                            selectedAction={action}
                            id={index}
                            handleDelete={this.deleteAction}
                            flowList={this.props.handleFlowList}
                            flowSelected={this.props.flowSelected}
                            stepNo={this.props.selectedStep}
                            enableAdd={() => this.enableButton()}
                          />
                        );
                      } else if (action1.Type === "Parse the Output") {
                        action = "4";
                        file = action1.File;
                        console.log("in parse", ++i);
                        return (
                          <ActionTabContent
                            //edId={i}
                            eId={action1.id}
                            editorId={action1.id}
                            file={file}
                            key={index}
                            selectedAction={action}
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
            })} */}
            {this.state.content}
          </div>

          <div id={"Link" + this.props.selectedStep} className="tabcontent">
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

            {this.state.link_content}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default StepDetails1;
