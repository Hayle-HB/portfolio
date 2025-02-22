import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectTheme } from "./features/theme/themeSlice";
import NavBar from "./components/NavBar/NavBar";
import MainBody from "./components/MainBody/MainBody";

const App = () => {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <NavBar />
      <MainBody />
      {/* Add more sections or components here */}
    </div>
  );
};

export default App;
