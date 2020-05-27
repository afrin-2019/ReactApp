import React, { Component } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

let file;
class UploadExcel extends Component {
  state = {};
  handleClick = () => {
    this.refs.fileUploader.click();
  };

  handleUpload = (e) => {
    file = e.target.files[0];
    console.log("file", file);
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      let data = { fileName: file["name"] };
      console.log(data);
      console.log(fd);
      axios
        .post("http://localhost:5001/insert/connectivity/excel-upload", data)
        .then((res) => {
          console.log(res);
          alert(res.data);
        });
    }
  };
  render() {
    return (
      <React.Fragment>
        <input
          type="file"
          id="file"
          ref="fileUploader"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onChange={(e) => this.handleUpload(e)}
          onClick={(event) => {
            event.target.value = null;
          }}
          style={{ display: "none" }}
        />
        {/* <Button style={{ margin: 10 }} onClick={this.handleClick}>
          Upload
        </Button> */}
        <i
          className="fa fa-upload iconStyle"
          style={{ cursor: "pointer" }}
          onClick={this.handleClick}
          title="Upload"
        />
      </React.Fragment>
    );
  }
}

export default UploadExcel;
