import React, { createContext, useContext } from 'react';
import { AppsStore } from './AppsStore';
import { AuthStore } from './AuthStore';

const appsStore = new AppsStore();
const authStore = new AuthStore();

const StoresContext = createContext({ appsStore, authStore });

export function StoresProvider({ children }: { children: React.ReactNode }) {
  return (
    <StoresContext.Provider value={{ appsStore, authStore }}>
      {children}
    </StoresContext.Provider>
  );
}

export function useStores() {
  return useContext(StoresContext);
}
