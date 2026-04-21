import { useEffect, useState } from "react";
import API from "../api/api";

import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  MenuItem,
  Grid,
  Box
} from "@mui/material";

// 🔹 Import images
import broilerImg from "../assets/broiler.png";
import layerImg from "../assets/layer.png";
import countryImg from "../assets/country.png";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    pricePerKg: "",
    availableKg: "",
    category: "Broiler"
  });

  const [category, setCategory] = useState("All");

  // 🔹 Fetch products
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Add product
  const handleSubmit = async () => {
    try {
      if (!form.name || !form.pricePerKg || !form.availableKg) {
        alert("Please fill all fields");
        return;
      }

      if (form.pricePerKg <= 0 || form.availableKg <= 0) {
        alert("Values must be positive");
        return;
      }

      await API.post("/products", {
        ...form,
        pricePerKg: Number(form.pricePerKg),
        availableKg: Number(form.availableKg)
      });

      alert("Product added successfully ✅");

      setForm({
        name: "",
        pricePerKg: "",
        availableKg: "",
        category: "Broiler"
      });

      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  // 🔹 Filter products
  const filteredProducts =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  // 🔹 Categories with images
  const categories = [
    { name: "Broiler", img: broilerImg },
    { name: "Layer", img: layerImg },
    { name: "Country", img: countryImg }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Products
      </Typography>

      {/* 🔥 CATEGORY IMAGE CARDS */}
      <Button
        variant={category === "All" ? "contained" : "outlined"}
        onClick={() => setCategory("All")}
        sx={{ mb: 3 }}
      >
        All Products
      </Button>

      <Grid container spacing={3} sx={{ mb: 4 }}>
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
                    ? "3px solid #2e7d32"
                    : "1px solid #ccc",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.03)"
                }
              }}
            >
              <img
                src={cat.img}
                alt={cat.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover"
                }}
              />

              <Typography
                align="center"
                sx={{ p: 1, fontWeight: "bold" }}
              >
                {cat.name}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 🔹 Add Product Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Product
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Price per Kg"
              name="pricePerKg"
              type="number"
              value={form.pricePerKg}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Available Kg"
              name="availableKg"
              type="number"
              value={form.availableKg}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} md={2}>
            <TextField
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="Broiler">Broiler</MenuItem>
              <MenuItem value="Layer">Layer</MenuItem>
              <MenuItem value="Country">Country</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12} md={1}>
            <Button
              variant="contained"
              fullWidth
              sx={{ height: "100%" }}
              onClick={handleSubmit}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 🔹 Products Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell><b>Price (₹/kg)</b></TableCell>
              <TableCell><b>Available (kg)</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>₹{p.pricePerKg}</TableCell>
                  <TableCell>{p.availableKg}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No products available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}