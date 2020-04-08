import React, { Component } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import axios from "axios";
class DeleteDilog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      category: "Select",
      isError: false
    };
  }

  onDelete = () => {
    if (this.state.category === "Select") {
      alert("Please Select one to delete");
    } else {
      let isDelete = false;
      console.log("value", this.state.category);
      this.props.tableDetail.map(document => {
        if (document.TopId === this.state.category) {
          if (!isDelete) {
            isDelete = true;
          }
        }
      });
      if (isDelete) {
        this.setState({ isError: true });
      } else {
        this.setState({ isError: false });
        let reqVal = parseInt(this.state.category);
        console.log("reqVal", reqVal);
        let request = {};
        request["id"] = reqVal;
        axios
          .delete("http://localhost:5001/delete/connectivity", {
            data: request
          })
          .then(response => {
            console.log("del res", response);
            this.props.updateItem();
          });
        this.props.onHide();
      }
    }
  };

  handleCategoryChange = category => {
    this.setState({ category: category });
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
            onChange={event => this.handleCategoryChange(event.target.value)}
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
