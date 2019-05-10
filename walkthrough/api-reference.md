# API Reference for the Cheese REST API
The Cheese API is a "RESTful-ish" API. Meaning that while it adheres to the resource endpoint naming pattern it does not fully implement any known REST specifications. For an introductory API it will serve its purpose. But if you are looking for a good example of a truly RESTful API [take a look at this guide and example](https://restfulapi.net/rest-api-design-tutorial-with-example/).

## Entity reference

```js
// CheeseEntity
{
  id: Number;
  name: String
  description: String
  category: CategoryEntity
}

// CategoryEntity
{
  id: Number
  name: String
}

// MenuEntity
{
  id: Number
  name: String
  cheeses: [CheeseEntity]
}
```

## Endpoint reference

Any endpoint that has a `:name` subpath indicates that it is a _variable path_`. This means you should put in a value for this subpath when making a request. For example if you were requesting a specific cheese at `/cheeses/:cheeseID` and the cheese you wanted had an ID of 5 then your request would be for `GET cheeses/5`.

- Cheese
  - cheeses collection: `/cheeses/`
    - `GET`: get all the cheeses
      - response: `[CheeseEntity]`
    - `POST`: create a new cheese entity
      - request data: `{ name: String, description: String, categoryID: Number }`
      - response: `CheeseEntity`
  - cheese entity: `/cheeses/:cheeseID`
    - `GET`: get the cheese details
      - response: `CheeseEntity`
    - `DELETE`: delete the cheese
      - response status: `200` (should be `204`)
  - cheeses collection by category: `/cheeses/category/:categoryID`
    - `GET`: get all the cheeses for the category
      - response: `[CheeseEntity]`
- Category
  - categories collection: `/categories/`
    - `GET`: get all the categories
      - response: `[CategoryEntity]`
    - `POST`: create a new category entity
      - request data: `{ name: String }`
      - response: `CategoryEntity`
- Menu
  - menus collection: `/menus/`
    - `GET`: get all the menus
      - response: `[MenuEntity]`
    - `POST`: create a new menu entity
      - request data: `{ name: String }`
      - response: `MenuEntity`
  - menu entity: `/menus/:menuID`
    - `GET`: get the menu details
      - response: `MenuEntity`
  - menu cheeses sub-collection: `/menus/:menuID/cheeses`
    - `GET`: get all the cheeses in the menu
      - response: `[CheeseEntity]`
    - `POST`: add a cheese to the menu
      - request data: `{ cheeseID }`
      - response status: `201`
    - `DELETE`: remove a cheese from the menu
      - request data: `{ cheeseID }`
      - response status: `201` (should be `204`)
