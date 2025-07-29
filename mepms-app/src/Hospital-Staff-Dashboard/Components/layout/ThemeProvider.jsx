import React, { createContext, useContext, useState, useMemo } from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

const ThemeToggleContext = createContext();

export const useThemeToggle = () => useContext(ThemeToggleContext);

const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState("light");

  const toggleTheme = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        typography: {
          fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        },
      }),
    [mode]
  );

  return (
    <ThemeToggleContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeToggleContext.Provider>
  );
};

export default ThemeProvider;
