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
      var position = this.state.category.split(",");
      let panelMenu = [...this.props.panelMenu];

      if (position.length === 1) {
        panelMenu.splice(position[0], 1);
      }
      if (position.length === 2) {
        panelMenu[position[0]].items.splice([position[1]], 1);
        console.log(panelMenu);
      }
      if (position.length === 3) {
        console.log(
          panelMenu[position[0]].items[position[1]].items[position[2]]
        );
        panelMenu[position[0]].items[position[1]].items.splice(position[2], 1);
      }
      this.props.updateItem(panelMenu);
    }
    this.props.onHide();
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
