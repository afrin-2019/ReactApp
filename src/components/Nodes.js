import React, { Component } from "react";
import SideNavBar from "./SideNavBar";
import { Navbar } from "react-bootstrap";
import LogOut from "./LogOut";
class Nodes extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <SideNavBar />
        <Navbar bg="light" expand="lg">
          <LogOut />
        </Navbar>
      </React.Fragment>
    );
  }
}

export default Nodes;
