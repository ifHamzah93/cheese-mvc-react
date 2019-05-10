# Cheese SPA Deployment
- go to [netlify.com](https://netlify.com) and register for a free account
    - use your GitHub login
- click [new site from git] button
- continuous deployment: choose GitHub
    - authorize netlify
- click the [Can’t see your repo here? Configure Netlify app on GitHub] link at the bottom
- on GitHub
    - select [only selected repositories]
    - in the dropdown select your Cheese React project
    - save 
- go back to Netlify
    - you may have to refresh the page
- select your repo
- basic build settings
    - if you are using the forked repo (with `walkthrough/` and `code/`)
        - you need to set the base directory to `code`  
    - build command: `npm run build`
    - publish directory: `build`
- click advanced build settings
    - new variable
    - key: `REACT_APP_API_DOMAIN`
    - value: `https://obscure-shore-17091.herokuapp.com/<your-load-balancer-IP>/api`
        - this uses a proxy server that adds a CORS header to requests
        - if you have your own domain name you can set up SSL certs on the load balancer and send requests directly to the API
        - otherwise you will get a CORS error because our Netlify site is served over `https` but our API is not
- add `_redirects` file to `public/` directory in your project

`public/_redirects` (no file extension)

```sh
/* /index.html 200
```  

- push your code to master
- look at the deploys section of Netlify for your deployed link!