import React, { Component } from "react";
import { Button } from "primereact/button";
import { TieredMenu } from "primereact/tieredmenu";
import data from "./items.json";
import new_data from "./newitems.txt";
class Tierred_Menu extends Component {
  constructor(props) {
    super(props);
  }
  state = {};
  render() {
    return (
      <div>
        <TieredMenu
          model={this.props.item}
          popup={true}
          ref={el => (this.menu = el)}
          id="overlay_tmenu"
        />
        <Button
          label="Add"
          icon="pi pi-bars"
          onClick={event => this.menu.toggle(event)}
          aria-haspopup={true}
          aria-controls="overlay_tmenu"
        />
      </div>
    );
  }
}

export default Tierred_Menu;
