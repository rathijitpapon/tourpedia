import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";

import Home from "../views/Home";
import Search from "../views/Search";
import Enter from "../views/Enter";
import Profile from "../views/Profile";
import TravelAgency from "../views/TravelAgency";
import PlaceDetails from "../views/PlaceDetails";
import Country from "../views/Country";
import CountryDetails from "../views/CountryDetails";
import Category from "../views/Category";
import CategoryDetails from "../views/CategoryDetails";
import Blog from "../views/Blog";
import BlogDetails from "../views/BlogDetails";
import Event from "../views/Event";
import EventDetails from "../views/EventDetails";
import Forum from "../views/Forum";
import Post from "../views/Post";
import TourPlan from "../views/TourPlan";

const MainLayout = () => {
  return (
    <div>
      <Switch>
        <Route exact path="/tourplan/:tourplanName" component={TourPlan} ></Route>
        <Route exact path="/forum/:username/:postTitle" component={Post} ></Route>
        <Route exact path="/forum" component={Forum} ></Route>
        <Route exact path="/event/:agencyName/:eventName" component={EventDetails} ></Route>
        <Route exact path="/event" component={Event} ></Route>
        <Route exact path="/blog/:blogName" component={BlogDetails} ></Route>
        <Route exact path="/blog" component={Blog} ></Route>
        <Route exact path="/category/:categoryName" component={CategoryDetails} ></Route>
        <Route exact path="/category" component={Category} ></Route>
        <Route exact path="/country/:countryName" component={CountryDetails} ></Route>
        <Route exact path="/country" component={Country} ></Route>
        <Route exact path="/place/:placeName" component={PlaceDetails} ></Route>
        <Route exact path="/agency/:agencyName" component={TravelAgency} ></Route>
        <Route exact path="/user/:username" component={Profile} />
        <Route exact path="/enter" component={Enter} ></Route>
        <Route exact path="/search/:key" component={Search} ></Route>
        <Route exact path="/" component={Home} ></Route>
        <Redirect path="*" to ="/" />
      </Switch>
    </div>
  );
};

export default MainLayout;
