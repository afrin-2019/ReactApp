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
import ServerDetailNew from "./ServerDetailNew";

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
    serverId: "",
    items: [],
    deleteDialog: false,
    tableDetail: [],
    topLevel: [],
    isError: false,
    nodes: [],
    serverInfo: {},
    userEntry: "New",
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
    ]
  };

  componentDidMount() {
    this.refreshPanel();
  }

  refreshPanel = () => {
    axios
      .get("http://localhost:5001/get/connectivity/newpanelmenu")
      .then(res => {
        this.setState({ tableDetail: res.data });
        let panelMenu = [...res.data];
        this.setState({ panelMenu }, () => console.log("panelMenu", panelMenu));

        let newItemList = [],
          newItem,
          levelInfo,
          levelInfoList = [];
        panelMenu.map(item => {
          console.log("item", item);

          if (item.TopId === "000") {
            console.log(item);
            newItem = Object.assign(
              { label: item.Label },
              { items: [] },
              { value: item.ID }
            );
            console.log(newItem);
            newItemList = [...newItemList, newItem];
            levelInfo = Object.assign({ id: item.ID }, { label: item.Label });
            levelInfoList = [...levelInfoList, levelInfo];
          }
          this.setState({ items: newItemList });
          this.setState({ topLevel: levelInfoList }, () => {
            if (item.TopId !== "000" && item.Type === "level") {
              console.log("levelInfo", this.state.topLevel);
              console.log("topid", item.TopId);
              this.state.topLevel.map(detail => {
                console.log(detail.id + "" + item.TopId);
                if (detail.id.toString() === item.TopId) {
                  console.log("level1", detail.label);
                  this.state.items.map((stateItem, index) => {
                    console.log(stateItem);
                    console.log("itemtoinsert", item);
                    if (stateItem.label === detail.label) {
                      newItem = Object.assign(
                        { label: item.Label },
                        { items: [] },
                        { value: item.ID }
                      );
                      this.state.items[index].items.splice(0, 0, newItem);
                    }
                  });
                }
              });
            }
          });
          if (item.Type === "Server") {
            let newItem = item;
            let item_to_insert;
            this.state.items.map((firstLevel, index) => {
              if (newItem.TopId === firstLevel.value.toString()) {
                console.log("insert under", firstLevel.label);
                item_to_insert = Object.assign(
                  { label: newItem.Label },
                  {
                    command: event => {
                      this.showServerDetails(event.item.label, newItem.ID);
                    }
                  },
                  { value: newItem.ID }
                );
                this.state.items[index].items.splice(0, 0, item_to_insert);
              }
              if (firstLevel.items) {
                firstLevel.items.map((secondLevel, index1) => {
                  if (newItem.TopId === secondLevel.value.toString()) {
                    console.log(
                      "insert under",
                      firstLevel.label + "/" + secondLevel.label
                    );
                    item_to_insert = Object.assign(
                      { label: newItem.Label },
                      {
                        command: event => {
                          this.showServerDetails(event.item.label, newItem.ID);
                        }
                      },
                      { value: newItem.ID }
                    );
                    this.state.items[index].items[index1].items.splice(
                      0,
                      0,
                      item_to_insert
                    );
                  }
                });
              }
            });
          }
        });
      });
  };

  refreshPanel1 = () => {
    axios
      .get("http://localhost:5001/get/connectivity/newpanelmenu")
      .then(response => {
        this.setState({ tableDetail: response.data });
        console.log("records", response.data[response.data.length - 1]);
        let newItem = response.data[response.data.length - 1];
        let item_to_insert;
        this.state.items.map((item, index) => {
          if (newItem.TopId === item.value.toString()) {
            console.log("insert under", item.label);
            item_to_insert = Object.assign(
              { label: newItem.Label },
              {
                command: event => {
                  this.showServerDetails(event.item.label, newItem.ID);
                }
              },
              { value: newItem.ID }
            );
            this.state.items[index].items.splice(0, 0, item_to_insert);
          }
          if (item.items) {
            item.items.map((item1, index1) => {
              if (newItem.TopId === item1.value.toString()) {
                console.log("insert under", item.label + "/" + item1.label);
                item_to_insert = Object.assign(
                  { label: newItem.Label },
                  {
                    command: event => {
                      this.showServerDetails(event.item.label, newItem.ID);
                    }
                  },
                  { value: newItem.ID }
                );
                this.state.items[index].items[index1].items.splice(
                  0,
                  0,
                  item_to_insert
                );
              }
            });
          }
        });
      });
  };

  showServerDetails = (server, id) => {
    console.log("server");
    let isServer = false;
    this.setState({ serverName: server });
    this.setState({ serverId: id });
    axios
      .get("http://localhost:5001/get/connectivity/server-details")
      .then(response => {
        response.data.map(server => {
          console.log(server);
          if (server.Server_Id === id.toString()) {
            this.setState({ serverInfo: server });
            this.setState({ userEntry: "old" });
            isServer = true;
          }
        });
        if (!isServer) {
          this.setState({
            serverInfo: {
              Server_Name: server,
              Server_Id: id,
              Username: "",
              Password: "",
              IPAddress: ""
            }
          });
          this.setState({ userEntry: "New" });
        }
        axios
          .get("http://localhost:5001/get/connectivity/node-details")
          .then(res => {
            this.setState({ nodes: res.data });
            this.setState({ serverDetails: true });
          });
      });
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
        <option
          key={i}
          value={item.value}
          style={{ fontWeight: "bolder", fontSize: 15 }}
        >
          {item.label}
        </option>
      );
      if (item.items) {
        item.items.map(item1 => {
          i++;
          option.push(
            <option key={i} value={item1.value}>
              &nbsp;&nbsp; {item1.label}
            </option>
          );
          if (item1.items) {
            item1.items.map(item2 => {
              i++;
              option.push(
                <option key={i} value={item2.value}>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {item2.label}
                </option>
              );
            });
          }
        });
      }
    });

    return option;
  };

  addServerDropdown = () => {
    let option = [];
    let i = 0;
    this.state.items.map(item => {
      console.log("itemname", item.label + "value" + item.value);
      if (item.items) {
        i++;
        option.push(
          <option key={i} value={item.value}>
            {item.label}
          </option>
        );

        if (item.items) {
          item.items.map(item1 => {
            console.log("inner item", item1);
            if (item1.items) {
              i++;
              option.push(
                <option key={i} value={item1.value}>
                  &nbsp;{item.label}/{item1.label}
                </option>
              );
            }
          });
        }
      }
    });
    return option;
  };

  addLevelDropdown = () => {
    let option = [];
    let i = 0;
    this.state.panelMenu.map(item => {
      if (item.TopId === "000") {
        i++;
        option.push(
          <option key={i} value={item.ID}>
            {item.Label}
          </option>
        );
      }
    });
    return option;
  };
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
    this.setState({ category: "1" });
    this.setState({ textValue: "" });
    this.setState({ showLevel: false });
    this.setState({ showServer: true });
  };

  onConfirmDialog = () => {
    if (this.state.textValue === "") {
      alert("Please enter value");
    } else {
      this.setState({ addEntry: true });
    }
  };

  onChange = e => {
    this.setState({ textValue: e.target.value });
  };

  handleCategoryChange = category => {
    this.setState({ category: category });
  };

  changeEntryStatus = () => {
    this.setState({ addEntry: false });
  };

  checkUniqueness = (id, newItem) => {
    let isExist = false;
    console.log("id", id);

    this.state.panelMenu.map(item => {
      console.log("item", item);
      if (id === item.TopId) {
        if (item.Label === newItem.label) {
          isExist = true;
        }
      }
    });
    return isExist;
  };

  checkServerUniqueness = newItem => {
    let isExist = false;
    this.state.tableDetail.map(item => {
      if (item.Type === "Server") {
        if (item.Label === newItem.label) {
          isExist = true;
        }
      }
    });
    return isExist;
  };

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
    console.log("category", this.state.category);
    let isExist = false;
    console.log("item to add", item);
    isExist = this.checkServerUniqueness(item);
    console.log("exist", isExist);
    if (isExist) {
      this.setState({ isError: true });
    } else {
      console.log("in server");
      this.setState({ isError: false });
      this.setState({ openDialog: false });
      axios
        .post("http://localhost:5001/insert/connectivity/server/type2", {
          levelID: this.state.category,
          server: item.label
        })
        .then(res => {
          console.log(res);
          this.refreshPanel1();
        });
    }
  };

  addLevel = item => {
    console.log("in add level");
    let isExist = false;
    console.log("category", this.state.category);
    if (this.state.category === "Add New") {
      console.log("new", item);
      isExist = this.checkUniqueness("000", item);
      if (isExist) {
        this.setState({ isError: true });
      } else {
        this.setState({ isError: false });
        this.setState({ openDialog: false });
        axios
          .post("http://localhost:5001/insert/connectivity/level1/type2", {
            level1: item.label
          })
          .then(res => {
            console.log("res", res);
            this.refreshPanel();
          });
      }
    } else {
      console.log(this.state.category);
      isExist = this.checkUniqueness(this.state.category, item);
      if (isExist) {
        this.setState({ isError: true });
      } else {
        this.setState({ isError: false });
        this.setState({ openDialog: false });
        axios
          .post("http://localhost:5001/insert/connectivity/level2/type2", {
            level1ID: this.state.category,
            level2: item.label
          })
          .then(res => {
            console.log(res);
            this.refreshPanel();
          });
      }
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
          {this.state.serverDetails ? (
            // <ServerDetails
            //   serverName={this.state.serverName}
            //   serverId={this.state.serverId}
            //   nodeInfo={this.state.nodes}
            // />
            <ServerDetailNew
              serverDetail={this.state.serverInfo}
              nodeInfo={this.state.nodes}
              serverId={this.state.serverId}
              userEntry={this.state.userEntry}
              serverName={this.state.serverName}
            />
          ) : null}
        </div>

        {this.state.deleteDialog ? (
          <DeleteDialog
            onHide={this.closeDeleteDialog}
            displayDropdown={this.displayDropdown}
            panelMenu={this.state.items}
            updateItem={this.refreshPanel}
            tableDetail={this.state.tableDetail}
          />
        ) : null}

        <Dialog
          visible={this.state.openDialog}
          style={{ width: "50vw" }}
          closable={false}
          footer={footer1}
          onHide={this.onHide1}
        >
          <div>
            {this.state.isError ? (
              <p style={{ color: "red" }}>Already Exist!</p>
            ) : null}
            {dialogContent}
          </div>
        </Dialog>
      </div>
    );
  }
}

export default Connectivity;
