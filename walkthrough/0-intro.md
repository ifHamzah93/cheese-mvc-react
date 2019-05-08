# Cheese MVC React SPA Walkthrough

Walkthrough for a Cheese MVC React SPA + REST API build and deployment.

## Walkthrough Order

- [intro.md](./0-intro.md): introduction, reference, and background
  - Cheese REST API reference
  - background on SPAs, AJAX, and Web APIs
- [config.md](./1-config.md): base configuration of the project
  - topics
    - Create React App
    - installing dependencies
    - React Router configuration
  - components
    - `<CheeseNav>`
    - `<Footer>`
- [categories-view.md](./2-categories-view.md): developing the first view for categories
  - topics
    - registering React Router routes
    - view and child components
    - the declarative cycle approach
    - stateful components
    - form validation
    - the Axios library
    - making AJAX requests
    - prop types
  - components
    - `<Route>`s
    - `<CategoriesView>`
    - `<CategoryForm>`
    - `<CategoriesList>`
- [cheeses-view.md](./3-cheeses-view.md): developing the second view for cheeses
  - topics
    - conditional expressions in JSX
    - dynamic (multi-use) components
    - setting state using current state
    - multi-input forms and validation
  - components
    - `<CheesesView>`
    - `<CheeseForm>`
    - `<CheeseCategorySelector>`
    - `<CheesesList>`
- [menus-view.md](./4-menus-view.md): developing the final views for menus
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

## References

- [Cheese API reference](./api-reference.md): refer to this when implementing API requests
  - API resource shapes
  - API endpoints and behaviors
