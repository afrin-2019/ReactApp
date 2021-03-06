import React, { Component } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axios from "axios";
class DeleteDilog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      category: [],
      isError: false
    };
  }

  onDelete = () => {
    console.log("delete", this.state.category);
    if (this.state.category === "Select") {
      alert("Please Select one to delete");
    } else {
      let isDelete = false;
      console.log("value", this.state.category);
      this.state.category.map(value => {
        this.props.tableDetail.map(document => {
          if (document.TopId === value) {
            if (!isDelete) {
              isDelete = true;
            }
          }
        });
      });

      if (isDelete) {
        this.setState({ isError: true });
      } else {
        this.setState({ isError: false });
        //let reqVal = parseInt(this.state.category);
        // console.log("reqVal", reqVal);
        let request = {};
        request["value"] = this.state.category;
        axios
          .delete("http://localhost:5001/delete/connectivity/multiple", {
            data: request
          })
          .then(response => {
            console.log("del res", response);
            this.props.updateItem();
            this.state.category.map(server => {
              if (this.props.serverId === server) {
                this.props.updateServer();
              }
            });
          });

        this.props.onHide();
      }
    }
  };

  handleCategoryChange = e => {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(parseInt(options[i].value));
        console.log("value change", value);
      }
    }

    this.setState({ category: value });
  };

  render() {
    const footer = (
      <div>
        <Button label="Delete" onClick={this.onDelete} />
        <Button label="Cancel" onClick={this.props.onHide} />
      </div>
    );
    return (
      <Dialog
        visible={this.state.visible}
        style={{ width: "40vw" }}
        closable={false}
        footer={footer}
        onHide={this.props.onHide}
      >
        {this.state.isError ? (
          <p style={{ color: "red" }}>cannot delete!</p>
        ) : null}
        Select from the dropdown to delete :
        <div style={{ margin: 10 }}>
          <select
            name="category"
            value={this.state.category}
            onChange={event => this.handleCategoryChange(event)}
            multiple
          >
            <option value="Select">Select</option>
            {this.props.displayDropdown()}
          </select>
        </div>
      </Dialog>
    );
  }
}

export default DeleteDilog;
