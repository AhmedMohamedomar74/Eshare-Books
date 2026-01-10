import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store.jsx";
import { SnackbarProvider } from "notistack";

const DirectionWrapper = ({ children }) => {
  const { direction } = useSelector((state) => state.lang);
  return (
    <div dir={direction} className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={3000}
      >
        <DirectionWrapper>
          <App />
        </DirectionWrapper>
      </SnackbarProvider>
    </Provider>
  </StrictMode>
);
