import React, { Component } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { ListBox } from "primereact/listbox";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

let filterArray = [],
  uniqueArray = [],
  tabIndex;
class Toggle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: [],
      newFilter: [],
    };
  }

  onYes = (e) => {
    let table = document.getElementById(this.props.id); //get the table
    console.log("table", table);
    let tr = table.getElementsByTagName("tr"); //get all the table rows
    let td, txtVal, temp;
    for (let i = 1; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[tabIndex]; //get the filtered column

      if (td) {
        txtVal = td.textContent || td.innerText; //get the content inside the column

        temp = false;
        console.log("searchname", this.state.searchName);
        this.state.searchName.map((searchname) => {
          if (txtVal === searchname) {
            //match all the td content with the filtered one
            tr[i].style.display = "";
            tr[i].style.width = "98.5%"; //setting the widthof the tr as there is a scrollbar
            temp = true;
          } else {
            if (temp === false) {
              tr[i].style.display = "none";
            }
          }
        });
      }
    }
    this.op.hide();
  };

  onNo = () => {
    console.log("inside no");
    let search = [];
    let table = document.getElementById(this.props.id);
    let tr = table.getElementsByTagName("tr");
    this.setState({ searchName: search });
    for (let i = 1; i < tr.length; i++) {
      tr[i].style.display = "";
      tr[i].style.width = "100%";
    }
    this.op.hide();
  };

  onfilterCall = (e) => {
    this.op.toggle(e);

    filterArray = [];
    uniqueArray = [];
    tabIndex = this.props.num;
    console.log("name", this.props.id);
    let table = document.getElementById(this.props.id);
    console.log("table", table);
    let tr = table.getElementsByTagName("tr");
    console.log("tr", tr);

    let td, valueOf_i;
    if (this.props.id === "table") {
      valueOf_i = 2;
    } else {
      valueOf_i = 1;
    }
    for (let i = valueOf_i; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[this.props.num];
      console.log("display", tr[i].style.display);
      if (tr[i].style.display !== "none") {
        filterArray.push({ label: td.innerText, value: td.innerText });
      }
    }

    console.log("filter array", filterArray);
    uniqueArray = filterArray
      .map((e) => e["label"])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter((e) => filterArray[e])
      .map((e) => filterArray[e]);

    console.log("in function", filterArray);
    this.setState({ newFilter: uniqueArray });
  };

  render() {
    const l_style = {
      textAlign: "left",
      fontSize: "12px",
    };
    const style = {};

    return (
      <React.Fragment>
        <button
          className="btn"
          style={{ fontSize: 10 }}
          onClick={(e) => this.onfilterCall(e)}
        >
          <i className="fa fa-filter" />
        </button>
        <div className="overlay">
          <OverlayPanel
            ref={(el) => (this.op = el)}
            showCloseIcon={true}
            dismissable={true}
            className="bg-light"
          >
            <ListBox
              filter={true}
              style={style}
              listStyle={l_style}
              value={this.state.searchName}
              options={this.state.newFilter}
              onChange={(e) => this.setState({ searchName: e.target.value })}
              multiple={true}
            ></ListBox>

            <div>
              <button
                className="btn btn-sm btn-outline-primary m-2"
                onClick={(e) => this.onYes(e)}
              >
                <i className="pi pi-check" />
                Yes
              </button>
              <button
                className="btn btn-outline-secondary btn-sm m-2"
                onClick={this.onNo}
              >
                <i className="pi pi-times" />
                No
              </button>
            </div>
          </OverlayPanel>
        </div>
      </React.Fragment>
    );
  }
}

export default Toggle;
