import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import router from "./routes/router.jsx";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { SnackbarProvider } from 'notistack';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <App /> */}
    <AuthProvider>
      <SnackbarProvider  maxSnack={3}
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </AuthProvider>
  </StrictMode>
);
