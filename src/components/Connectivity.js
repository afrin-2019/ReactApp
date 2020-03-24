import React, { Component } from "react";
//import { Container, Row, Col, Button } from "react-bootstrap";
import Panel from "./Panel";
import { Navbar } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import ContextMenu from "react-context-menu";
import DeleteDialog from "./DeleteDialog";

class Connectivity extends Component {
  state = {
    visible: false,
    textValue: "",
    category: "Add New",
    addEntry: false,
    items: [
      {
        label: "Level1",
        icon: "pi pi-fw pi-plus"
      },
      {
        label: "Level2",
        icon: "pi pi-fw pi-plus"
      }
    ],
    deleteDialog: false
  };

  updateItems = item => {
    this.setState({ items: item });
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
            <option key={i} value={item.label / item1.label}>
              {item.label}/{item1.label}
            </option>
          );

          if (item1.items) {
            item1.items.map(item2 => {
              i++;
              option.push(
                <option key={i} value={item.label / item1.label / item2.label}>
                  &nbsp;&nbsp;{item2.label}
                </option>
              );
              if (item2.items) {
                item2.items.map(item3 => {
                  i++;
                  option.push(
                    <option
                      key={i}
                      value={
                        item.label / item1.label / item2.label / item3.label
                      }
                    >
                      &nbsp;&nbsp;&nbsp;{item3.label}
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

  checkUniqueness = (itemName, newItem) => {
    console.log("in check", itemName.label, "newitem" + newItem.label);
    let isExist = false;
    if (itemName.label === newItem.label) {
      isExist = true;
      return isExist;
    }
    if (itemName.items) {
      itemName.items.map(nextItem => {
        this.checkUniqueness(nextItem.label, newItem.label);
      });
    }
    console.log("exist", isExist);
    return isExist;
  };

  addItems = item => {
    let itemExist = false;

    // var index = this.state.items.findIndex(
    //   x => x.label === this.state.category
    // );
    // if (index === -1) {
    //   this.state.items.map(item => {
    //     console.log("check", item);
    //     if (item.items) {
    //       var index1 = item.items.findIndex(
    //         y => y.label === this.state.category
    //       );
    //       console.log("index1", index1);
    //     }
    //   });
    // }
    console.log("category", this.state.category);
    if (this.state.category === "Add New") {
      this.checkUniqueness(this.state.items, item);
    }
    this.state.items.map(itemName => {
      if (!itemExist) itemExist = this.checkUniqueness(itemName, item);
      console.log("item exist", itemExist);
    });
    if (itemExist) {
      alert("already Exist");
    } else {
      if (this.state.category === "Add New") {
        let newItemList = [...this.state.items, item];
        this.setState({ items: newItemList });
      } else {
        this.state.items.map(itemList => {
          this.recursiveSearch(itemList, item);
        });
      }
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

  handleDelete = () => {
    this.setState({ deleteDialog: true });
  };

  closeDeleteDialog = () => {
    this.setState({ deleteDialog: false });
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
          <div>
            <button onClick={this.onClick}>
              <i className="fa fa-fw fa-plus" style={{ margin: 10 }}></i>
            </button>
            <button style={{ marginLeft: 10 }} onClick={this.handleDelete}>
              <i className="fa fa-fw fa-trash" style={{ margin: 10 }}></i>
            </button>
          </div>
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
        {this.state.deleteDialog ? (
          <DeleteDialog
            onHide={this.closeDeleteDialog}
            displayDropdown={this.displayDropdown}
            panelMenu={this.state.items}
            updateItem={this.updateItems}
          />
        ) : null}
      </div>
    );
  }
}

export default Connectivity;
