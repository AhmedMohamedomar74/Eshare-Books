const savedMode = localStorage.getItem("mode") || "light";

const initialState = {
  mode: savedMode, // "light" | "dark"
};

export default function ThemeReducer(state = initialState, action) {
  switch (action.type) {
    case "TOGGLE_THEME": {
      const newMode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("mode", newMode);

      return { mode: newMode };
    }

    case "SET_THEME": {
      localStorage.setItem("mode", action.payload);
      return { mode: action.payload };
    }

    default:
      return state;
  }
}
