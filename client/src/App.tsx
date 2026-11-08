import { BrowserRouter } from "react-router";
import { Router } from "./Router";
import "./App.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}

export default App;
