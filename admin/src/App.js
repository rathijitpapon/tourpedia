import React from "react";
import MainLayout from "./layouts";
import {BrowserRouter} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}

export default App;
