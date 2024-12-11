import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { LocationProvider, AuthProvider } from "./components/context.tsx";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="977456214845-rff6kbe0o5devaqeklpulj1hb5cbplu3.apps.googleusercontent.com">
      <AuthProvider>
        <LocationProvider>
          <App />
        </LocationProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
