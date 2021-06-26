import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {

  const [value,setValue] = useState("");
  const [menu,setMenu] = useState("");
  const [stockPrice, setStockPrice] = useState([])
  const [stockInfo, setStockInfo] = useState([])

  return (
    <AppContext.Provider value={{value, setValue, menu, setMenu, stockPrice, setStockPrice, stockInfo, setStockInfo}}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}