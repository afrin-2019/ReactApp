import React, { Component } from "react";
//import { Container, Row, Col, Button } from "react-bootstrap";
import Panel from "./Panel";
import { Navbar } from "react-bootstrap";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import DeleteDialog from "./DeleteDialog";
import axios from "axios";
import ServerDetails from "./ServerDetails";

class Connectivity extends Component {
  state = {
    visible: false,
    textValue: "",
    category: "Add New",
    addEntry: false,
    openDialog: false,
    showLevel: false,
    showServer: false,
    serverDetails: false,
    serverName: "",
    items: [
      {
        label: "Level1",
        items: [
          {
            label: "Level1a",
            items: [
              {
                label: "Level1aa",
                command: event => {
                  this.showServerDetails(event.item.label);
                  // console.log(event.item.label);
                }
              }
            ]
          },
          {
            label: "Level1b",
            items: []
          }
        ]
      },
      {
        label: "Level2",
        items: [
          {
            label: "Level1a",
            items: []
          }
        ]
      },
      {
        label: "Level3",
        items: []
      }
    ],
    options: [
      {
        label: "New Server",
        icon: "fa fa-fw fa-server",
        command: () => {
          this.onaddNewServer();
        }
      },
      {
        label: "New Level",
        icon: "fa fa-fw fa-level-down",
        command: () => {
          this.onaddNewLevel();
        }
      }
    ],
    deleteDialog: false
  };

  // componentDidMount() {
  //   this.refreshPanelMenu();
  // }

  // refreshPanelMenu = () => {
  //   axios.get("http://localhost:5001/get/connectivity/item").then(response => {
  //     console.log("res", response.data);
  //     this.setState({ items: response.data });
  //   });
  // };

  showServerDetails = server => {
    this.setState({ serverName: server });
    this.setState({ serverDetails: true });
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
    let j = 0,
      k = 0,
      l = 0;
    this.state.items.map(item => {
      i++;
      option.push(
        <option key={i} value={j}>
          {item.label}
        </option>
      );
      k = 0;
      if (item.items) {
        item.items.map(item1 => {
          i++;
          option.push(
            <option key={i} value={j + "," + k}>
              &nbsp;{item.label}/{item1.label}
            </option>
          );
          l = 0;

          if (item1.items) {
            item1.items.map(item2 => {
              i++;
              option.push(
                <option key={i} value={j + "," + k + "," + l}>
                  &nbsp;&nbsp;{item.label}/{item1.label}/{item2.label}
                </option>
              );
              l++;
            });
          }
          k++;
        });
      }
      j++;
    });

    return option;
  };

  addServerDropdown = () => {
    let option = [];
    let i = 0;
    let j = 0,
      k = 0,
      l = 0;
    this.state.items.map(item => {
      console.log("item", item);
      if (item.items) {
        i++;
        option.push(
          <option key={i} value={j}>
            {item.label}
          </option>
        );

        k = 0;
        if (item.items) {
          item.items.map(item1 => {
            console.log("inner item", item1);
            if (item1.items) {
              i++;
              option.push(
                <option key={i} value={j + "," + k}>
                  &nbsp;{item.label}/{item1.label}
                </option>
              );
              k++;
            }
          });
        }
      }
      j++;
    });
    return option;
  };

  addLevelDropdown = () => {
    let option = [];
    let i = 0,
      j = 0;
    this.state.items.map(item => {
      i++;
      option.push(
        <option key={i} value={j}>
          {item.label}
        </option>
      );
      j++;
    });
    return option;
  };

  // onHide = () => {
  //   this.setState({ visible: false });
  // };
  onHide1 = () => {
    this.setState({ openDialog: false });
  };

  onaddNewLevel = () => {
    this.setState({ openDialog: true });
    this.setState({ category: "Add New" });
    this.setState({ textValue: "" });
    this.setState({ showServer: false });
    this.setState({ showLevel: true });
  };

  onaddNewServer = () => {
    this.setState({ openDialog: true });
    this.setState({ category: "0" });
    this.setState({ textValue: "" });
    this.setState({ showLevel: false });
    this.setState({ showServer: true });
  };

  onConfirmDialog = () => {
    if (this.state.textValue === "") {
      alert("Please enter value");
    } else {
      this.setState({ openDialog: false });
      this.setState({ addEntry: true });
    }
  };

  onChange = e => {
    this.setState({ textValue: e.target.value });
  };

