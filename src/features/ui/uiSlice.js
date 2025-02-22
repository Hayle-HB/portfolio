import { createSlice } from "@reduxjs/toolkit";

const getScreenSize = () => {
  const width = window.innerWidth;
  if (width < 640) return "xs"; // Extra small devices
  if (width < 768) return "sm"; // Small devices
  if (width < 1024) return "md"; // Medium devices
  if (width < 1280) return "lg"; // Large devices
  if (width < 1536) return "xl"; // Extra large devices
  return "2xl"; // 2XL devices and up
};

const initialState = {
  screenSize: getScreenSize(),
  isMobile: window.innerWidth < 768,
  isTablet: window.innerWidth <= 1024 && window.innerWidth > 768,
  isDesktop: window.innerWidth > 1024,
  windowWidth: window.innerWidth,
  windowHeight: window.innerHeight,
  isDarkTheme: localStorage.getItem("darkTheme") === "true" || false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    updateScreenSize: (state) => {
      state.screenSize = getScreenSize();
      state.windowWidth = window.innerWidth;
      state.windowHeight = window.innerHeight;
      state.isMobile = window.innerWidth < 768;
      state.isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
      state.isDesktop = window.innerWidth > 1024;
    },
    toggleTheme: (state) => {
      state.isDarkTheme = !state.isDarkTheme;
      localStorage.setItem("darkTheme", state.isDarkTheme);
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
  },
});

// Selectors
export const selectScreenSize = (state) => state.ui.screenSize;
export const selectIsMobile = (state) => state.ui.isMobile;
export const selectIsTablet = (state) => state.ui.isTablet;
export const selectIsDesktop = (state) => state.ui.isDesktop;
export const selectWindowDimensions = (state) => ({
  width: state.ui.windowWidth,
  height: state.ui.windowHeight,
});

export const { updateScreenSize, toggleTheme, setIsMobile } = uiSlice.actions;
export default uiSlice.reducer;
