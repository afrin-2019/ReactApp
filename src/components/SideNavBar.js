import React from "react";
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
        <a href="/">
          <i className="fa fa-fw fa-clipboard" style={{ margin: 10 }}></i>
          Dashboard
        </a>
        <a href="/connectivity">
          <i className="fa fa-fw fa-link" style={{ margin: 10 }}></i>
          Connectivity
        </a>
        <a href="/flows">
          <i className="fa fa-fw fa-arrows-h" style={{ margin: 10 }}></i> Flows
        </a>
        <a href="/nodes">
          <i className="fa fa-fw fa-laptop" style={{ margin: 10 }} />
          Nodes
        </a>
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
