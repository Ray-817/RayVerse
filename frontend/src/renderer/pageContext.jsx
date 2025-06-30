/* eslint-disable react-refresh/only-export-components */
// src/renderer/PageContext.jsx
import React, { useContext } from "react";

const PageContext = React.createContext();

function PageContextProvider({ pageContext, children }) {
  return (
    <PageContext.Provider value={pageContext}>{children}</PageContext.Provider>
  );
}

function usePageContext() {
  return useContext(PageContext);
}

export { PageContext, PageContextProvider, usePageContext };
