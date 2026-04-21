import { useEffect, useState } from "react";
import API from "../api/api";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  Paper
} from "@mui/material";

// 🔹 Images
import broilerImg from "../assets/broiler.png";
import layerImg from "../assets/layer.png";
import countryImg from "../assets/country.png";


export default function PlaceOrder() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");

  const [items, setItems] = useState({});
  const [total, setTotal] = useState(0);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // 🔹 Fetch products
  useEffect(() => {
    API.get("/products").then((res) => setProducts(res.data));
  }, []);

  // 🔹 Categories
  const categories = [
    { name: "Broiler", img: broilerImg },
    { name: "Layer", img: layerImg },
    { name: "Country", img: countryImg }
  ];

  // 🔹 Filter products
  const filteredProducts =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  // 🔹 Change quantity
  const changeQty = (product, change) => {
    const current = items[product._id]?.quantityKg || 0;
    const newQty = current + change;

    if (newQty < 0) return;
    if (newQty > product.availableKg) return;

    const updated = { ...items };

    if (newQty === 0) {
      delete updated[product._id];
    } else {
      updated[product._id] = {
        productId: product._id,
        quantityKg: newQty,
        pricePerKg: product.pricePerKg,
        name: product.name
      };
    }

    setItems(updated);

    // 🔥 Live total
    const newTotal = Object.values(updated).reduce(
      (acc, i) => acc + i.quantityKg * i.pricePerKg,
      0
    );

    setTotal(newTotal);
  };

  // 🔹 Submit order
  const handleSubmit = async () => {
  try {
    if (!customerName || !customerPhone) {
      alert("Enter customer details");
      return;
    }

    // 🔥 FRONTEND VALIDATION (IMPORTANT)
    if (!/^[6-9]\d{9}$/.test(customerPhone)) {
      alert("Enter valid 10-digit phone number");
      return;
    }

    const orderItems = Object.values(items);

    if (orderItems.length === 0) {
      alert("Add products");
      return;
    }

    await API.post("/orders", {
      customerName,
      customerPhone,
      items: orderItems
    });

    alert("Order placed successfully ✅");

    // reset
    setItems({});
    setTotal(0);
    setCustomerName("");
    setCustomerPhone("");

  } catch (err) {
    console.error(err);

    // 🔥 SHOW BACKEND MESSAGE
    const message =
      err.response?.data?.message || "Something went wrong";

    alert(message);
  }
};

  return (
    <Container maxWidth={false} sx={{ px: 4 }}>
      <Typography variant="h5">Place Order</Typography>

      {/* 🔹 Customer Details */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid>
          <TextField
            label="Customer Name"
            fullWidth
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </Grid>

        <Grid>
          <TextField
            label="Customer Phone"
            fullWidth
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </Grid>
      </Grid>

      {/* 🔥 Category Images */}
      <Button
        variant={category === "All" ? "contained" : "outlined"}
        onClick={() => setCategory("All")}
        sx={{ mt: 3 }}
      >
        All
      </Button>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {categories.map((cat) => (
          <Grid item xs={12} md={4} key={cat.name}>
            <Paper
              onClick={() => setCategory(cat.name)}
              sx={{
                cursor: "pointer",
                borderRadius: 3,
                overflow: "hidden",
                border:
                  category === cat.name
                    ? "3px solid green"
                    : "1px solid #ccc"
              }}
            >
              <img
                src={cat.img}
                alt={cat.name}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <Typography align="center" sx={{ p: 1 }}>
                {cat.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 🔥 Product Cards */}
      <Grid container spacing={2} sx={{ mt: 3 }}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} md={6} key={product._id}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography>
                  ₹{product.pricePerKg}/kg | Available: {product.availableKg}kg
                </Typography>

                {/* Quantity Controls */}
                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Button onClick={() => changeQty(product, -1)}>-</Button>

                  <Typography sx={{ mx: 2 }}>
                    {items[product._id]?.quantityKg || 0} kg
                  </Typography>

                  <Button onClick={() => changeQty(product, 1)}>+</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔥 Order Summary */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Order Summary</Typography>

        {Object.values(items).map((item) => (
          <Typography key={item.productId}>
            {item.name} → {item.quantityKg}kg × ₹{item.pricePerKg} =
            ₹{item.quantityKg * item.pricePerKg}
          </Typography>
        ))}
      </Box>

      {/* 🔥 Total */}
      <Typography variant="h5" sx={{ mt: 2, color: "green" }}>
        Total: ₹{total}
      </Typography>

      {/* 🔹 Submit */}
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSubmit}
      >
        Place Order
      </Button>
    </Container>
  );
}