  // onConfirm = () => {
  //   this.setState({ visible: false });
  //   this.setState({ addEntry: true });
  // };
  handleCategoryChange = category => {
    this.setState({ category: category });
  };

  changeEntryStatus = () => {
    this.setState({ addEntry: false });
  };

  checkUniqueness = (itemList, newItem) => {
    let isExist = false;
    itemList.map(item => {
      if (!isExist) {
        if (item.label === newItem.label) {
          console.log("true", item.label);
          isExist = true;
        } else {
          console.log("false", item.label);
          isExist = false;
        }
      }
    });
    return isExist;
  };

  // addItems = item => {
  //   let isExist = false;
  //   if (this.state.category === "Add New") {
  //     console.log("new", item);
  //     isExist = this.checkUniqueness(this.state.items, item);
  //     if (isExist) {
  //       alert("already Exist");
  //     } else {
  //       Object.assign(item, { items: [] });
  //       let newItemList = [...this.state.items, item];
  //       this.setState({ items: newItemList });
  //     }
  //   } else {
  //     console.log("category", this.state.category);
  //     var position = this.state.category.split(",");
  //     console.log("pos", position);
  //     var uniquecheckArray = [];
  //     if (position.length === 1) {
  //       uniquecheckArray.push(this.state.items[position[0]]);
  //     } else if (position.length === 2) {
  //       uniquecheckArray.push(this.state.items[position[0]].items[position[1]]);
  //     } else if (position.length === 3) {
  //       uniquecheckArray.push(
  //         this.state.items[position[0]].items[position[1]].items[position[2]]
  //       );
  //     }
  //     console.log("uniquecheckArray", uniquecheckArray);
  //     uniquecheckArray.map(itemList => {
  //       console.log("map array", itemList);
  //       console.log("map array label", itemList.label);

  //       let items_to_check;
  //       if (position.length === 1) {
  //         items_to_check = this.state.items[position[0]].items;
  //         console.log("items_to_check", items_to_check);
  //         isExist = this.checkUniqueness(items_to_check, item);
  //         if (isExist) {
  //           alert("already exist");
  //         } else {
  //           Object.assign(item, { items: [] });
  //           console.log("added item", item);
  //           this.state.items[position[0]].items.splice(0, 0, item);
  //           console.log("Added item", this.state.items);
  //         }
  //       } else if (position.length === 2) {
  //         items_to_check = this.state.items[position[0]].items[position[1]]
  //           .items;
  //         isExist = this.checkUniqueness(items_to_check, item);
  //         if (isExist) {
  //           alert("already exist");
  //         } else {
  //           console.log("added item", item);
  //           this.state.items[position[0]].items[position[1]].items.splice(
  //             0,
  //             0,
  //             item
  //           );
  //           console.log("Added item", this.state.items);
  //         }
  //       } else if (position.length === 3) {
  //       }
  //     });
  //   }
  // };

  addItemNew = item => {
    console.log(
      "openserver",
      this.state.showServer + "openlevel",
      this.state.showLevel
    );
    if (this.state.showServer) {
      console.log(this.state.category);
      if (this.state.category === "Add New") {
        this.setState({ category: "0" }, () => {
          this.addServer(item);
        });
      } else {
        this.addServer(item);
      }
    }
    if (this.state.showLevel) {
      this.addLevel(item);
    }
  };

  addServer = item => {
    let isExist = false;
    console.log("category", this.state.category);
    var position = this.state.category.split(",");
    var uniquecheckArray = [];
    if (position.length === 1) {
      uniquecheckArray.push(this.state.items[position[0]]);
    } else if (position.length === 2) {
      uniquecheckArray.push(this.state.items[position[0]].items[position[1]]);
    }
    console.log("uniquecheckarray", uniquecheckArray);
    uniquecheckArray.map(itemList => {
      console.log("map array", itemList);
      console.log("map array label", itemList.label);

      let items_to_check;
      if (position.length === 1) {
        items_to_check = this.state.items[position[0]].items;
        console.log("items_to_check", items_to_check);
        console.log("item", item);
        isExist = this.checkUniqueness(items_to_check, item);
        if (isExist) {
          alert("already exist");
        } else {
          this.state.items[position[0]].items.splice(0, 0, item);
          console.log("Added item", this.state.items);
        }
      } else if (position.length === 2) {
        items_to_check = this.state.items[position[0]].items[position[1]].items;
        console.log("items_to_check", items_to_check);
        console.log("item", item);
        isExist = this.checkUniqueness(items_to_check, item);
        if (isExist) {
          alert("already exist");
        } else {
          this.state.items[position[0]].items[position[1]].items.splice(
            0,
            0,
            item
          );
          console.log("Added item", this.state.items);
        }
      }
    });
  };

