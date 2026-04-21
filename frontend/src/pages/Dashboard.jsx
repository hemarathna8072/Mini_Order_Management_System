import { useEffect, useState } from "react";
import API from "../api/api";
import "../App.css"
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Chip
} from "@mui/material";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pending: 0
  });

  const [orders, setOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchSummary();
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchSummary = async () => {
    const res = await API.get("/orders/summary");
    setSummary(res.data);
  };

  const fetchOrders = async () => {
    const res = await API.get("/orders");

    // 🔥 FIX: sort latest first
    const sorted = res.data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setOrders(sorted.slice(0, 5));
  };

  const fetchProducts = async () => {
    const res = await API.get("/products");

    // 🔥 Low stock logic
    const low = res.data.filter(p => p.availableKg < 10);

    setLowStock(low);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Dashboard
      </Typography>

      {/* 🔥 SUMMARY */}
      <Grid container spacing={3}>
        <Grid >
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography>Total Orders</Typography>
            <Typography variant="h4">{summary.totalOrders}</Typography>
          </Paper>
        </Grid>

        <Grid >
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography>Total Revenue</Typography>
            <Typography variant="h4" color="green">
              ₹{summary.totalRevenue}
            </Typography>
          </Paper>
        </Grid>

        <Grid >
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Typography>Pending Orders</Typography>
            <Typography variant="h4" color="orange">
              {summary.pending}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 🔥 RECENT ORDERS */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Recent Orders</Typography>

        {orders.length > 0 ? (
          orders.map((order) => (
            <Paper key={order._id} sx={{ p: 2, mb: 2 }}>
              <Typography>
                <b>{order.customerName}</b> — ₹{order.totalAmount}
              </Typography>
              <Typography variant="body2">
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography>No orders</Typography>
        )}
      </Box>

      {/* 🔥 LOW STOCK SECTION */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Low Stock Products</Typography>

        {lowStock.length > 0 ? (
          lowStock.map((p) => (
            <Paper
              key={p._id}
              sx={{
                p: 2,
                mb: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Typography>{p.name}</Typography>

              <Chip
                label={`${p.availableKg} kg left`}
                color="error"
              />
            </Paper>
          ))
        ) : (
          <Typography>No low stock items</Typography>
        )}
      </Box>

    </Container>
  );
}