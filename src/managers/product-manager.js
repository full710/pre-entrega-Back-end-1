import { promises as fs } from "fs"

class ProductManager {
    static ultId = 0
    constructor(path) {
        this.products = []
        this.path = path
        this.init()
    }

   
    async init() {
        try {
            const arrayProductos = await this.leerArchivo()
            if (arrayProductos.length > 0) {
                ProductManager.ultId = Math.max(...arrayProductos.map(item => item.id))
                this.products = arrayProductos
            }
        } catch (error) {
            console.error("Error al inicializar los productos:", error)
        }
    }

   
    async addProduct({ title, description, price, img, code, stock }) {
        
        if (!title || !description || !price || !img || !code || !stock) {
            throw new Error("Todos los campos son obligatorios.")
        }

        
        if (this.products.some(item => item.code === code)) {
            throw new Error("El código debe ser único.")
        }

        
        const nuevoProducto = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        };

       
        this.products.push(nuevoProducto)

        await this.guardarArchivo()
    }

    
    async getProducts() {
        return this.products
    }

    
    async getProductById(id) {
        const producto = this.products.find(item => item.id === id)
        if (!producto) {
            throw new Error("Producto no encontrado")
        }
        return producto
    }

    async guardarArchivo() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2))
        } catch (error) {
            throw new Error("Error al guardar el archivo.");
        }
    }

   
    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8")
            return JSON.parse(respuesta)
        } catch (error) {
            throw new Error("Error al leer el archivo.")
        }
    }
}

export default ProductManager
