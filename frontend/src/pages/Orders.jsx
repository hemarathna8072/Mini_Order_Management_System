import { useEffect, useState } from "react";
import API from "../api/api";

import {
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Box,
  Button,
  Stack
} from "@mui/material";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");

      // 🔥 latest orders first
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrders(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Orders
      </Typography>

      {orders.map((order) => (
        <Paper key={order._id} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 3 }}>

          {/* 🔹 Top Section */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography><b>Name:</b> {order.customerName}</Typography>
              <Typography><b>Phone:</b> {order.customerPhone}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography><b>Total:</b> ₹{order.totalAmount}</Typography>
              <Typography>
                <b>Date:</b> {new Date(order.createdAt).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>

          {/* 🔹 Items */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1"><b>Items:</b></Typography>

            {order.items.map((item, i) => (
              <Typography key={i} sx={{ ml: 2 }}>
                • {item.productId?.name || "Product"} —{" "}
                {item.quantityKg}kg × ₹{item.pricePerKg}
              </Typography>
            ))}
          </Box>

          {/* 🔥 Status + Actions */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            {/* ✅ EXACT COLORS */}
            <Chip
              label={order.status}
              sx={{
                backgroundColor:
                  order.status === "Pending"
                    ? "#fbc02d"   // 🟡 Yellow
                    : order.status === "Confirmed"
                    ? "#1976d2"   // 🔵 Blue
                    : order.status === "Delivered"
                    ? "#2e7d32"   // 🟢 Green
                    : "#d32f2f",  // 🔴 Red
                color: "#fff",
                fontWeight: "bold"
              }}
            />

            {/* 🔹 Actions */}
            <Stack direction="row" spacing={1}>
              {order.status === "Pending" && (
                <>
                  <Button
                    variant="contained"
                    onClick={() =>
                      updateStatus(order._id, "Confirmed")
                    }
                  >
                    Confirm
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                      updateStatus(order._id, "Cancelled")
                    }
                  >
                    Cancel
                  </Button>
                </>
              )}

              {order.status === "Confirmed" && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() =>
                      updateStatus(order._id, "Delivered")
                    }
                  >
                    Deliver
                  </Button>

                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                      updateStatus(order._id, "Cancelled")
                    }
                  >
                    Cancel
                  </Button>
                </>
              )}

              {(order.status === "Delivered" ||
                order.status === "Cancelled") && (
                <Typography color="text.secondary">
                  No actions available
                </Typography>
              )}
            </Stack>
          </Box>

        </Paper>
      ))}

      {orders.length === 0 && (
        <Typography>No orders found</Typography>
      )}
    </Container>
  );
}