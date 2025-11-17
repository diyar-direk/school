import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
export const Context = createContext({});
const Provider = ({ children }) => {
  const { i18n } = useTranslation();
  const [isClosed, setIsClosed] = useState(
    JSON.parse(localStorage.getItem("isClosed")) || false
  );

  useEffect(() => {
    if (i18n.language === "ar") document.body.classList.add("arabic");
    else document.body.classList.remove("arabic");
  }, [i18n.language]);

  return (
    <Context.Provider
      value={{
        isClosed,
        setIsClosed,
      }}
    >
      {children}
    </Context.Provider>
  );
};
export default Provider;
