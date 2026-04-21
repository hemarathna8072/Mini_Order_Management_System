import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";

import Products from "./pages/Products";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Dashboard from "./pages/Dashboard";

import bgImage from "./assets/image.png"; // 👈 your image

function App() {
  return (
    <Router>

      {/* 🔥 Background */}
      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >

        {/* 🔥 Overlay */}
        {/* <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: "rgba(255,255,255,0.1)"
          }}
        > */}

          {/* 🔷 Navbar */}
          <AppBar position="static">
            <Container maxWidth="lg">
              <Toolbar disableGutters>

                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                  Order Management
                </Typography>

                <Button color="inherit" component={Link} to="/">Dashboard</Button>
                <Button color="inherit" component={Link} to="/products">Products</Button>
                <Button color="inherit" component={Link} to="/orders">Orders</Button>
                <Button color="inherit" component={Link} to="/place-order">Place Order</Button>

              </Toolbar>
            </Container>
          </AppBar>

          {/* 🔷 Page Content */}
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/place-order" element={<PlaceOrder />} />
            </Routes>
          </Container>

        </Box>
      {/* </Box> */}

    </Router>
  );
}

export default App;