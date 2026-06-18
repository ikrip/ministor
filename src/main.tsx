import * as React from 'react';
import * as ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { StoresProvider } from "./stores";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* StoresProvider даёт всем компонентам доступ к store через useStores() */}
      <StoresProvider>
        <App />
      </StoresProvider>
    </React.StrictMode>,
  );
}
