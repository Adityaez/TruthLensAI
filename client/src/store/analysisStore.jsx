import { createContext, useContext, useState } from "react";

const AnalysisContext = createContext(null);

export function AnalysisProvider({ children }) {
  const [history, setHistory] = useState([]); // array of AnalysisResult

  const addResult = (result) => setHistory((prev) => [result, ...prev]);
  const getResult = (id) => history.find((r) => r.id === id);

  return (
    <AnalysisContext.Provider value={{ history, addResult, getResult }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export const useAnalysis = () => useContext(AnalysisContext);
