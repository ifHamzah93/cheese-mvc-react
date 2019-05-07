# The Menus View

- [previous: `3-cheeses-view.md`](./3-cheeses-view.md)
- topics
  - React Router path parameters
- components

The final part of the project is the Menus View. This view will be broken down into two sections - each with their own sub-components. The Menus View will have a form for creating new menus and a list of menus with links to the individual Menu View. The Menu View will be used to display a single Menu and its cheeses. It will also allow the user to add and remove cheeses from the menu.

Since the Menu View shows a single menu it is dependent on the Menus View, holding the create menu form, being completed. Let's begin with the Menus View first.

# The `<MenusView>` Component

The Menus View component is nearly identical to the Categories View. If you are up for a challenge consider how you could merge these two components into a dynamic component that can create and display menus or categories depending on its props.

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
