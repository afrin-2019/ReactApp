import React, { Component } from "react";
import ServerDetailNew from "./ServerDetailNew";
import ServerDetails from "./ServerDetails";
import axios from "axios";
let displayPanel = [];
class NewPanel extends Component {
  state = {
    serverDetail: false,
    panelMenu: [],
    items: [
      {
        label: "Level1",
        items: [
          {
            label: "Level1a"
          }
        ]
      },
      {
        label: "Level2"
      },
      {
        label: "Level3"
      }
    ]
  };

  componentDidMount() {
    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;

    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
        } else {
          dropdownContent.style.display = "block";
        }
      });
    }
    this.refreshPanel();
  }

  refreshPanel = () => {
    // axios
    //   .get("http://localhost:5001/get/connectivity/newpanelmenu")
    //   .then(res => {
    //     res.data.map((item, index) => {
    //       if (item.TopId === "000") {
    //         displayPanel.push(
    //           <button key={index} className="dropdown-btn" id={item.ID}>
    //             {item.Label}
    //             <i className="fa fa-caret-down"></i>
    //           </button>
    //         );
    //       }
    //       if (item.TopId !== "000" && item.Type === "level") {
    //         console.log("dp", displayPanel);
    //         displayPanel.map(item1 => {
    //           var doc = document.getElementById("1");
    //           console.log("doc", doc);
    //         });
    //         displayPanel.push(
    //           <div key={index} className="dropdown-container">
    //             <button className="dropdown-btn">
    //               {item.Label}
    //               <i className="fa fa-caret-down"></i>
    //             </button>
    //           </div>
    //         );
    //       }
    //     });
    //     this.setState({ panelMenu: displayPanel });
    //   });
    this.state.items.map((item, index) => {
      displayPanel.push(
        <button key={index} className="dropdown-btn">
          {item.label}
          <i className="fa fa-caret-down"></i>
        </button>
      );
    });
    this.setState({ panelMenu: displayPanel });
  };
  showServer = () => {
    this.setState({ serverDetail: true });
  };
  render() {
    console.log(this.state.panelMenu);
    return (
      <React.Fragment>
        <div style={{ marginLeft: 200 }}>
          <div className="panelbar">{this.state.panelMenu}</div>
        </div>
        <div style={{ marginLeft: 300 }}>
          {this.state.serverDetail ? <ServerDetails /> : null}
        </div>
      </React.Fragment>
    );
  }
}

export default NewPanel;
