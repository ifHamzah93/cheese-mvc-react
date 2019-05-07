# The Menus View

- [previous: `3-cheeses-view.md`](./3-cheeses-view.md)
- topics
  - React Router path parameters
- components

The final part of the project is the Menus View. This view will be broken down into two sections - each with their own sub-components. The Menus View will have a form for creating new menus and a list of menus with links to the individual Menu View. The Menu View will be used to display a single Menu and its cheeses. It will also allow the user to add and remove cheeses from the menu.

Since the Menu View shows a single menu it is dependent on the Menus View, holding the create menu form, being completed. Let's begin with the Menus View first.

## The `<MenusView>` Component

The Menus View and its Child components are nearly identical to the Categories View and its children. If you are up for a challenge consider how you could merge these components into dynamic components that can create and display menus or categories depending on the props they receive. If you are not up for the challenge continue with the steps below!

It is responsible for:

- rendering a form component for creating a new menu
- rendering a table component for listing menus
- requesting a list of menus from the API
- updating the list of menus when a new one is created from the form
  - **note that this data and several others throughout the application would normally be handled by an application state manager to prevent repeated fetching of resources**
    - React Context
    - Redux

With these requirements in mind lets begin with the **Declaration** step of the cycle.

- state
  - `menus`: an array of menu objects
    - initial value: `[]` empty array
- methods
  - lifecycle
    - `componentDidMount`: where we will make an API request
      - for the current state of the menus collection
      - update state with the `menus`
  - handlers
    - `addToMenus`: receives a new menu to add to its `menus` list
- rendering
  - grid `<Container>`: to hold and position its children
  - `<MenuForm>`
    - handler props
      - `addMenu` to use the `addToMenus` method
        - will be called when the form is submitted and new menu is received from the API
  - `<MenusList>`
    - data props
      - `menus` list

Your tasks

- create the files listed below
- copy the starter code to its file
- complete the TODOs in the snippet

directory structure

```sh
src/
  index.js
  App.js
  Routes.js
  utilities/
  components/
    cheese/
    category/
*   menu/
*     MenuForm.js
*     MenusList.js
    CheeseNav.js
    Footer.js
  views/
    HomeView.js
    CheesesView.js
    CategoriesView.js
    MenusView.js <--- copy and complete starter code
```

`src/views/MenusView.js`

```js
import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

import request from "../utilities/api-request";
import MenusList from "../components/menu/MenusList";
import MenuForm from "../components/menu/MenuForm";

class MenusView extends Component {
  state = {
    menus: [],
  };

  async componentDidMount() {
    // TODO: request the menus from the API
    // TODO: update state with the menus
  }

  addToMenus = newMenu => {
    // TODO: implement this method
      // it should merge the new menu with the existing menus

    // which setState approach should you use?
    // are you using current state to set state?
  };

  render() {
    const { menus, showForm } = this.state;

    return (
      <Container>
        <Row>
          <Col>
            <MenuForm
              {/* TODO: complete the props for this component */}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <MenusList
              {/* TODO: complete the props for this component */}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default MenusView;
```

With the MenusView complete let's consider the dependency chain of the Child components. Just like the `<CategoriesView>`, our `<MenusList>` is dependent on a `<MenuForm>` to have menus to list! Let's begin with the `<MenuForm>`.

### The `<MenuForm>` Component

The Menu Form component is also practically identical to the Categories View. In fact if I were to write out the Component breakdown I would just copy / paste and simply change `category/(ies)` to `menu(s)`! If you feel dirty copy and pasting your code to make just a few name changes consider merging these into dynamic components...

Your tasks:

