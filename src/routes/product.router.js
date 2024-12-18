import express from "express";
import ProductManager from "../managers/product-manager.js"; // Importa tu ProductManager

const router = express.Router();
const productManager = new ProductManager('./src/data/productos.json'); // Ruta al archivo de productos

// Obtener todos los productos con limit
router.get("/", async (req, res) => {
    const { limit } = req.query; // Obtiene el parámetro limit de la query
    try {
        const productos = await productManager.getProducts();
        if (limit) {
            res.json(productos.slice(0, parseInt(limit))); // Devuelve los primeros 'limit' productos
        } else {
            res.json(productos); // Devuelve todos los productos
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener un producto por ID
router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const producto = await productManager.getProductById(parseInt(pid));
        res.json(producto);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Crear un nuevo producto
router.post("/", async (req, res) => {
    const { title, description, price, img, code, stock } = req.body;
    try {
        await productManager.addProduct({ title, description, price, img, code, stock });
        res.status(201).send("Producto creado exitosamente");
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Actualizar un producto
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const { title, description, price, img, code, stock } = req.body;
    try {
        const producto = await productManager.getProductById(parseInt(pid));
        producto.title = title || producto.title;
        producto.description = description || producto.description;
        producto.price = price || producto.price;
        producto.img = img || producto.img;
        producto.code = code || producto.code;
        producto.stock = stock || producto.stock;
        
        await productManager.guardarArchivo();
        res.status(200).send("Producto actualizado exitosamente");
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Eliminar un producto
router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const productos = await productManager.getProducts();
        const nuevoArray = productos.filter(item => item.id !== parseInt(pid));
        productManager.products = nuevoArray;
        await productManager.guardarArchivo();
        res.status(200).send("Producto eliminado exitosamente");
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default router;
