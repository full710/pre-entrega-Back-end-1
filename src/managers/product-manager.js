import { promises as fs } from "fs";

class ProductManager {
    static ultId = 0;  // Variable estática para llevar el control del ID máximo
    constructor(path) {
        this.products = []; 
        this.path = path;  // La ruta al archivo que se pasará al constructor
        this.init();  // Inicializamos la carga de productos al inicio
    }

    // Cargar productos al iniciar la clase
    async init() {
        try {
            const arrayProductos = await this.leerArchivo();
            if (arrayProductos.length > 0) {
                ProductManager.ultId = Math.max(...arrayProductos.map(item => item.id)); // Asignar el ID más alto
                this.products = arrayProductos;
            }
        } catch (error) {
            console.error("Error al inicializar los productos:", error);
        }
    }

    // Método para agregar un producto
    async addProduct({ title, description, price, img, code, stock }) {
        // Validamos que todos los campos estén presentes
        if (!title || !description || !price || !img || !code || !stock) {
            throw new Error("Todos los campos son obligatorios.");
        }

        // Validamos que el código sea único
        if (this.products.some(item => item.code === code)) {
            throw new Error("El código debe ser único.");
        }

        // Creamos el nuevo producto
        const nuevoProducto = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        };

        // Agregamos el producto al array de productos
        this.products.push(nuevoProducto);

        // Guardamos el array actualizado en el archivo
        await this.guardarArchivo();
    }

    // Obtener todos los productos
    async getProducts() {
        return this.products;
    }

    // Obtener un producto por su ID
    async getProductById(id) {
        const producto = this.products.find(item => item.id === id);
        if (!producto) {
            throw new Error("Producto no encontrado");
        }
        return producto;
    }

    // Guardar los productos en el archivo
    async guardarArchivo() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            throw new Error("Error al guardar el archivo.");
        }
    }

    // Leer el archivo y devolver los productos
    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            return JSON.parse(respuesta);
        } catch (error) {
            throw new Error("Error al leer el archivo.");
        }
    }
}

export default ProductManager;
