import { createContext, useState, useContext, useMemo } from "react";

const MainScreenContext = createContext(null);

export function MainScreenContextProvider({ children }) {
	const [count, setcount] = useState(0);

	const exported = {
		refresh: count,
		doRefresh: () => setcount(count => count + 1)
	}


	return (
		<MainScreenContext.Provider value={exported}>
			{children}
		</MainScreenContext.Provider>
	);
}

export function useMainScreenContext() {
	return useContext(MainScreenContext);
}
