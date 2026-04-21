import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#2e7d32" }, // green
    secondary: { main: "#ff9800" }
  },
  typography: {
    fontFamily: "Poppins, sans-serif"
  }
});

export default theme;