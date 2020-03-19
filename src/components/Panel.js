import React, { Component } from "react";
import data from "./items.json";

import { PanelMenu } from "primereact/panelmenu";

class Panel extends Component {
  constructor() {
    super();
    this.state = {
      //items: data.items
      items: [
        {
          label: "File",
          icon: "pi pi-fw pi-file",
          items: [
            {
              label: "New",
              icon: "pi pi-fw pi-plus",
              items: [
                {
                  label: "Bookmark",
                  icon: "pi pi-fw pi-bookmark"
                },
                {
                  label: "Video",
                  icon: "pi pi-fw pi-video"
                }
              ]
            }
          ]
        }
      ]
    };
  }

  handleNewEntry = () => {
    let newEntry = {};
    if (this.props.category === "Mid") {
      newEntry = Object.assign({
        label: this.props.newEntry,
        icon: "pi pi-fw pi-plus"
      });
    } else {
      newEntry = Object.assign({
        label: this.props.newEntry
      });
    }
    this.state.items.push(newEntry);
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
          model={this.state.items}
          style={{
            width: "300px",
            marginLeft: 20
          }}
        />
        {/* {this.props.addEntry ? this.handleNewEntry : null} */}
      </div>
    );
  }
}

export default Panel;