- [React Component State & Lifecycle](https://reactjs.org/docs/state-and-lifecycle.html)
- [React Bootstrap](https://react-bootstrap.github.io/components/alerts)
- [React Router](https://reacttraining.com/react-router/web/guides/quick-start)
- [Axios AJAX request library](https://www.npmjs.com/package/axios)

# Concepts Covered

## Pre-requisites
- React minimums
  - JSX with HTML and React components
  - component state and basic usage of `setState()`
- JavaScript minimums
  - basic ES6 classes and methods
  - importing and exporting ES6 modules
  - using Promises with `.then()` and `async/await`)
  - Array methods `map()` and `filter()`
  - spreading and destructuring Objects and Arrays

## Conceptual

- What is a Single Page Application
- How do SPAs differ from Server Side Rendering
- What is an AJAX request
- What is JSON
- What is a Web API
- What is a REST API
- What roles does a SPA play as a consumer of a REST API
- How does separating a SPA and an API support modern web development

## Practical

- How to design a site with view components and constituent components
- How and when to use stateful and stateless components
- How to manage the state of a stateful component
- How to manage interactions between Parent and Child components
- How to add prop-types to components for "type safety" and readability
- How to perform client-side validation in a React form
- How to make AJAX requests to a Web API
- How to manage routing in a SPA using React Router
- How to deploy a SPA on Netlify
- How to deploy a Web API on AWS

# Background

Up until now we have built all of our client-facing frontends using server side rendering [SSR] with templates. Recall that dynamic websites use SSR to render a template according to the context of the request. The context carried information about the path and method, requesting user, what they wanted to see, and other details that affected what we rendered in response. When views are rendered according to context they are referred to as dynamic sites rather than static, hard-coded, HTML.

Today we will begin exploring an increasingly popular alternative to developing a frontend - the single page application [SPA]. SPAs are web applications that require no reloading from traditional navigation across views in the browser. They are hosted on a web server that supplies the two minimum requirements of a SPA - a base HTML file and a JavaScript "bundle" file. This bundle file uses a frontend framework to render views client-side, in the user's browser, rather than server-side using SSR.

A SPA by itself is considered a static site. This may seem counter-intuitive because its content is generated programatically using JavaScript. However, the only content that the bundle may ever generate has been "hard coded" like an HTML file and can only change if a developer intervenes.

SPAs can be made dynamic by providing an external data source. Incoming data can change how and what is rendered by the SPA code. Since all of the rendering is done client-side that data must be interacted with remotely through HTTP requests. This remote interaction between a SPA and a data source is supported by two web technologies - AJAX requests and Web APIs.

## How SPAs Work

In traditional static or SSR dynamic websites the HTML is served according to the requested path from the browser. Each time a new path is entered or navigated to (by clicking a link) a request is made to the host server and the page reloads when the new view is received in response. When the address of the SPA site is requested the host server only needs to provide two documents - a base HTML file and a JavaScript bundle file. Navigation requests after this point do not require page reloads - hence the name Single Page Application!

The base HTML file is very simple and serves to provide a header (for meta information, style sheets, and optional third party JavaScript) and a body with a single `<div>` which serves as the **root div**. This root div is what the JavaScript bundle will attach to and, using JavaScript, render the views. You might be wondering "how can a single JavaScript file manage to build and update an entire navigable website?" The answer is in modern technologies called **front end frameworks**.

A frontend framework operates similar to the backend frameworks we have explored - such as Flask and Spring. They provide a basis for building a SPA through the use of reusable **components**. Think of a component as a template fragment. It has a distinct purpose, is dynamic depending on the data injected into it, and can be reused both within and across projects. Each component represents some single or collective HTML tags that the browser uses to render the view. Rather than hard-coding this HTML we rely on JavaScript to convert our component instructions _on the fly_ (at runtime).

The [most popular frontend framework](https://insights.stackoverflow.com/survey/2019#technology-_-web-frameworks) is React but two other notable frameworks are Angular and Vue. Frontend frameworks differ in how they convert JavaScript instructions into components and manage efficient update rendering into HTML. But all of them operate under the same base concept. You write JavaScript that instructs the framework on how you want the site to appear, you bundle these instructions into a single file, and the framework manages the creation and updating of that content once the bundle has loaded.

Once the bundle has been received and processed by the browser no other server requests are needed for rendering in the browser. Future network requests are only used to manage external data using AJAX requests and Web APIs.

## AJAX Requests

Instead of relying on a server to manage and inject data into templates with SSR, a SPA receives its data remotely through a special type of request called AJAX. An AJAX request stands for asynchronous JavaScript XML request. It is a special kind of HTTP request sent from the browser to a server. The server the AJAX requests are sent to are often a special kind of server known as a Web API.

Before we learn about how AJAX requests work let's understand how JavaScript works as a programming language. JavaScript is a single-threaded programming language. Single threaded languages do things synchronously - waiting for the previous operation to complete before proceeding to the next. When an operation takes a long time to complete it is considered to be "blocking" the next operation. This mechanism can lead to unresponsive programs. In the case of JavaScript running in a browser this means the page will freeze - not acceptable for modern web applications!

But JavaScript is a clever toad. Because it was originally designed for the browser it has a special mechanism for handling many processes at once without blocking. This mechanism is called the [event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop) and is a relatively complex topic that is outside of the scope of this guide. If you want to learn more about the event loop [this is an awesome video](https://www.youtube.com/watch?v=8aGhZQkoFbQ) that explains it visually.

For our purposes we just need to understand the term for using the event loop is called asynchronous programming. As the name suggests instead of doing things synchronously (serial, one after the other) we can do things asynchronously (concurrently, one without waiting for the other).

When a network request is made it takes some time for the response to come back. This request and response speed is dependent on a number of factors like server upload and client download speeds or heavy traffic slowing down the server. This is why pages load at different speeds depending on your internet connection and how popular the site is at the time.

As the name suggests, AJAX requests are asynchronous meaning they do not block the browser while waiting for a response. They also do not cause page reloading like traditional requests we have experienced before. Because of their asynchronous nature AJAX requests let us make requests _in the background_ to provide a better user experience.

Imagine if every time you _liked_ a post on FaceBook that the entire page reloaded causing you to lose your place on the pace. Or while uploading a file you were forced to stare only at a loading bar that guessed its progress. Instead you expect to continue to use the rest of the site and see real-time loading information.

The solution to both of these examples of bad UX are to use AJAX requests. We instruct our JavaScript to make an asychronous request on behalf of the user and update us when the results are returned. We then use this response data to update parts of the page without reloading for a seamless user experience.

Back when the term was coined the primary encoding format used was for transmitting data over HTTP was XML. This is the same format used to configure parts of Java applications. In modern JavaScript, and many other web-facing languages, nearly all communication of data uses the newer encoding standard called JSON.

## JSON

JSON stands for JavaScript Object Notation and is a way to share JavaScript-styled objects, key-value data structures, over the HTTP. Because the HTTP needs to be agnostic of the web application language (Java, Python, JavaScript, etc.) it needs to define data formats that any language can understand. JSON encoding lets us send and receive complex data objects by converting them into the JSON format accepted by the HTTP.

Modern JavaScript usage of AJAX requests communicate primarily through JSON but the term has been ubiquitous for so long that it hasn't, and likely never will, be renamed to AJAJ(SON)! So how does JSON get transmitted between the browser and a server? Through the use of another web development technology - Web APIs.

## Web APIs

While a SPA can be developed statically without any additional communication with the server, most modern web applications are expected to be dynamic. A SPA with no backend is considered a static page - whatever is available when the bundle loads is all that will ever be available. In order to make a SPA dynamic, like our SSR views, a Web Application Programming Interface [API] is used. In the world of web development the term API is used since the context of it being web-based is implied.

An API is a backend server made up of a Model and Controller layer that responds with data rather than HTML. In simple terms it is a standalone service that manages and communicates its data to a consumer application, typically a View layer like our standalone SPA. Instead of the server rendering HTML views with data it sends and receives the raw data itself which the consumer then uses to update the View.

An API is accessible via **endpoints** which are URL paths for the server that provide access and management of the data in its underlying database. In order to ensure data integrity and security an API can protect its endpoints in the same ways we learned before - authentication, authorization, validation, and sanitization. An API's endpoints are protected depending on the use case and business requirements. The protection of its endpoints fall along a spectrum of being completely public, private, or a mixture of the two. Every properly designed API will have documentation that explains how it should be used.

There are many design patterns used to write consistent, robust, and extendable APIs. We refer to these patterns as specifications. These are guidelines and best practices that leaders in the Web API field have put together to provide dependable interactions on the web.

The two most popular specifications are [OpenAPI REST](https://swagger.io/specification/) and, most recently, GraphQL. RESTful APIs are very common and will likely remain for many years to come. But GraphQL is quickly becoming a big player in the world of API design. Many major companies have already, or are in the process of, converting their legacy REST APIs to GraphQL. In this course we will not be covering GraphQL but it is a fascinating specification that is worth looking into [on your own time](https://graphql.org/).

## REST APIs

There are numerous aspects of RESTful design that depend on which specification is being followed. For this guide we will be focusing on the information relevant to consuming a REST API rather than designing one.

At its core a REST API operates under the concept of _state transfer_ which is where the name **RE**presentational **S**tate **T**ransfer comes from. This API design uses endpoints to provide CRUD operations on the state of the data it manages. The data a REST API manages is referred to as its resources.

Each resource can be interacted with as a whole or individual part. The whole resource is referred to as the **collection** and a single entry within the collection is called an **entity**. For example, a `users` collection would be made up of individual `user` entities. The **state** of the `users` collection would be represented as a list of `user` entries in a database. The state of one `user` entity would be the current data stored in the database entry's fields like `id`, `username`, etc.

A REST API _exposes_ (makes available) endpoints to the states of these resources through URLs. An endpoint is the `/resource/path` that the server will handle requests for to interact with that resource's state. These URL endpoints rely on HTTP methods to describe the actions the API consumer would like to take on the respective state. These are mappings between databae CRUD operations and HTTP methods like creating (`POST`), reading (`GET`), upating (`PUT/PATCH`), and deleting (`DELETE`).

In RESTful design endpoints are preferably named as nouns while the HTTP method used to access the endpoint are the verbs. In this way the interacting with the state of a resource can be thought of as "do [verb] to resource [noun]". A well designed REST API can be consumed by sending requests to the resource endpoint with an HTTP method describing what action you would like to take.

## Benefits of the SPA + API design

We have learned that encapsulation of the layers in our web applications is beneficial. The MVC design that we use in a SSR application is similar in the SPA + API combination. In the case of the SPA this means we can "physically" separate our frontend code (View) from our backend code (Model/Controller). By separating the frontend from the backend we are able to provide a lightning fast user experience while also managing and protecting our data separately.

This separation of the view from the controller and data models allows teams across the "full stack" to operate mostly independently of each other. The frontend team can spend its time designing and implementing the user interface. The backend team can focus on secure and consistent data management.

They can work separate from each other through the "contract" that is formed by the backend API and its frontend consumer. The teams only need to communicate when changes or additions to the API endpoints need to be made. The backend does not have to be re-packaged and deployed when changes are made to the view since they are hosted and deployed separately.

This sort of design supports the dynamic nature of modern web-based businesses that require fast turnaround on changes to the visualization and management of its data.
