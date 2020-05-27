import React, { Component } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
class StepDetails extends Component {
  state = {
    key: "action",
    action: ""
  };

  handleActionChange = actionType => {
    this.setState({ action: actionType });
  };
  render() {
    return (
      <div style={{ marginLeft: 400 }}>
        <span style={{ display: "flex", justifyContent: "center" }}>
          {this.props.selectedStep}
        </span>
        <div
          style={{
            margin: 20,
            padding: 20,
            border: "2px solid #D3D3D3"
          }}
        >
          <div
            style={{
              // backgroundColor: "#ADD8E6",
              minHeight: "20rem"
            }}
          >
            <Tabs
              className="myClass"
              activeKey={this.state.key}
              onSelect={k => this.setState({ key: k })}
            >
              <Tab
                eventKey="action"
                title="Action"
                style={{
                  margin: 10,
                  display: "flex",
                  justifyContent: "center"
                  //backgroundColor: "white",
                  //color: "black"
                }}
              >
                Select an action:&nbsp;
                <select
                  name="action"
                  value={this.state.action}
                  onChange={event =>
                    this.handleActionChange(event.target.value)
                  }
                >
                  <option value="1">Find NodeType</option>
                  <option value="2">Find Connectivity</option>
                  <option value="3">Connect</option>
                  <option value="4">Run a command</option>
                  <option value="5">Parse the output</option>
                </select>
              </Tab>

              <Tab eventKey="link" title="Link" />
            </Tabs>
            {/* <Tabs
              activeKey={this.state.key}
              onSelect={k => this.setState({ key: k })}
            >
              <Tab eventKey="action" title="Action">
                <div
                  style={{
                    //margin: 10,
                    display: "flex",
                    justifyContent: "center",
                    //backgroundColor: "white",
                    color: "black"
                  }}
                >
                  Select an action:&nbsp;
                  <select
                    name="action"
                    value={this.state.action}
                    onChange={event =>
                      this.handleActionChange(event.target.value)
                    }
                  >
                    <option value="1">Find NodeType</option>
                    <option value="2">Find Connectivity</option>
                    <option value="3">Connect</option>
                    <option value="4">Run a command</option>
                    <option value="5">Parse the output</option>
                  </select>
                </div>
              </Tab>
              <Tab
                eventKey="link"
                title="Link"
                style={{
                  // backgroundColor: "white",
                  color: "black"
                }}
              >
                {this.state.key}
              </Tab>
            </Tabs>*/}
          </div>
        </div>
      </div>
    );
  }
}

export default StepDetails;
