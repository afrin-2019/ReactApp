import React, { Component } from "react";
import { Form, Row, Col, Button, Card } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import axios from "axios";
import UploadExcel from "./UploadExcel";
class ServerDetailNew extends Component {
  state = {
    userName: "",
    password: "",
    ipAddress: "",
    nodeType: "MSC",
    nodeNameArray: [],
    visible: false,
    nodeValue: "",
    isExist: false,
    isError: false,
    isSave: false,
    newNodeName: [],
    userEntry: this.props.userEntry
  };
  componentDidMount() {
    let server = this.props.serverDetail;
    console.log("mount", this.props.serverDetail);
    this.setState({ userName: server.Username });
    this.setState({ password: server.Password });
    this.setState({ ipAddress: server.IPAddress });
    var arr = [];
    arr = this.showNodeNames();

    this.setState({ nodeNameArray: arr }, () =>
      console.log("nodenames", this.state.nodeNameArray)
    );
  }

  showNodeNames = () => {
    let arr = [];
    this.props.nodeInfo.map(node => {
      if (this.props.serverId === node.Server_Id && node.Node_Type === "MSC") {
        arr.push(node.Node_Name);
      }
    });
    return arr;
  };

  componentWillReceiveProps(nextProps) {
    console.log("receive props", nextProps);
    this.setState({ userEntry: this.props.userEntry });
    if (this.props.serverDetail === nextProps.serverDetail) {
      this.setState({ isSave: false });
      let server = this.props.serverDetail;
      console.log("change", server);
      this.setState({ nodeType: "MSC" });
      this.setState({ userName: server.Username });
      this.setState({ password: server.Password });
      this.setState({ ipAddress: server.IPAddress });
      let arr = [];
      arr = this.showNodeNames();
      this.setState({ nodeNameArray: arr }, () =>
        console.log("nodenames", this.state.nodeNameArray)
      );
    }
  }

  onHide = () => {
    this.setState({ visible: false });
  };

  onNodeTypeChange = nodetype => {
    this.setState({ nodeType: nodetype });

    let arr = [];
    this.props.nodeInfo.map(node => {
      console.log("node", node, "id", node.Server_Id);
      if (
        this.props.serverId === node.Server_Id &&
        node.Node_Type === nodetype
      ) {
        arr.push(node.Node_Name);
      }
    });
    this.setState({ nodeNameArray: arr }, () =>
      console.log("nodenames", this.state.nodeNameArray)
    );
  };
  addNodeNames = () => {
    this.setState({ visible: true });
    this.setState({ nodeValue: "" });
  };

  confirmNodeName = () => {
    let alreadyExist = false;
    this.props.nodeInfo.map(node => {
      console.log(node);
      if (!alreadyExist) {
        if (node.Node_Name === this.state.nodeValue) {
          console.log("inside", node.Node_Name);
          alreadyExist = true;
          this.setState({ isExist: true });
        }
      }
    });
    this.state.nodeNameArray.map(node1 => {
      if (!alreadyExist) {
        if (node1 === this.state.nodeValue) {
          alreadyExist = true;
          this.setState({ isExist: true });
        }
      }
    });

    if (!alreadyExist) {
      this.setState({ isExist: false });
      this.state.nodeNameArray.push(this.state.nodeValue);
      this.state.newNodeName.push(this.state.nodeValue);
      this.setState({ nodeNameArray: this.state.nodeNameArray });
      this.setState({ newNodeName: this.state.newNodeName });
      this.onHide();
    }
  };

