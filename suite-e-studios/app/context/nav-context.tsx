/** @format */

import * as React from "react";

import { useNavigationState } from "@react-navigation/native";
import { useUser } from "./user-context";

interface NavContextType {
  activeRoute: string;
  tabs: NavTab[];
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

export interface NavTab {
  name: string;
  target: string;
}

const NavContext = React.createContext<NavContextType | undefined>(undefined);

export const NavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeTab, setActiveTab] = React.useState("tasks");
  const { state: userState } = useUser();
  const routeName = useNavigationState(
    (state) => state?.routes[state.index]?.name
  );

  const tabs: NavTab[] = React.useMemo(() => {
    return [
      {
        name: "1. Tasks",
        target: "tasks",
      },
      {
        name: "2. Task Lists",
        target: "tasklists",
      },
      {
        name: "3. Checklists",
        target: "checklists",
      },
    ];
  }, []);

  return (
    <NavContext.Provider
      value={{
        activeRoute: routeName || "",
        tabs,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export const useNav = () => {
  const context = React.useContext(NavContext);
  if (context === undefined) {
    throw new Error("useNav must be used within a NavProvider");
  }
  return context;
};
