import React from "react";
import { Switch, Route } from "react-router-dom";

import HomeView from "./views/HomeView";
import MenuView from "./views/MenuView";
import MenusView from "./views/MenusView";
import CheesesView from "./views/CheesesView";
import CategoriesView from "./views/CategoriesView";

const Routes = () => (
	<Switch>
		{/* <Route exact path="/" component={HomeView} /> */}
		<Route exact path="/menus" component={MenusView} />
		<Route exact path="/cheeses" component={CheesesView} />
		<Route exact path="/categories" component={CategoriesView} />
		<Route exact path="/menus/:menuID" component={MenuView} />
	</Switch>
);

export default Routes;