  handleSubmit1 = e => {
    e.preventDefault();
    console.log("node array", this.state.nodeNameArray);
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state.userEntry);
    if (this.state.userEntry === "old") {
      let server = this.props.serverDetail;
      if (this.state.userName === server.Username) {
        if (this.state.password === server.Password) {
          if (this.state.ipAddress === server.IPAddress) {
            this.setState({ isError: false });
            axios
              .post("http://localhost:5001/insert/connectivity/node-details", {
                Server_Id: this.props.serverId,
                Node_Name: this.state.newNodeName,
                Node_Type: this.state.nodeType
              })
              .then(res => {
                console.log(res);
                this.setState({ isSave: true });
                // setUserName("");
                // setPassword("");
                // setIPAddress("");
                // setNodeNameArray([]);
              });
          } else {
            this.setState({ isError: true });
          }
        } else {
          this.setState({ isError: true });
        }
      } else {
        this.setState({ isError: true });
      }
    } else if (this.state.userEntry === "New") {
      console.log("new entry");
      console.log(this.state);
      let serverRequest = {
        Server_Name: this.props.serverName,
        Server_Id: this.props.serverId.toString(),
        Username: this.state.userName,
        Password: this.state.password,
        IPAddress: this.state.ipAddress
      };
      axios
        .post(
          "http://localhost:5001/insert/connectivity/server-details",
          serverRequest
        )
        .then(res => {
          console.log(res);
          this.setState({ isSave: true });
          this.setState({ userEntry: "old" });
          console.log("nodearray", this.state.nodeNameArray);
          if (this.state.nodeNameArray.length !== 0) {
            axios
              .post("http://localhost:5001/insert/connectivity/node-details", {
                Server_Id: this.props.serverId,
                Node_Name: this.state.newNodeName,
                Node_Type: this.state.nodeType
              })
              .then(resp => {
                console.log(resp);
              });
          }
        });
    }
  };

  render() {
    const displayNodeNames = this.state.nodeNameArray.map((name, index) => {
      console.log("in display node");
      return <span key={index}>{name}</span>;
    });
    const footer = (
      <div>
        <Button onClick={this.confirmNodeName}>Confirm </Button>
        <Button onClick={this.onHide}>Cancel </Button>
      </div>
    );
    return (
      <React.Fragment>
        <div style={{ margin: 20, padding: 20, border: "2px solid #D3D3D3" }}>
          {this.state.isError ? (
            <p style={{ marginBottom: 10, color: "red" }}>
              invalid credentials!
            </p>
          ) : null}
          {this.state.isSave ? (
            <p style={{ marginBottom: 10, color: "green", fontWeight: "bold" }}>
              Data Saved!
            </p>
          ) : null}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                Username
              </Form.Label>
              <Col sm={6}>
                <Form.Control
                  placeholder="Enter Username"
                  required
                  type="text"
                  onChange={evt =>
                    this.setState({ userName: evt.target.value })
                  }
                  value={this.state.userName}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                Password
              </Form.Label>
              <Col sm={6}>
                <Form.Control
                  placeholder="Enter Password"
                  required
                  type="password"
                  onChange={evt =>
                    this.setState({ password: evt.target.value })
                  }
                  value={this.state.password}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                IP Address
              </Form.Label>
              <Col sm={6}>
                <Form.Control
                  placeholder="Enter IP Address"
                  required
                  onChange={evt =>
                    this.setState({ ipAddress: evt.target.value })
                  }
                  value={this.state.ipAddress}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                List of Nodes
              </Form.Label>
              <Col sm={2}>
                <Form.Control
                  as="select"
                  value={this.state.nodeType}
                  onChange={evt => this.onNodeTypeChange(evt.target.value)}
                >
                  <option value="MSC">MSC</option>
                  <option value="BSC">BSC</option>
                  <option value="MSS">MSS</option>
                  <option value="2G SITE">2G SITE</option>
                  <option value="ENodeB">ENodeB</option>
                  <option value="RNC">RNC</option>
                  <option value="NodeB">NodeB</option>
                </Form.Control>
              </Col>
              <Col sm={4}>
                {/* <Form.Control as="textarea" rows="3" /> */}
                <Card
                  style={{
                    width: "12rem",
                    minHeight: "8rem",
                    maxHeight: "8rem",
                    overflow: "auto"
                  }}
                >
                  {displayNodeNames}
                </Card>
                <Form.Group as={Row}>
                  <Col sm={4}>
                    <Button style={{ margin: 10 }} onClick={this.addNodeNames}>
                      Add
                    </Button>
                  </Col>
                  <Col sm={2}>
                    <UploadExcel />
                  </Col>
                </Form.Group>
              </Col>
            </Form.Group>
            <Row>
              <Col sm={3}></Col>
              <Button type="submit">Save</Button>
            </Row>
          </Form>
        </div>
        <Dialog
          visible={this.state.visible}
          style={{ width: "30vw" }}
          closable={false}
          footer={footer}
          onHide={this.onHide}
        >
          {this.state.isExist ? (
            <p style={{ marginBottom: 10, color: "red" }}>
              Node Name Already Exist!
            </p>
          ) : null}
          Please enter node name : &nbsp;
          <input
            type="text"
            value={this.state.nodeValue}
            onChange={evt => this.setState({ nodeValue: evt.target.value })}
          />
        </Dialog>
      </React.Fragment>
    );
  }
}

export default ServerDetailNew;
