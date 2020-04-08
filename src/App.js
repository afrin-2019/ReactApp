import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SideNavBar from "./components/SideNavBar";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Connectivity from "./components/Connectivity/Connectivity";
import Flow from "./components/Flows/Flow";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import ConnectivityNew from "./components/Connectivity/ConnectivityNew";
import NewPanel from "./components/Connectivity/NewPanel";

function App() {
  return (
    <div>
      <SideNavBar />
      <Router>
        <Switch>
          <Route exact path={"/connectivity"} component={ConnectivityNew} />
          <Route exact path={"/flows"} component={Flow} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
