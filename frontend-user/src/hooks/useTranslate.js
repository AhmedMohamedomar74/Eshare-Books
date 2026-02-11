import { useSelector } from "react-redux";

export default function useTranslate() {
  const { content, direction, lang } = useSelector((state) => state.lang);

  const t = (key, fallback = "") => {
    return content?.[key] ?? fallback ?? key;
  };

  return { t, direction, lang };
}
