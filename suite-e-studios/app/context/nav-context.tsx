/** @format */

import * as React from "react";

import { useNavigation, useRoute } from "@react-navigation/native";

import { useUser } from "./user-context";

interface NavContextType {
  showBottomNav: boolean;
  activeRoute: string;
  tabs: NavTab[];
  setShowBottomNav: (show: boolean) => void;
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

interface NavTab {
  name: string;
  target: string;
  onPress: () => void;
}

const NavContext = React.createContext<NavContextType | undefined>(undefined);

export const NavProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showBottomNav, setShowBottomNav] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("Home");
  const { state: userState } = useUser();
  const navigation = useNavigation<any>();
  const route = useRoute();

  const tabs: NavTab[] = React.useMemo(() => {
    if (route.name === "Checklists") {
      return [
        {
          name: "Checklists",
          target: "checklists",
          onPress: () => {},
        },
        {
          name: "Task Lists",
          target: "tasklists",
          onPress: () => {},
        },
        {
          name: "Tasks",
          target: "tasks",
          onPress: () => {},
        },
      ];
    }

    const defaultTabs = [
      {
        name: "Home",
        target: "Home",
        onPress: () => navigation.navigate("Home"),
      },
      {
        name: "Settings",
        target: "Settings",
        onPress: () => navigation.navigate("Settings"),
      },
    ];

    if (userState.user?.roleId === "admin") {
      return [
        ...defaultTabs,
        {
          name: "Checklists",
          target: "Checklists",
          onPress: () =>
            navigation.navigate("Checklists", {
              initialTab: "checklists",
            }),
        },
      ];
    }

    return defaultTabs;
  }, [userState.user, navigation, route.name]);

  React.useEffect(() => {
    if (userState.user) {
      setShowBottomNav(true);
    } else {
      setShowBottomNav(false);
    }
  }, [userState.user]);

  return (
    <NavContext.Provider
      value={{
        showBottomNav,
        activeRoute: route.name,
        tabs,
        setShowBottomNav,
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
