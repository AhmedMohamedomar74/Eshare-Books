import ar from "../../Local/ar";
import en from "../../Local/en";

const initialState = {
  lang: "en",
  content: en,
};

//Reducer
export default function LangReducer(state = initialState, action) {
  switch (action.type) {
    case "TOGGLE_LANG":
      if (state.lang === "en") {
        return {
          lang: "ar",
          content: ar,
        };
      } else {
        return {
          lang: "en",
          content: en,
        };
      }
    default:
      return state;
  }
}
