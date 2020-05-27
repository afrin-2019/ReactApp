import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Card } from "react-bootstrap";
import { useAuth } from "../context/auth";
//export let User = "";
function Login(props) {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { setAuthTokens } = useAuth();
  function postLogin(e) {
    e.preventDefault();
    let request = {};
    request = {
      username: userName,
      password: password,
    };
    console.log("request", request);

    axios
      .post("http://localhost:5001/generate-token", request)
      .then((result) => {
        console.log(result.data);
        if (result.data !== "Invalid") {
          console.log("result is", result.data.Token);
          setAuthTokens(result.data);
          setLoggedIn(true);
        } else {
          setIsError(true);
        }
      })
      .catch((e) => {
        setIsError(true);
      });
  }

  if (isLoggedIn) {
    return <Redirect to="/connectivity" />;
  }

  return (
    <React.Fragment>
      <div>
        <div
          //className="container login-container"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {/* <div className="row"> */}

          <div className="col-md-6 login-form-1">
            <Card
              style={{ margin: 60, padding: 30, backgroundColor: "#f1f1f1" }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 10,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                Login
              </span>
              {isError && (
                <p style={{ color: "red" }}>
                  The username or password provided were incorrect!
                </p>
              )}
              <form onSubmit={postLogin}>
                <div className="form-group">
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="UserName"
                    onChange={(evt) => setUserName(evt.target.value)}
                    value={userName}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    required
                    className="form-control"
                    placeholder="Password "
                    onChange={(evt) => setPassword(evt.target.value)}
                    value={password}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button className="btn btn-outline-secondary m-2">
                    Submit
                  </button>
                </div>
              </form>
            </Card>
          </div>

          {/* </div> */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Login;
