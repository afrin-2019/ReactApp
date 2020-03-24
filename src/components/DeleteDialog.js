import React, { Component } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
class DeleteDilog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      category: "Select"
    };
  }

  onDelete = () => {
    if (this.state.category === "Select") {
      alert("Please Select one to delete");
    } else {
      console.log("delete", this.state.category);
      console.log("item", this.props.panelMenu);
      let panelMenu = [...this.props.panelMenu];
      console.log("cloned item", panelMenu);
      let returnValue = {};
      let updated_panelMenu = panelMenu.filter(item => {
        console.log("panelmenu", item);
        if (!item.items) {
          return item.label !== this.state.category;
        } else {
          returnValue = this.deleteItem(item.items);
          console.log("returnval", returnValue);
          // return returnValue !== this.state.category;
        }
      });
      console.log("after delete", updated_panelMenu);
      this.props.updateItem(updated_panelMenu);
    }
    this.props.onHide();
  };

  deleteItem = item => {
    let value;
    console.log("in delete item", item);
    item.filter(innerItem => {
      console.log("innerItem", innerItem);
      if (!innerItem.items) {
        console.log("in delete inneritem", innerItem.label);
        return innerItem.label !== this.state.category;
      } else {
        this.deleteItem(innerItem.items);
      }
    });
    //return item;
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
