import ar from "../../Local/ar";
import en from "../../Local/en";

const initialState = {
  lang: "en",
  content: en,
  direction: "ltr",
};

//Reducer
export default function LangReducer(state = initialState, action) {
  switch (action.type) {
    case "TOGGLE_LANG":
      if (state.lang === "en") {
        return {
          lang: "ar",
          content: ar,
          direction: "rtl",
        };
      } else {
        return {
          lang: "en",
          content: en,
          direction: "ltr",
        };
      }
    default:
      return state;
  }
}
