import { createContext, useContext, useState } from "react";

type CreateProximityContextType = { editingMode: boolean,setEditingMode: React.Dispatch<React.SetStateAction<boolean>> };

const CreateProximityContext = createContext<CreateProximityContextType>(null);

export function CreateProximityContextProvider({ children }) {
  const [editingMode, setEditingMode] = useState(false);
  
  return (
    <CreateProximityContext.Provider value={{editingMode,setEditingMode}}>
      {children}
    </CreateProximityContext.Provider>
  );
}

export function useCreateProximityProvider() {
  return useContext(CreateProximityContext);
}
