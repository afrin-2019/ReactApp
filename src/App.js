import React, { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Connectivity from "./components/Connectivity/Connectivity";
import Flow from "./components/Flows/Flow";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ConnectivityNew from "./components/Connectivity/ConnectivityNew";
import NewPanel from "./components/Connectivity/NewPanel";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Nodes from "./components/Nodes";
import { AuthContext } from "./context/auth.js";
import PrivateRoute from "./components/PrivateRoute";
function App() {
  const [authTokens, setAuthTokens] = useState();

  const setTokens = (data) => {
    console.log("in set tokens");
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  };
  console.log("authtoken in app.js", authTokens);
  return (
    <React.Fragment>
      <div>
        <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
          <Router>
            <Switch>
              <Route exact path={"/"} component={Login} />

              <Route exact path={"/dashboard"} component={Dashboard} />
              <Route exact path={"/connectivity"} component={ConnectivityNew} />
              <Route exact path={"/flows"} component={Flow} />
              <Route exact path={"/nodes"} component={Nodes} />
            </Switch>
          </Router>
        </AuthContext.Provider>
      </div>
    </React.Fragment>
  );
}

export default App;
