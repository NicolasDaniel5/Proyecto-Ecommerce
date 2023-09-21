import { comprarProducto } from "./carrito.js";
import { eliminarProducto } from "./admin.js";


const inicio = document.getElementById("iniciarSesion");
const divProductos = document.getElementById("productos");
const buscar = document.getElementById("buscador");
let usuarioLogueado = JSON.parse(sessionStorage.getItem("usuario"));


const traerProductos = async () => {
    try {
        const response = await fetch("./db/productos.json");
        const data = await response.json();
        localStorage.setItem("productos",JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }

}
traerProductos();
export let productosDisponibles = JSON.parse(localStorage.getItem("productos"));

document.addEventListener("DOMContentLoaded", () => {

    if(usuarioLogueado === null){
       const a = document.createElement("a");
       a.className ="nav-a";
       a.href = "./html/iniciarSesion.html";
       a.innerHTML = "iniciar sesion";
       inicio.appendChild(a);
    }else{
      const p = document.createElement("p");
      const close = document.createElement("button");
      p.className ="nav-a";
      p.innerHTML = `bienvenido ${usuarioLogueado.user}`;
      close.id = "cerrarSesion";
      close.innerHTML ="cerrar sesion";
      close.addEventListener("click", () => {
        sessionStorage.removeItem("usuario");
        sessionStorage.removeItem("carrito");
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Greacias por comprar en nuestra tienda. Usuario deslogeado',
          showConfirmButton: false,
          timer: 2000
        })
        setTimeout(() => {location.reload()},2000);
      })
      inicio.appendChild(p);
      inicio.appendChild(close);
    }

    generarProductos(productosDisponibles);

})

export const generarProductos = (productos) => {
    divProductos.innerHTML = "";
  
    productos.forEach((producto) => {

    const { imagen, nombre, categoria, precio, id } = producto;
     
      let card = document.createElement("div");
      card.className = "producto";
      card.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img src="${imagen}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${nombre}</h5>
                <p class="card-text">$${precio}</p>
                <a id=btn${id} class="btn color-boton">agregar al carrito</a>
                ${usuarioLogueado?.admin === true ? `<button id = "eliminar${id}" class ="btn btn-danger">eliminar</button>` : ""}
            </div>
        </div>`;
  
      divProductos.appendChild(card);

      const btnComprar = document.getElementById(`btn${id}`);
      btnComprar.addEventListener("click", () => {
        if(usuarioLogueado !== null){
          comprarProducto(id);
        }else{
          Swal.fire({
            title: 'Debe iniciar sesion para poder comprar productos',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          })
        }
        
      });
      
      if(usuarioLogueado?.admin === true){
        const btnEliminar = document.getElementById(`eliminar${id}`);
        btnEliminar.addEventListener("click", () => {
          

          Swal.fire({
            title: 'Estas seguro?',
            text: "Una vez eliminado, ¡no podrá recuperar este producto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Borrar'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Eliminado!',
                'El producto fue eliminado',
                'success'
              )
              eliminarProducto(id);
            }
          })
          
          });
      }
  
    });
  };


buscar.addEventListener("keyup", (e) => {
    const productosEncontrados = productosDisponibles.filter((producto) => producto.nombre.toLowerCase().includes(e.target.value));
    productosDisponibles = productosEncontrados;

  if(e.target.value !== ""){
    generarProductos(productosEncontrados);
  }else{
    productosDisponibles = JSON.parse(localStorage.getItem("productos"));
    generarProductos(productosDisponibles);
  }
  
})