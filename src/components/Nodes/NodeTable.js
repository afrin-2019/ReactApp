import React, { Component } from "react";
import Axios from "axios";
import Filter from "./Filter";

class NodeTable extends Component {
  state = {
    nodeDetail: [],
    serverDetail: [],
    location: [],
  };

  componentDidMount() {
    Axios.get("http://localhost:5001/get/connectivity/node-details").then(
      (res) => {
        this.setState({ nodeDetail: res.data });
      }
    );
    Axios.get("http://localhost:5001/get/connectivity/server-details").then(
      (res) => {
        this.setState({ serverDetail: res.data });
      }
    );
    Axios.get("http://localhost:5001/get/connectivity/newpanelmenu").then(
      (res) => {
        console.log("location mount");
        let serverArray = [],
          serverArray1 = [];

        res.data.map((menu) => {
          if (menu.Type === "Server") {
            serverArray.push({ name: menu.Label, locationId: menu.TopId });
          }
        });
        serverArray.map((server) => {
          res.data.map((menu) => {
            if (menu.ID === parseInt(server.locationId)) {
              serverArray1.push({ name: server.name, location: menu.Label });
            }
          });
        });
        this.setState({ location: serverArray1 });
      }
    );
  }

  headerDisplay = () => {
    let td = [
      " ",
      "NodeName",
      "NodeType",
      "VendorType",
      "ConnectionType",
      "ServerName",
      "IPAddress",
      "Location",
    ];
    let name = "table";
    let data = [],
      i = 0,
      x;
    for (x in td) {
      //iterating every field of the first record

      //pushing 'th' elememt with header name and filter component, into the array
      if (td[x] !== " ") {
        data.push(
          <th key={i} className="text-nowrap">
            {td[x]} <Filter num={i} id={name} />
          </th>
        );
      } else {
        data.push(<th key={i}>{td[x]}</th>);
      }
      i++;
    }
    return data;
  };

  bodyDisplay = () => {
    let td = [...this.state.nodeDetail];
    let server = [...this.state.serverDetail];
    let location = [...this.state.location];
    let data = [],
      j = 1,
      k = 1;
    for (let i in td) {
      for (let y in server) {
        if (server[y].Server_Id === td[i].Server_Id) {
          for (let z in location) {
            if (location[z].name === server[y].Server_Name) {
              data.push(
                <tr key={k}>
                  <td key={j++}>
                    <input type="checkbox" />
                  </td>
                  <td key={j++}>{td[i].Node_Name}</td>
                  <td key={j++}>{td[i].Node_Type}</td>
                  <td key={j++}>{td[i].Vendor}</td>
                  <td key={j++}>Hop</td>
                  <td key={j++}>{server[y].Server_Name}</td>
                  <td key={j++}>{server[y].IPAddress}</td>
                  <td key={j++}>{location[z].location}</td>
                </tr>
              );
            }
          }
        }
      }

      j++;
      k++;
    }
    return data;
  };
  render() {
    return (
      <div id="nodetable">
        <table id="table" className="node w3-striped w3-card-4 w3-small">
          <thead>
            <tr style={{ backgroundColor: "#484848", color: "white" }}>
              <th colSpan="4">NodeDetails</th>
              <th colSpan="3">Connectivity</th>
              <th>&nbsp;</th>
            </tr>
            <tr style={{ backgroundColor: "#808080", color: "white" }}>
              {this.headerDisplay()}
            </tr>
          </thead>
          <tbody>{this.bodyDisplay()}</tbody>
        </table>
      </div>
    );
  }
}

export default NodeTable;
