
// Importar dependencias
import express from "express";
import cartRouter from "./routes/cart.router.js";
import productRouter from "./routes/product.router.js";

const app = express();
const PUERTO = 8080;

// Middleware para procesar JSON
app.use(express.json());

// Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// Mensaje para ruta base
app.get("/", (req, res) => {
  res.send("Servidor de e-commerce en funcionamiento.");
});

// Iniciar el servidor
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});
