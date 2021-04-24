import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";

import Enter from "../views/Enter";
import Home from "../views/Home";
import Event from "../views/Event";
import PendingEvent from "../views/PendingEvent";
import EventDetails from "../views/EventDetails";
import Blog from "../views/Blog";
import PendingBlog from "../views/PendingBlog";
import BlogDetails from "../views/BlogDetails";
import UserList from "../views/UserList";
import Pedia from "../views/Pedia";
import PediaDetails from "../views/PediaDetails";
import EditPedia from "../views/EditPedia";
import Explore from "../views/Explore";
import Profile from "../views/Profile";

const MainLayout = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/profile" component={Profile} ></Route>
        <Route exact path="/explore" component={Explore} ></Route>
        <Route exact path="/pedia/edit/:pediaId" component={EditPedia} ></Route>
        <Route exact path="/pedia/:placeName" component={PediaDetails} ></Route>
        <Route exact path="/pedia" component={Pedia} ></Route>
        <Route exact path="/user" component={UserList} ></Route>
        <Route exact path="/blog/:blogName" component={BlogDetails} ></Route>
        <Route exact path="/pending/blog" component={PendingBlog} ></Route>
        <Route exact path="/blog" component={Blog} ></Route>
        <Route exact path="/event/:eventName" component={EventDetails} ></Route>
        <Route exact path="/pending/event" component={PendingEvent} ></Route>
        <Route exact path="/event" component={Event} ></Route>
        <Route exact path="/home" component={Home} ></Route>
        <Route exact path="/" component={Enter} ></Route>
        <Redirect path="*" to ="/home" />
      </Switch>
    </div>
  );
};

export default MainLayout;
