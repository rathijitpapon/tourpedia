import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";

import Home from "../views/Home";
import Country from "../views/Country";
import Category from "../views/Category";
import Blog from "../views/Blog";
import Event from "../views/Event";
import Forum from "../views/Forum";
import Enter from "../views/Enter";
import Search from "../views/Search";
import Profile from "../views/Profile";

const MainLayout = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/user/:username" component={Profile} />
        <Route exact path="/search/:key" component={Search} ></Route>
        <Route exact path="/event" component={Event} ></Route>
        <Route exact path="/blog" component={Blog} ></Route>
        <Route exact path="/forum" component={Forum} ></Route>
        <Route exact path="/country" component={Country} ></Route>
        <Route exact path="/category" component={Category} ></Route>
        <Route exact path="/enter" component={Enter} ></Route>
        <Route exact path="/" component={Home} ></Route>
        <Redirect path="*" to ="/" />
      </Switch>
    </div>
  );
};

export default MainLayout;
