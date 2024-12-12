import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";

const root = ReactDOM.createRoot(document.getElementById("root"));


const client = new ApolloClient({
  uri: 'http://localhost:4040/graphql', 
  cache: new InMemoryCache(), 
});
root.render(
  <ApolloProvider client={client}>
    <RouterProvider router={routes} />
  </ApolloProvider>
);
