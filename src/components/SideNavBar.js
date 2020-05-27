import React from "react";
import { Link } from "react-router-dom";
//import Sidebar from "react-sidebar";
//import { Navbar } from "react-bootstrap";
class SideNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //sidebarOpen: true
    };
  }

  // onSetSidebarOpen = open => {
  //   this.setState({ sidebarOpen: open });
  // };

  render() {
    const content = (
      <div>
        <Link to="/dashboard">
          <i className="fa fa-fw fa-clipboard" style={{ margin: 10 }}></i>
          Dashboard
        </Link>

        {/* <a href="/connectivity"> */}

        <Link to="/connectivity">
          <i className="fa fa-fw fa-link" style={{ margin: 10 }}></i>
          Connectivity
        </Link>

        {/* </a> */}
        {/* <a href="/flows"> */}

        <Link to="/flows">
          <i className="fa fa-fw fa-arrows-h" style={{ margin: 10 }}></i> Flows
        </Link>

        {/* </a> */}
        {/* <a href="/nodes"> */}

        <Link to="/nodes">
          <i className="fa fa-fw fa-laptop" style={{ margin: 10 }} />
          Nodes{" "}
        </Link>

        {/* </a> */}
      </div>
    );
    return (
      <div className="sidebar">
        {/* <Navbar bg="white" expand="lg"></Navbar>
        <Sidebar
          sidebar={content}
          open={this.state.sidebarOpen}
          onSetOpen={this.onSetSidebarOpen}
          styles={{ sidebar: { background: "white", width: 200 } }}
        >
          <button onClick={() => this.onSetSidebarOpen(true)}>☰</button>
        </Sidebar> */}
        {content}
      </div>
    );
  }
}

export default SideNavBar;