There is no starter code for this file. It is identical to the `<CategoriesForm>`. Your tasks are to copy, :( , over the `src/components/category/CategoryForm.js` file and refactor it to support the MenuForm use case. Keep note of the changes you will need to make:

- your prop handler has changed
- the API endpoint you are submitting the form to has changed (see the `0-intro.md` section for the API reference)
- the title of the form `<h2>Create a {}</h2>` has changed

Couldn't all of these be set as props to make the behavior more dynamic? Even something simple and specific like:

```js
<NameForm
  title={entityName}
  endpoint={entityCreateEndpoint}
  addEntity={addToEntitiesHandler}
/>
```

### The `<MenusList>` Component

There is no starter code for this file. If you must continue to blaspheme in the name of our DRY Code and Savior you can copy the `<CategoriesList>` and make changes to:

- `<h2 className='text-center'>Categories</h2>` this line
- `{categories.map(createCategoryRow)}` this line
- `createCategoryRow` this name

## The `MenuView` Component

Ah finally we get to some fresh business. The Menu View will be used to display a single menu and its cheeses. What is new about this component is how it will be accessed.

This component will use a path variable in the url to determine which menu to display. Let's begin by exploring how path variables work in React Router.

### React Router Path Variables

If you recall in Spring we were able to set up path variables like this:

```java
@RequestMapping(value = "/cheese/{cheeseID}")
// rest of Cheese edit handler
```

This allowed us to have a _variable_ path which we would use to look up the corresponding chese by its ID. For example a request to `/cheese/5` would let us render an edit cheese view for the cheese with an ID of 5. We can accomplish a similar goal using React Router with just a slightly different syntax.

In React Router we have set up our `<Route>` components to use the `path=""` props to determine which component to render when that path is matched. You can set up a path variable using the `/:variableName` syntax.

```js
<Route path="/path/:subPathVariable" component={ComponentName} />
```

This would correspond to the url path `/path/something` where the value of the `subPathVariable` would be `something`.

In our case we want to add a subpath to `/menus/` that corresponds to a path variable called `menuID`.

Your tasks:

- create the `MenuView` file in the `views/` directory
- in `src/Routes.js`
  - import the `MenuView`
  - add a new `<Route>` component
    - set the correct `path` prop to use a `menuID` path variable
    - set the `component` prop to render the `MenuView` component

directory structure

```sh
src/
  index.js
  App.js
  Routes.js <--- import MenuView and add the new <Route>
  utilities/
  components/
  views/
    HomeView.js
    CheesesView.js
    CategoriesView.js
    MenusView.js
*   MenuView.js
```

If you need a refresher on how to implement this the [React Router docs](https://reacttraining.com/react-router/web/api/Route/) are fantastic. They even [have an example](https://reacttraining.com/react-router/web/example/url-params) on this exact use case.

Now let's turn our attention back to the `<MenuView>` component where we will learn how to use the path variable from the url.

### Using Path Variables

Once you set up a `<Route>` that matches a path variable you want to use that variable in the component it renders. If you recall all components rendered by a `<Route>` component receive the following props:

- `match`: [docs](https://reacttraining.com/react-router/web/api/match)
- `location`: [docs](https://reacttraining.com/react-router/web/api/location)
- `history`: [docs](https://reacttraining.com/react-router/web/api/history)

For our purposes we will focus on the `match` prop. This prop gives us details about how the URL was matched that rendered our component. We are interested in a particular property on the `match` object prop called `params`. This sub-property is where we can access the path variable `menuID`.

```js
const SomeComponent = props => {
  const { pathVariableName } = props.match.params;

  // or if destructuring still confuses you
  const pathVariableName = props.match.params.pathVariableName;

  // use the path variable value for controlling your component behavior
};
```

For our `<MenuView>` component we want to access the `menuID` property on the `props.match.params` object. With this ID we can make a request to the API to get the data specific to this menu, and in turn render its name and cheeses!

### Declaration & Implementation

Now that our `<MenuView>` component is ready to receive the `menuID` of the menu it will display we can explore its responsibilities:

- request the menu data from the API for the corresponding `menuID`
  - if no API data exists for the given `menuID` what will we do?
- render the menu name
- render the cheeses associated with the menu
- render a small form for adding cheeses to the current menu
- update the menu cheeses list when a new cheese is added

Because this component needs to manage and update a list of menu cheeses we will have to use a stateful design:

- state
  - `menu`: the menu entity for the given `menuID`
    - initial value: `null`
      - we will use this initial value for conditional rendering
- methods
  - lifecycle
    - `componentDidMount`: for requesting the menu data from the API
  - handlers
    - `addToCheeses`: receives a `cheese` object
      - used as a report handler in the `<AddMenuCheeseForm>`
      - updates state to add the cheese to the `menu.cheeses` list
    - `deleteCheese`: receives a `cheeseID`
      - used by the `<CheeseTable>`
      - sends an API request to delete the cheese from the menu's cheese sub-collection
      - if the request is successful calls `removeFromCheeses`
    - `removeFromCheeses`: receives a `cheeseID`
      - used by the `removeCheese` method
      - updates state of `menu.cheeses` by filtering out the cheese to be removed
        - the filter should pass any cheese whos `id` is not equal to the given `cheeseID`
- rendering (menu is loading)
  - a `<Loading>` component
- rendering (menu is not found)
  - a `<Redirect>` component
    - redirects to the `/menus` page
- rendering (menu is found)
  - `<Container>`: grid container
  - an `<h2>` with the menu name
  - `<AddMenuCheeseForm>`: for adding cheeses to the menu
    - data props
      - `currentCheeses`: the `menu.cheeses` list
        - will be used to control which options are rendered to prevent duplicates
    - handler props
      - `addCheese`: uses the `addToCheeses` method
        - will be called after the form is submitted to send the added cheese back to `<MenuView>`
  - `<CheesesList>`: for displaying the menu's cheeses
    - data props
      - `cheeses`: the `menu.cheeses` list
    - handler props
      - `removeCheese`: uses the `deleteCheese` method
        - called when a cheese's remove button is clicked

Why are there three rendering sections above? Because this component needs to use conditional rendering.

We can't provide initial state for `menu` because it is a complex object whos properties are depended on for rendering. As a result, if `menu` is `null`, its initial value, then any of our child components will break when trying to access properties like `name` or `cheeses`.

We have a compounded issue in that someone may attempt to navigate to the page from a url like `/menus/50000` which of course does not correspond to a real menu. In this case the API response will be `undefined`.

We will render a `<Loading>` icon while the network request is awaiting its response.

If we receive no `menu` data in our response then we should redirect the user to our `<MenusView>`. We can accomplish this using a React Router component called `<Redirect>`. The Redirect component behaves as you expect - you tell it where to redirect `to` and it will do so without breaking our SPA behavior. You can read more about the Redirect component [here](https://reacttraining.com/react-router/web/api/Redirect).

If we do receive `menu` data in our response then we can render our expected components!

Your tasks:

- create the following files
- copy the code for the `<Loading>` component
  - feel free to implement your own loading component using the [React Bootstrap "spinners"](https://react-bootstrap.github.io/components/spinners/) or another library
- copy the starter code for the `<AddMenuCheeseForm>`
- complete the TODOs in the starter code

directory structure

```sh
src/
  index.js
  App.js
  Routes.js
  utilities/
  components/
    cheese/
    category/
    menu/
      MenuForm.js
      MenusList.js
*     AddMenuCheeseForm.js
*   Loading.js
    CheeseNav.js
    Footer.js
  views/
    HomeView.js
    CheesesView.js
    CategoriesView.js
    MenusView.js
    MenuView.js <--- copy and complete starter code
```

`src/components/Loading.js`

```js
import React from "react";
import Spinner from "react-bootstrap/Spinner";

const Loading = () => (
  <div style={{ margin: "0 auto" }}>
    <Spinner animation="grow" variant="primary" />
    <Spinner animation="grow" variant="secondary" />
    <Spinner animation="grow" variant="success" />
    <Spinner animation="grow" variant="danger" />
    <Spinner animation="grow" variant="warning" />
    <Spinner animation="grow" variant="info" />
    <Spinner animation="grow" variant="dark" />
  </div>
);

export default Loading;
```

`src/components/views/MenuView.js`

```js
import React, { Component } from "react";
import { Redirect } from "react-router";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import request from "../utilities/api-request";
import Loading from "../components/Loading";
import CheesesList from "../components/cheese/CheesesList";
import AddMenuCheeseForm from "../components/menu/AddMenuCheeseForm";

class MenusView extends Component {
  state = {
    menu: null,
  };

  async componentDidMount() {
    // get the menuID from the matched path
    const { menuID } = this.props.match.params;

    // TODO: request the menu for the given menuID
    // check the API reference for the correct endpoint to use
    const res = await request.get();
    const menu = res.data; // if no menu is found will be "undefined"

    this.setState({ menu });
  }

  addToCheeses = cheese =>
    this.setState(state => {
      const { cheeses } = state.menu;

      return { menu: { cheeses: [cheese, ...cheeses] } };
    });

  removeFromCheeses = cheeseID =>
    this.setState(state => {
      const { cheeses } = state.menu;

      // TODO: provide the filter() callback
      // should return true for any cheese whos ID DOES NOT match the cheeseID
      const updatedCheeses = cheeses.filter();

      return { menu: { cheeses: updatedCheeses } };
    });

  deleteCheese = async cheeseID => {
    // TODO: make an API request to remove the cheese from the menu
    // check the API reference for the correct endpoint
    const res = await request.delete();

    // if the request failed exit early
    if (res.status !== 200) {
      return;
    }

    this.removeFromCheeses(cheeseID);
  };

  render() {
    const { menu } = this.state;

    // if menu is our initial value, null, we are still loading
    if (menu === null) return <Loading />;

    // if the response did not find a menu with the given ID it will be "undefined"
    // redirect to the MenusView at /menus
    if (menu === undefined) return <Redirect to="/menus" />

    // otherwise we render our MenuView
    return (
      <Container>
        <h2>{menu.name}</h2>
        <Row>
          <AddMenuCheeseForm
            {/* TODO: complete the props */}
          />
        </Row>
        <Row>
          <CheesesList
            {/* TODO: complete the props */}
          />
        </Row>
      </Container>
    );
  }
}
```
