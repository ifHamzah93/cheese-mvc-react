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

There is no starter code for this file. It is identical to the `<CategoriesForm>`. Your tasks are to copy, :( ,  over the `src/components/category/CategoryForm.js` file and refactor it to support the MenuForm use case. Keep note of the changes you will need to make:

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
There is no starter code for this file. If you must continue to blaspheme in the name of our DRY Code and Savior you can copy the `<CategoriesForm>` and make changes to:

- `<h2 className='text-center'>Categories</h2>` this line
- `{categories.map(createCategoryRow)}` this line
- `createCategoryRow` this name
