import express from "express"
import CartManager from "../managers/cart.manager.js"

const router = express.Router()
const cartManager = new CartManager('src/data/carrito.json')


router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await cartManager.crearCarrito()
        res.status(201).json(nuevoCarrito)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})


router.get("/:cid", async (req, res) => {
    const { cid } = req.params
    try {
        const carrito = await cartManager.getCarritoById(parseInt(cid))
        res.json(carrito.products)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
})


router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params
    try {
        const carrito = await cartManager.agregarProductoAlCarrito(parseInt(cid), parseInt(pid), 1)
        res.status(200).json(carrito)
    } catch (error) {
        res.status(404).json({ error: error.message })
    }
});

export default router
