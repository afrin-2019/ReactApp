import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { useAuth } from "../context/auth";
function LogOut(props) {
  const [isLoggedOut, setLogOut] = useState(false);
  const { authTokens, setAuthTokens } = useAuth();

  function LogOut() {
    console.log("logout");
    setAuthTokens();
    setLogOut(true);
  }

  // if (isLoggedOut) {
  //   return <Redirect to="/" />;
  // }

  return (
    <div className="ml-auto">
      <button className="btn btn-sm btn-outline-secondary m-2" onClick={LogOut}>
        Log out
      </button>
    </div>
  );
}

export default LogOut;
