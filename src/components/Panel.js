import React, { Component } from "react";
import data from "./items.json";

import { PanelMenu } from "primereact/panelmenu";

class Panel extends Component {
  constructor() {
    super();
    this.state = {};
  }

  handleNewEntry = () => {
    let newEntry = {};
    if (this.props.category === "Add New") {
      newEntry = Object.assign({
        label: this.props.newEntry,
        icon: "pi pi-fw pi-plus"
      });
    } else {
      newEntry = Object.assign({
        label: this.props.newEntry
      });
    }

    this.props.handleNewEntry(newEntry);
  };
  componentDidUpdate() {
    if (this.props.addEntry) {
      this.handleNewEntry();
      this.props.handleEntry();
    }
  }

  render() {
    return (
      <div className="content-section implementation">
        <PanelMenu
          model={this.props.itemList}
          style={{
            width: "300px",
            marginLeft: 20
          }}
        />
      </div>
    );
  }
}

export default Panel;
