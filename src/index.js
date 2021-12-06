import "bootstrap/dist/css/bootstrap.min.css";
import "./css/main.css";

import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import { BrowserRouter } from "react-router-dom";


render( <BrowserRouter>
    <App />
  </BrowserRouter>, document.getElementById("root"));
