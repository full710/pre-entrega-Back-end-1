

import express from "express"
import cartRouter from "./routes/cart.router.js"
import productRouter from "./routes/product.router.js"

const app = express()
const PUERTO = 8080


app.use(express.json())


app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter);


app.get("/", (req, res) => {
  res.send("Servidor de e-commerce en funcionamiento.")
});


app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`)
})
