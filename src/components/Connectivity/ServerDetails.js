import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Button, Card } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import axios from "axios";

function ServerDetails(props) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [ipAddress, setIPAddress] = useState("");
  const [nodeType, setNodeType] = useState("MSC");
  const [visible, setVisibility] = useState(false);
  const [nodeValue, setNodeValue] = useState("");
  const [serverDetails, setServerDetails] = useState([]);
  const [nodeNameArray, setNodeNameArray] = useState([]);
  const [isError, setIsError] = useState(false);
  const [nodeDetails, setNodeDetails] = useState([]);
  const [isExist, setIsExist] = useState(false);
  const [isSave, setSave] = useState(false);
  const mounted = useRef();
  useEffect(() => {
    // if (!mounted.current) {
    //   mounted.current = true;
    // } else {
    //   console.log("updated");
    // }
    // props.nodeInfo.map(node => {
    //   if (props.serverId === node.Server_Id) {
    //     if (nodeType === node.Node_Type) {
    //       nodeNameArray.push(node.Node_Name);
    //     }
    //   }
    // });
    console.log("aray", nodeNameArray);
    console.log(props.serverName + "" + props.serverId);
    axios
      .get("http://localhost:5001/get/connectivity/server-details")
      .then(response => {
        setServerDetails(response.data);
      });

    axios
      .get("http://localhost:5001/get/connectivity/node-details")
      .then(response => {
        setNodeDetails(response.data);
        // response.data.map(node => {
        //   nodeNameArray.push(node.Node_Name);
        // });
        // console.log("aray", nodeNameArray);
      });
  }, []);
  function handleSubmit(e) {
    e.preventDefault();
    console.log(
      "user",
      userName +
        "pass" +
        password +
        "ipaddress" +
        ipAddress +
        "nodetype" +
        nodeType
    );
    console.log("node array", nodeNameArray);
    console.log("server", serverDetails);

    serverDetails.map(server => {
      if (server.Server_Id === props.serverId.toString()) {
        console.log(server);
        if (userName === server.Username) {
          if (password === server.Password) {
            if (ipAddress === server.IPAddress) {
              setIsError(false);
              axios
                .post(
                  "http://localhost:5001/insert/connectivity/node-details",
                  {
                    Server_Id: props.serverId,
                    Node_Name: nodeNameArray,
                    Node_Type: nodeType
                  }
                )
                .then(res => {
                  console.log(res);
                  setSave(true);
                  setUserName("");
                  setPassword("");
                  setIPAddress("");
                  setNodeNameArray([]);
                });
            } else {
              setIsError(true);
            }
          } else {
            setIsError(true);
          }
        } else {
          setIsError(true);
        }
      }
    });
  }

  function onHide() {
    setVisibility(false);
  }

  function addNodeNames() {
    setVisibility(true);
    setNodeValue("");
    console.log("nodedetail", nodeDetails);
  }

  function confirmNodeName() {
    console.log("nodename", nodeValue);
    let alreadyExist = false;
    nodeDetails.map(node => {
      console.log(node);
      if (!alreadyExist) {
        if (node.Node_Name === nodeValue) {
          console.log("inside", node.Node_Name);
          alreadyExist = true;
          setIsExist(true);
        }
      }
    });
    nodeNameArray.map(node1 => {
      if (!alreadyExist) {
        if (node1 === nodeValue) {
          alreadyExist = true;
          setIsExist(true);
        }
      }
    });

    if (!alreadyExist) {
      setIsExist(false);
      nodeNameArray.push(nodeValue);
      onHide();
    }
  }

  function onNodeTypeChange(nodetype) {
    // setNodeNameArray([]);
    // let arr = [];
    // props.nodeInfo.map(node => {
    //   console.log(node);
    //   console.log("nodetype", nodetype);
    //   if (props.serverId === node.Server_Id) {
    //     if (nodetype === node.Node_Type) {
    //       console.log(node);

    //       arr.push(node.Node_Name);
    //       setNodeNameArray(arr);
    //     }
    //   }
    // });
    // console.log("after change", nodeNameArray);
    setNodeType(nodetype);
  }

  const footer = (
    <div>
      <Button onClick={confirmNodeName}>Confirm </Button>
      <Button onClick={onHide}>Cancel </Button>
    </div>
  );

  const displayNodeNames = nodeNameArray.map((name, index) => {
    console.log("in display node");
    return <span key={index}>{name}</span>;
  });

  return (
    <React.Fragment>
      <div style={{ margin: 20, padding: 20, border: "2px solid #D3D3D3" }}>
        {isError ? (
          <p style={{ marginBottom: 10, color: "red" }}>invalid credentials!</p>
        ) : null}
        {isSave ? (
          <p style={{ marginBottom: 10, color: "green", fontWeight: "bold" }}>
            Data Saved!
          </p>
        ) : null}
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Username
            </Form.Label>
            <Col sm={6}>
              <Form.Control
                placeholder="Enter Username"
                required
                type="text"
                onChange={evt => setUserName(evt.target.value)}
                value={userName}
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
                onChange={evt => setPassword(evt.target.value)}
                value={password}
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
                onChange={evt => setIPAddress(evt.target.value)}
                value={ipAddress}
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
                value={nodeType}
                onChange={evt => onNodeTypeChange(evt.target.value)}
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
                  <Button style={{ margin: 10 }} onClick={addNodeNames}>
                    Add
                  </Button>
                </Col>
                <Col sm={2}>
                  <Button style={{ margin: 10 }}>Upload</Button>
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
        visible={visible}
        style={{ width: "30vw" }}
        closable={false}
        footer={footer}
        onHide={onHide}
      >
        {isExist ? (
          <p style={{ marginBottom: 10, color: "red" }}>
            Node Name Already Exist!
          </p>
        ) : null}
        Please enter node name : &nbsp;
        <input
          type="text"
          value={nodeValue}
          onChange={evt => setNodeValue(evt.target.value)}
        />
      </Dialog>
    </React.Fragment>
  );
}

export default ServerDetails;
