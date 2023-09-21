import { productosDisponibles } from "./inicio.js";

JSON.parse(sessionStorage.getItem("carrito")) === null && sessionStorage.setItem("carrito", JSON.stringify([]));


document.addEventListener("DOMContentLoaded", () => {
    dibujarCarrito();
})


let carrito = JSON.parse(sessionStorage.getItem("carrito"));
const listaCarrito = document.getElementById("items");
const footCarrito = document.getElementById("totales");
const btnCarrito = document.getElementById("btnCarrito");

const carritoTable = document.getElementById("carrito");


btnCarrito?.addEventListener("click", () => {    
    if(carritoTable.style.display === "block"){
        carritoTable.style.display = "none";
    }else{
        carritoTable.style.display = "block";
        dibujarCarrito();
    }
    
    })

export const comprarProducto = (idProducto) => {

    const producto = productosDisponibles.find((producto) => producto.id === idProducto);

    const { nombre, precio, imagen, id } = producto;

    const productoCarrito = carrito.find((producto) => producto.id === idProducto);

    if(productoCarrito === undefined){
        const nuevoProductoCarrito = {
            id: id,
            nombre: nombre,
            precio: precio,
            imagen: imagen,
            cantidad: 1
        }

    carrito.push(nuevoProductoCarrito);
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    }else{
        const indexProductoCarrito = carrito.findIndex((producto) => producto.id === idProducto);

        carrito[indexProductoCarrito].cantidad++;
        carrito[indexProductoCarrito].precio = precio * carrito[indexProductoCarrito].cantidad;

        sessionStorage.setItem("carrito", JSON.stringify(carrito));
    }
    carrito = JSON.parse(sessionStorage.getItem("carrito"));


}

const dibujarCarrito = () => {

    listaCarrito.innerHTML = " ";
    if(carrito != null){
        carrito.forEach(producto => {
            const {id,nombre,precio,imagen,cantidad} = producto;
            let body = document.createElement("tr");
            body.className = "producto_carrito";
            body.innerHTML = `
            <th><img id="fotoProductoCarrito" src="${imagen}"</th>
            <td>${nombre}</td>
            <td>${cantidad}</td>
            <td>${precio /cantidad}</td>
            <td>${precio}</td>
            <td>
            <button id="-${id}" class="btn btn-danger">-</button>
            <button id="+${id}" class="btn btn-success">+</button>
            </td>
            `;
    
            listaCarrito.append(body);
            const btnSumar = document.getElementById(`+${id}`);
            const btnRestar = document.getElementById(`-${id}`);
    
            btnSumar.addEventListener("click", () => agregarCantidad(id));
            btnRestar.addEventListener("click", () => restarCantidad(id));
        });
    }

    dibujarFooter();
}

const dibujarFooter = () => {

    if(carrito.length > 0){
        footCarrito.innerHTML = "";

        let footer = document.createElement("tr");

        footer.innerHTML = `
        <th><b>Totales:</b></th>
        <td></td>
        <td>${generarTotales().cantidadTotal}</td>
        <td></td>
        <td>${generarTotales().costoTotal}</td>
        <td>
        <button id ="btnFinalizarCompra" class = "btn btn-comprar" >Comprar</button>
        </td>
        `;
        footCarrito.append(footer);
        const btnComprar = document.getElementById("btnFinalizarCompra");
        btnComprar.addEventListener("click", () => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Gracias por su compra',
                showConfirmButton: false,
                timer: 2000
              })
            sessionStorage.setItem("carrito", JSON.stringify([]));
            setTimeout(() => {location.reload()},2000);
        })
    }else{
        footCarrito.innerHTML = "<h3>No hay producto en carrito</h3>";
    }

}


const generarTotales = () => {
    const costoTotal = carrito.reduce((total, { precio }) => total + precio, 0);
    const cantidadTotal = carrito.reduce((total, {cantidad}) => total + cantidad, 0);

    return {
        costoTotal: costoTotal,
        cantidadTotal: cantidadTotal
    }
}

const agregarCantidad = (id) => {
    const indexProductoCarrito = carrito.findIndex((producto) => producto.id === id);
    const precio = carrito[indexProductoCarrito].precio / carrito[indexProductoCarrito].cantidad;

    carrito[indexProductoCarrito].cantidad++;
    carrito[indexProductoCarrito].precio = precio*carrito[indexProductoCarrito].cantidad;

    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    dibujarCarrito();

}

const restarCantidad = (id) => {
    const indexProductoCarrito = carrito.findIndex((producto) => producto.id === id);
    const precio = carrito[indexProductoCarrito].precio / carrito[indexProductoCarrito].cantidad;

    carrito[indexProductoCarrito].cantidad--;
    carrito[indexProductoCarrito].precio = precio*carrito[indexProductoCarrito].cantidad;

    if(carrito[indexProductoCarrito].cantidad === 0){
        carrito.splice(indexProductoCarrito, 1);
    }

    sessionStorage.setItem("carrito", JSON.stringify(carrito));
    dibujarCarrito();



}