  addLevel = item => {
    console.log("in add level");
    let isExist = false;
    console.log("category", this.state.category);
    if (this.state.category === "Add New") {
      console.log("new", item);
      isExist = this.checkUniqueness(this.state.items, item);
      if (isExist) {
        alert("already Exist");
      } else {
        Object.assign(item, { items: [] });
        let newItemList = [...this.state.items, item];
        this.setState({ items: newItemList });
        // axios
        //   .post("http://localhost:5001/insert/connectivity/item", {
        //     data: { level1: item.label }
        //   })
        //   .then(res => {
        //     console.log("res", res);
        //     this.refreshPanelMenu();
        //   });
      }
    } else {
      var position = this.state.category.split(",");
      console.log("position", position + " length" + position.length);
      var uniquecheckArray = [];
      uniquecheckArray.push(this.state.items[position[0]]);
      uniquecheckArray.map(itemList => {
        console.log("map array", itemList);
        console.log("map array label", itemList.label);

        let items_to_check;
        if (position.length === 1) {
          items_to_check = this.state.items[position[0]].items;
          console.log("items_to_check", items_to_check);
          isExist = this.checkUniqueness(items_to_check, item);
          if (isExist) {
            alert("already exist");
          } else {
            Object.assign(item, { items: [] });
            console.log("added item", item);
            this.state.items[position[0]].items.splice(0, 0, item);
            console.log("Added item", this.state.items);
          }
        }
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
    const footer1 = (
      <div>
        <Button label="Confirm" onClick={this.onConfirmDialog} />
        <Button label="Cancel" onClick={this.onHide1} />
      </div>
    );
    let textBox = (
      <input
        type="text"
        value={this.state.textValue}
        onChange={this.onChange}
        style={{ marginRight: 10 }}
      />
    );

    let dialogContent;
    if (this.state.showServer) {
      dialogContent = (
        <div>
          Add Server {textBox}
          <select
            name="category"
            value={this.state.category}
            onChange={event => this.handleCategoryChange(event.target.value)}
          >
            {this.addServerDropdown()}
          </select>
        </div>
      );
    }
    if (this.state.showLevel) {
      dialogContent = (
        <div>
          Add Level {textBox}
          <select
            name="category"
            value={this.state.category}
            onChange={event => this.handleCategoryChange(event.target.value)}
          >
            <option value="Add New">Add New</option>
            {this.addLevelDropdown()}
          </select>
        </div>
      );
    }

    return (
      <div style={{ marginLeft: 200 }}>
        <Menu
          model={this.state.options}
          popup={true}
          ref={el => (this.menu = el)}
          id="popup_menu"
          style={{ margin: 5 }}
        />
        <Navbar bg="light" expand="lg">
          <div>
            <button
              onClick={event => this.menu.toggle(event)}
              aria-controls="popup_menu"
              aria-haspopup={true}
            >
              <i className="fa fa-fw fa-plus" style={{ margin: 10 }}></i>
            </button>
            {/* <button onClick={this.onClick}>
              <i className="fa fa-fw fa-plus" style={{ margin: 10 }}></i>
            </button> */}
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
            handleNewEntry={this.addItemNew}
          />
        </div>
        <div style={{ marginLeft: 350 }}>
          {this.state.serverDetails ? <ServerDetails /> : null}
        </div>
        {/* <Dialog
          visible={this.state.visible}
          style={{ width: "50vw" }}
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
        </Dialog> */}
        {this.state.deleteDialog ? (
          <DeleteDialog
            onHide={this.closeDeleteDialog}
            displayDropdown={this.displayDropdown}
            panelMenu={this.state.items}
            updateItem={this.updateItems}
          />
        ) : null}

        <Dialog
          visible={this.state.openDialog}
          style={{ width: "50vw" }}
          closable={false}
          footer={footer1}
          onHide={this.onHide1}
        >
          {dialogContent}
        </Dialog>
      </div>
    );
  }
}

export default Connectivity;
