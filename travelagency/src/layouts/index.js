import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";

import Home from "../views/Home";

const MainLayout = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} ></Route>
        <Redirect path="*" to ="/" />
      </Switch>
    </div>
  );
};

export default MainLayout;
