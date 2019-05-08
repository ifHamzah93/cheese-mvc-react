# The Menus View

- [previous: `3-cheeses-view.md`](./3-cheeses-view.md)
- topics
  - dynamic `<Route>` path variables
  - conditional rendering
  - React Router `<Redirect>`
- components
  - `<MenusView>`
    - `<MenuForm>`
    - `<MenusList>`
  - `<MenuView>`
    - `<Loading>`
    - `<AddMenuCheeseForm>`

The final parts of the project are the Menus and Menu Views. The Menus View will have a form for creating new menus and a list of menus with links to the individual Menu View. The Menu View will be used to display a single Menu and its cheeses. It will also allow the user to add and remove cheeses from the menu.

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
    const { menus } = this.state;

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
- the API endpoint you are submitting the form to has changed (see the [0-intro.md](./0-intro.md#API-Reference) section for the API reference)
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
- `createCategoryRow` this name\*
- import the `menuType` to use in the `<MenusList>` prop types

Okay jokes aside there is one important change you do have to make here. We want to wrap each of our menu names in a link that sends them to the corresponding `<MenuView>` using the menu's ID property. You will need to modify the `createMenuRow` utility function to use a React Router `<Link>` component. Don't forget to import the component from `react-router`.

```js
...
import { Link } from 'react-router-dom';
...

const createMenuRow = menu => (
  <tr key={menu.id}>
    <td>
      <Link to={`/menus/${menu.id}`}>{menu.name}</Link>
    </td>
  </tr>
);
...
```

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

This would correspond to the url path `/path/something` where the value of the `subPathVariable` would be `"something"`.

In our case we want to add a subpath to `/menus/` that corresponds to a path variable called `menuID`. So we can link to an individual menu with a path of `/menus/5` corresponding to the menu with an ID of `5`.

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
      - `menuID`: the ID of the menu
        - will be used to complete the API form submission
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

Why are there three rendering sections above? Because this component needs to use conditional rendering. If you skipped the [conditional rendering section](./3-cheeses-view.md#Conditional-Component-Rendering) you may benefit from reviewing it. Let's consider the problems we are faced with:

We can't provide initial state for `menu` because it is a complex object whos properties are depended on for rendering. Since the initial value for `menu` is `null` then any of our child components will break when trying to access properties like `name` or `cheeses`. Until our API response is received `menu` will remain `null`.

We have a compounded issue in that someone may attempt to navigate to the page from a url like `/menus/50000` which of course does not correspond to a real menu. In this case the API response will be an empty string `""`.

So how can we solve these issues?

We will render a `<Loading>` component while the network while waiting for the API response rather than rendering our child components. When the response is received back it will either be `""`, implying no match for the `menuID` was found, or it will be a `menu` object that will allow us to render our child components.

If we receive no `menu` data in our response, `menu = ""`, then we should redirect the user to our `<MenusView>`. If the user navigated here by mistake they will be brought back to a usable view. If they were trying to be tricksy hobitses then they can be redirected indefinitely until they give up.

We can accomplish this redirect using a special React Router component called `<Redirect>`. The Redirect component behaves as you expect - you tell it where to redirect in its `to` prop and it will do so without breaking our SPA behavior. You can read more about the Redirect component and the additional behaviors it supports [here](https://reacttraining.com/react-router/web/api/Redirect).

If everything goes well and we do receive `menu` data in our response then we can render our intended components!

Your tasks:

- create the `Loading.js` and `AddMenuCheeseForm.js` files (see directory locations below)
- copy the code for the `<Loading>` component
  - feel free to implement your own loading component using the [React Bootstrap "spinners"](https://react-bootstrap.github.io/components/spinners/), another library, or by your own design
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
  <div style={{ marginLeft: "50px" }}>
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

class MenuView extends Component {
  state = {
    menu: null,
  };

  async componentDidMount() {
    // get the menuID from the matched path
    const { menuID } = this.props.match.params;

    // TODO: request the menu for the given menuID
    // check the API reference for the correct endpoint to use
    const res = await request.get();
    const menu = res.data; // if no menu is found will be an empty string ""

    this.setState({ menu });
  }

  addToCheeses = cheese =>
    this.setState(state => {
      const { menu } = state;
      const cheeses = [cheese, ...cheeses];
      // update state by merging the menu data with a new merged cheeses property
      return { menu: { ...menu, cheeses } };
    });

  removeFromCheeses = cheeseID =>
    this.setState(state => {
      const { menu } = state;

      // TODO: provide the filter() callback
      // should return true for any cheese whos ID DOES NOT match the cheeseID
      const cheeses = cheeses.filter();

      return { menu: { ...menu, cheeses } };
    });

  deleteCheese = async cheeseID => {
    const { menu } = this.state;
    // TODO: make an API request to remove the cheese from the menu
    // check the API reference for the correct endpoint
    const res = await request.delete();

    // if the request failed exit early
    if (res.status !== 201) {
      return;
    }

    this.removeFromCheeses(cheeseID);
  };

  render() {
    const { menu } = this.state;

    // if menu is our initial value, null, we are still loading
    if (menu === null) return <Loading />;

    // if the response did not find a menu with the given ID it will be an empty string ""
    // redirect to the MenusView at /menus
    if (menu === "") return <Redirect to="/menus" />

    // otherwise we render our MenuView
    return (
      <Container>
        <h2 className="text-center">{menu.name}</h2>
        <Row>
          <Col>
            <AddMenuCheeseForm
              {/* TODO: complete the props */}
            />
          </Col>
        </Row>
        <hr />
        <Row>
          <Col>
            <CheesesList
              {/* TODO: complete the props */}
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

// this defines the menuID nested prop type from the match object
MenuView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      menuID: PropTypes.string.isRequired,
    }),
  }),
};

export default MenuView;
```

We've almost made it! Our final component will be the cherry on top of our...Cheese cake. I'm sorry.

## The `AddMenuCheeseForm` Component

Our final component will be used to add cheeses to the currently viewed menu. Let's explore its responsibilities:

- make an API request for all the available cheeses
- conditionally render a form with one `<select>` input
  - if there are no unique cheeses to add we don't render the form
- create `<option>` elements dynamically
  - we only want to display unique cheese options to prevent duplicates
- make an API request to add the selected cheese to the menu
- report the added cheese back to the `<MenuView>` Parent component

Since this component is a form that handles API submission it needs to be a stateful component:

- state
  - `cheeseID`: the ID of the cheese to add
    - initial value: `""`
  - `allCheeses`: the list of all the cheeses from the API
    - initial value: `[]`
- props
  - `addCheese`: handler method for reporting the added cheese
    - will be used in the `handleSubmit` method
  - `menuID`: the ID of the menu we are adding a cheese to
  - `currentCheeses`: the cheeses currently related to the menu
    - we will use this list and the list of all the cheeses to derive a new list that only contains cheeses the menu doesn't already have
    - prevents the user from adding duplicates
    - provides a better user experience so they can find new cheeses to add without scrolling through ones the menu already has
- methods
  - `resetForm`: resets the form to initial (empty) state
  - `componentDidMount`: where we will make an API request
    - requests all the cheeses
    - updates state with the list of cheeses
  - `handleInputChange`: handles the `onChange` event
    - updates `cheeseID` in state with the selected ID
  - `handleSubmit`: handles the form submission
    - makes an API request to add the cheese to the menu
    - uses the `cheeseID` to look up the `cheese` object in `allCheeses`
    - calls the `addCheese` handler prop to give the chosen cheese back to the `<MenuView>` Parent component
    - resets the form with `resetForm`
- utility functions
  - `filterAvailableCheeses`: receives `currentCheeses` and `allCheeses` and returns a list of unique cheeses
    - used in our `render` method to provide an up-to-date list of cheeses that are available to add to the menu
  - `createCheeseOption`: receives a `cheese` object and returns an `<option>` element
    - the `value` should be the `cheese` `id` property
    - the user facing text in the option should be the `cheese` `name` property
- rendering ( )
  - `<Container>` grid for positioning
  - `<Form>` to hold the inputs
  - `<select>` to display the available options
    - attribute props
      - `name`: `cheeseID`
      - `value`: the `cheeseID` for 2-way binding
    - event props
      - `onChange`: assigned to the `handleInputChange` method for 2-way binding
  - `<option>` elements created from the `availableCheeses`
    - a blank option that says `"Select a Cheese"` with a value of `""`
    - `availableCheeses` will be computed during each render by calling `filterAvailableCheeses`
  - a submit button
    - attribute props
      - `disabled`: controls whether the form can be submitted
        - its value should be evaluated from checking if the `cheeseID` is an empty string
    - event props
      - `onClick`: assigned to the `handleSubmit` method

`src/components/menu/AddMenuCheeseForm.js`

```js
import React, { Component } from "react";
import PropTypes from "prop-types";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import request from "../../utilities/api-request";
import { cheeseType } from "../../utilities/prop-types";

// if your face melted trying to understand this look below!
const filterAvailableCheeses = (currentCheeses, allCheeses) =>
  allCheeses.filter(
    availableCheese =>
      !currentCheeses.some(
        currentCheese => currentCheese.id === availableCheese.id,
      ),
  );

const createCheeseOption = cheese => (
  // TODO: complete this utility function
);

const initialState = {
  // TODO: implement initial state
};

class AddMenuCheeseForm extends Component {
  state = initialState;

  resetForm = () => this.setState(initialState);

  async componentDidMount() {
    // get the full list of cheeses
    const res = await request.get("/cheeses");
    const allCheeses = res.data;

    this.setState({ allCheeses });
  }

  handleInputChange = event => {
    const { value } = event.target;
    this.setState({ cheeseID: value });
  };

  handleSubmit = async event => {
    event.preventDefault();
    const { menuID, addCheese } = this.props;
    const { allCheeses, cheeseID } = this.state;

    // TODO: make an API request using the correct endpoint and data
    // check the API reference to see how to add a cheese to a menu
    const res = await request.post();

    // if the request failed exit early
    if (res.status !== 201) {
      return;
    }

    // finds the cheese using its ID
    // Number(cheeseID) is to ensure the form's string cheeseID is comparable to the number cheese.id
    const cheese = allCheeses.find(cheese => cheese.id === Number(cheeseID));

    // TODO: give the cheese to the MenuView Parent component
    // TODO: reset the form
  };

  render() {
    const { currentCheeses } = this.props;
    const { cheeseID, allCheeses } = this.state;

    const availableCheeses = []; // TODO: derive the available cheeses with the utility function

    // TODO: complete the if statement
    // render null if the available cheeses list is empty
    if () {
      return null;
    }

    // can you rewrite this if / return section using the short circuit expression?
    // condition && ( );

    return (
      <Container className="text-center">
        <Form>
          <Form.Group as={Col} sm={{ offset: 4, span: 4 }}>
            <Form.Control
              as="select"
              name="cheeseID"
              {/* TODO: complete the props for this component */}
            >
              <option value="">Select a Cheese</option>
              {/* TODO: transform availableCheeses into option elements */}
            </Form.Control>
          </Form.Group>
          <Button
            type="submit"
            variant="primary"
            disabled={cheeseID === ""}
            onClick={this.handleSubmit}
          >
            Add Cheese
          </Button>
        </Form>
      </Container>
    );
  }
}

AddMenuCheeseForm.propTypes = {
  // TODO: complete the prop types
};

export default AddMenuCheeseForm;
```

### The `some()` Array Method

The `filterAvailableCheeses` may confuse you because it uses a combination of Array methods at once. Consider what its purpose is - to filter one list by seeing if they exist in another list. This could be done using a double for-loop approach. But JavaScript provides declarative Array methods that make this a cleaner process.

You are already be familiar with how `filter` works but what about `some`? The `some` method uses the same callback parameters as `filter`. It will iterate over the array and use the callback to "test" each element. This method is like asking the question "does at least one of the elements satisfy the condition I am asking [in my callback]?"

The first element that causes the callback to return `true` will stop iterating and return `true`. Answering "yes at least one satisfied your condition." If it reaches the end of the Array without every returning `true` then it returns `false`, answering "No, not a single element satisfied your condition."

So in plain English what we are saying is, "filter these [`allCheeses`] elements and only return those that are unique [do not satisfy the condition `currentCheese.id === availableCheese.id`]."

It is always easiest to wrap your head around declarative approaches by seeing them written imperatively. Below is an example function that accomplishes the same goal in a step-by-step way:

```js
const filterImperative = (currentCheeses, allCheeses) => {
  // build up the list of unique cheeses to be returned at the end of the function
  const uniqueCheeses = [];

  // loop over the available cheeses
  for (const availableCheese of allCheeses) {
    // this is what some() is doing during each iteration
    // use a flag to determine if the available cheese is unique
    let isInCurrentCheeses = false;

    // check the current cheeses to see if the available cheese is already in this list
    for (const currentCheese of currentCheeses) {
      // if the available cheese ID matches the current cheese then set the flag true, it is not unique
      if (availableCheese.id === currentCheese.id) {
        isInCurrentCheeses = true;
      }
    }

    // this is what filter() is doing during each iteration
    // if it is NOT in the current cheeses it is unique
    if (!isInCurrentCheeses) {
      uniqueCheeses.push(availableCheese);
    }
  }

  return uniqueCheeses;
};
```

You may be wondering why we do not create `availableCheeses` in our `componentDidMount`. The reason for this is that the list of `availableCheeses` is derived from both `allCheeses` as well as one of our props `currentCheeses`. Remember that since this component will receive new `currentCheeses` props every time a new cheese is added we need a way to keep the `allCheeses` current. If we were to derive its value during the component mount lifecycle event it would only be derived once and never updated. Meaning when we add our first cheese it will still appear as an option - defeating the purpose!

Instead we derive its value in the `render` method where our props are guaranteed to be current. Why are they guaranteed? Because when a component receives new props it will cause it to re-render (unless you use [another lifecycle hook method]() to change this behavior). So when we receive new props we derive the latest list of `availableCheeses` and ensure our options are always unique.

# YOU MADE IT

That's it. It's all over. Time to run your SPA and make sure everything works well. If you haven't designed a `<HomeView>` component now is a good time to do so. You can put anything you want there but if you need an idea what about describing the project, what it does, linking to the repo, and some topics you learned while creating it?

Ok, I lied. We still have to deploy our project. Luckily this is a dead simple process using [Netlify](https://www.netlify.com/). Head over to [5-deployment.md](./5-deployment.md) to see your shiny new project live on the web in just a few minutes!
