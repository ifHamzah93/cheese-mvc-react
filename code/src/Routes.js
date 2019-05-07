import React from "react";
import { Switch, Route } from "react-router-dom";

import HomeView from "./views/HomeView";
import MenusView from "./views/MenusView";
import CheesesView from "./views/CheesesView";
import CategoriesView from "./views/CategoriesView";

const Routes = () => (
	<Switch>
		{/* <Route exact path="/" component={HomeView} /> */}
		<Route exact path="/cheeses" component={CheesesView} />
		<Route exact path="/categories" component={CategoriesView} />
		{/* <Route exact path="/menus" component={MenusView} /> */}
	</Switch>
);

export default Routes;
