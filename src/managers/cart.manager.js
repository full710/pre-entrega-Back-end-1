import fs from 'fs/promises'; // Usamos fs.promises para operaciones asincrónicas

class CartManager {
    constructor(filePath) {
        this.carts = []; 
        this.path = filePath;  // Ruta directa al archivo
        this.ultId = 0; 

        // Cargamos los carritos desde el archivo
        this.cargarCarritos(); 
    }

    // Método para cargar los carritos desde el archivo
    async cargarCarritos() {
        try {
            const data = await fs.readFile(this.path, "utf-8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                // Verificamos si hay carritos y obtenemos el mayor ID
                this.ultId = Math.max(...this.carts.map(cart => cart.id));
            }
        } catch (error) {
            // Si el archivo no existe o hay un error, lo creamos
            await this.guardarCarritos();
        }
    }

    // Método para guardar los carritos en el archivo
    async guardarCarritos() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2)); 
    }

    // Crear un nuevo carrito
    async crearCarrito() {
        const nuevoCarrito = {
            id: ++this.ultId,
            products: []
        };

        this.carts.push(nuevoCarrito);
        // Guardamos el array de carritos en el archivo
        await this.guardarCarritos();
        return nuevoCarrito;
    }

    // Obtener un carrito por su ID
    async getCarritoById(cartId) {
        const carrito = this.carts.find(c => c.id === cartId);
        if (!carrito) {
            throw new Error(`No existe un carrito con el id ${cartId}`);
        }
        return carrito;
    }

    // Agregar un producto al carrito
    async agregarProductoAlCarrito(cartId, productId, quantity = 1) {
        const carrito = await this.getCarritoById(cartId);

        // Verificamos si el producto ya está en el carrito
        const existeProducto = carrito.products.find(p => p.product === productId);

        // Si el producto ya existe, incrementamos la cantidad
        if (existeProducto) {
            existeProducto.quantity += quantity;
        } else {
            // Si el producto no está, lo agregamos
            carrito.products.push({ product: productId, quantity });
        }

        // Guardamos los cambios en el archivo
        await this.guardarCarritos();
        return carrito;
    }
}

export default CartManager;
