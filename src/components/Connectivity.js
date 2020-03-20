import React, { Component } from "react";
//import { Container, Row, Col, Button } from "react-bootstrap";
import Panel from "./Panel";
import { Navbar } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
let valuetoReturn = [];
let option = [];
class Connectivity extends Component {
  state = {
    visible: false,
    textValue: "",
    category: "Add New",
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
    this.setState({ textValue: "" });
  };

  displayDropdown = () => {
    let option = [];
    let i = 0;
    this.state.items.map(item => {
      i++;
      option.push(
        <option key={i} value={item.label}>
          {item.label}
        </option>
      );
      if (item.items) {
        item.items.map(item1 => {
          i++;
          option.push(
            <option key={i} value={item1.label}>
              {item1.label}
            </option>
          );

          if (item1.items) {
            item1.items.map(item2 => {
              i++;
              option.push(
                <option key={i} value={item2.label}>
                  {item2.label}
                </option>
              );
              if (item2.items) {
                item1.items.map(item2 => {
                  i++;
                  option.push(
                    <option key={i} value={item2.label}>
                      {item2.label}
                    </option>
                  );
                });
              }
            });
          }
        });
      }
    });

    return option;
  };

  // displayDropdown = () => {
  //   // let option = [];
  //   let returnValue;
  //   let i = 0;
  //   this.state.items.map(item => {
  //     i++;
  //     console.log("in display", item);
  //     option.push(
  //       <option key={i} value={item.label}>
  //         {item.label}
  //       </option>
  //     );

  //     returnValue = this.recursiveDisplayDropdown(item, i);
  //     // option.push(returnValue);
  //   });
  //   return returnValue;
  // };

  // recursiveDisplayDropdown = (item, i) => {
  //   if (item.items) {
  //     item.items.map(item1 => {
  //       i++;
  //       option.push(
  //         <option key={i} value={item1.label}>
  //           {item1.label}
  //         </option>
  //       );
  //       this.recursiveDisplayDropdown(item1, i);
  //     });
  //   }
  //   return option;
  // };

  onHide = () => {
    this.setState({ visible: false });
  };

  onChange = e => {
    this.setState({ textValue: e.target.value });
  };

  onConfirm = () => {
    this.setState({ visible: false });
    this.setState({ addEntry: true });
  };
  handleCategoryChange = category => {
    this.setState({ category: category });
  };

  changeEntryStatus = () => {
    this.setState({ addEntry: false });
  };

  addItems = item => {
    if (this.state.category === "Add New") {
      let newItemList = [...this.state.items, item];
      this.setState({ items: newItemList });
    } else {
      this.state.items.map(itemList => {
        this.recursiveSearch(itemList, item);
      });
    }
  };

  recursiveSearch = (itemList, item) => {
    console.log("in recursive search", itemList);
    if (itemList.label === this.state.category) {
      if (!itemList.items) {
        Object.assign(itemList, { items: [] });
      }
      itemList.items = [...itemList.items, item];
      console.log("newItemList", this.state.items);
      this.setState({ items: this.state.items });
    } else if (itemList.items) {
      console.log("in else");
      itemList.items.map(item1 => {
        this.recursiveSearch(item1, item);
      });
    }
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
            itemList={this.state.items}
            newEntry={this.state.textValue}
            category={this.state.category}
            addEntry={this.state.addEntry}
            handleEntry={this.changeEntryStatus}
            handleNewEntry={this.addItems}
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
            <option value="Add New">Add New</option>
            {this.displayDropdown()}
          </select>
        </Dialog>
      </div>
    );
  }
}

export default Connectivity;
