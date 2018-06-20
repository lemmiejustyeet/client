import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";

if (location.hash.substring(1)) {
    if (location.hash.substring(1) === "revoked") {
        window.localStorage.removeItem("discordauthkey");
    } else {
        localStorage.setItem("discordauthkey", location.hash.substring(1));
    }

    location.hash = "";
    history.replaceState(null, document.title, window.location.pathname);
}

ReactDOM.render(
    <App />,
    document.getElementById("root") as HTMLElement
);
registerServiceWorker();
