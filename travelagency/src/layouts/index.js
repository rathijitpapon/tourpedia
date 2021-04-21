import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";

import EditEvent from "../views/EditEvent";
import EditGuide from "../views/EditGuide";
import Enter from "../views/Enter";
import Event from "../views/Event";
import EventDetails from "../views/EventDetails";
import Guide from "../views/Guide";
import Home from "../views/Home";
import Profile from "../views/Profile";

const MainLayout = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/profile" component={Profile} ></Route>
        <Route exact path="/home" component={Home} ></Route>
        <Route exact path="/event" component={Event} ></Route>
        <Route exact path="/event/:eventName" component={EventDetails} ></Route>
        <Route exact path="/event/edit/:eventId" component={EditEvent} ></Route>
        <Route exact path="/guide" component={Guide} ></Route>
        <Route exact path="/guide/edit/:guideId" component={EditGuide} ></Route>
        <Route exact path="/" component={Enter} ></Route>
        <Redirect path="*" to ="/home" />
      </Switch>
    </div>
  );
};

export default MainLayout;
