import React, { Component } from "react";
//import { Container, Row, Col, Button } from "react-bootstrap";
import Panel from "./Panel";
import { Navbar } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

class Connectivity extends Component {
  state = {
    visible: false,
    textValue: "",
    category: "Mid",
    addEntry: false,

    items: [
      {
        label: "File",
        icon: "pi pi-fw pi-file",
        command: event => {
          console.log(event.item.label);
        },
        items: [
          {
            label: "New",
            icon: "pi pi-fw pi-plus",
            command: event => {
              console.log(event.item.label);
            },

            items: [
              {
                label: "Bookmark",
                icon: "pi pi-fw pi-bookmark",
                command: event => {
                  console.log(event.item.label);
                }
              },
              {
                label: "Video",
                icon: "pi pi-fw pi-video",
                command: () => {
                  console.log("video clicked");
                }
              }
            ]
          }
        ]
      },
      {
        label: "NextFile",
        icon: "pi pi-fw pi-file"
      }
    ]
  };

  onClick = () => {
    this.setState({ visible: true });
  };

  displayDropdown = () => {
    let option = [];
    let i = 0;
    this.state.items.map(item => {
      i++;
      console.log("i", i);
      option.push(<option key={i}>{item.label}</option>);
      if (item.items) {
        item.items.map(item1 => {
          i++;
          console.log("i", i);
          option.push(<option key={i}>{item1.label}</option>);
          console.log("length", item1.items.length);
          if (item1.items) {
            item1.items.map(item2 => {
              i++;
              console.log("i", i);
              option.push(<option key={i}>{item2.label}</option>);
            });
          }
        });
      }
    });

    return option;
  };

  onHide = () => {
    this.setState({ visible: false });
  };

  onChange = e => {
    this.setState({ textValue: e.target.value });
  };

  onConfirm = () => {
    this.setState({ visible: false });
    this.setState({ addEntry: true }, () => console.log("changed"));
  };
  handleCategoryChange = category => {
    this.setState({ category: category });
  };

  changeEntryStatus = () => {
    this.setState({ addEntry: false });
  };

  render() {
    const footer = (
      <div>
        <Button label="Confirm" onClick={this.onConfirm} />
        <Button label="Cancel" onClick={this.onHide} />
      </div>
    );
    return (
      <div style={{ marginLeft: 200 }}>
        <Navbar bg="light" expand="lg">
          <button onClick={this.onClick}>
            <i className="fa fa-fw fa-plus" style={{ margin: 10 }}></i>
          </button>
        </Navbar>
        <div className="panelbar">
          <Panel
            newEntry={this.state.textValue}
            category={this.state.category}
            addEntry={this.state.addEntry}
            handleEntry={this.changeEntryStatus}
          />
        </div>
        <Dialog
          visible={this.state.visible}
          style={{ width: "40vw" }}
          closable={false}
          footer={footer}
          onHide={this.onHide}
        >
          <input
            type="text"
            value={this.state.textValue}
            onChange={this.onChange}
            style={{ marginRight: 10 }}
          />
          <select
            name="category"
            value={this.state.category}
            onChange={event => this.handleCategoryChange(event.target.value)}
          >
            <option value="New">Add New</option>
            {this.displayDropdown()}
          </select>
        </Dialog>
      </div>
    );
  }
}

export default Connectivity;
