import React, { Component } from "react";
import SideNavBar from "../SideNavBar";
import { Navbar } from "react-bootstrap";
import LogOut from "../LogOut";
import NodeTable from "./NodeTable";
import "./node.css";

class Nodes extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <SideNavBar />
        <div id="nodemain">
          <Navbar bg="light" expand="lg">
            <LogOut />
          </Navbar>
          <NodeTable />
        </div>
      </React.Fragment>
    );
  }
}

export default Nodes;
