import { generarProductos, productosDisponibles } from "./inicio.js";

const btnAgregar = document.getElementById("agregarProducto");
const usuarioLogueado = JSON.parse(sessionStorage.getItem("usuario"));
const agregarProductos = document.getElementById("formAgregar");
const btnModificar = document.getElementById("modificarProducto");
const divProductos = document.getElementById("productos");

class Producto{
    constructor(nombre,precio,imagen,categorias){
      this.id = productosDisponibles.length + 1;
      this.nombre = nombre;
      this.precio = precio;
      this.imagen = imagen;
      this.categorias = categorias; 
    }

}

export const eliminarProducto = (id) => {
    const productoEliminar = productosDisponibles.findIndex((producto) => producto.id === id);
    productosDisponibles.splice(productoEliminar,1);
    localStorage.setItem("productos", JSON.stringify(productosDisponibles));
    generarProductos(JSON.parse(localStorage.getItem("productos")));
} 

usuarioLogueado?.admin === true ? (btnAgregar.style.display = "block") : (btnAgregar.style.display = "none");
usuarioLogueado?.admin === true ? (btnModificar.style.display = "block") : (btnModificar.style.display = "none");

btnAgregar.addEventListener("click", () => generarVistaAgregar());

const generarVistaAgregar = () => {
    agregarProductos.innerHTML = "";
    agregarProductos.style.display = "block";

    
    const form = document.createElement("form");
    form.className ="form__agregar__hijo";

    form.innerHTML = ` 
    <div>
    <label for="nombre">Nombre:</label>
    <input type="text" name="" id="nombre" />
  </div>
  <div>
    <label for="precio">Precio:</label>
    <input type="text" name="" id="precio" />
  </div>
  <div>
    <label for="imagen">Imagen:</label>
    <input type="text" name="" id="imagen" />
  </div>
  <div>
    <label for="categoria">Categoria:</label>
    <input type="text" name="" id="categoria" />
  </div>
<button id="cargar" class="btn btn-primary" type="button">Cargar</button>
<button id="cerrar" class="btn btn-danger" type="button"> X Cerrar</button>

    `;
    agregarProductos.appendChild(form);

    const btnCargar = document.getElementById("cargar");
    btnCargar.addEventListener("click", (e) => {
        e.preventDefault();
        guardarProducto();
    })
    const btnCerrar = document.getElementById("cerrar");
    btnCerrar.addEventListener("click", (e) => {
        agregarProductos.style.display = "none";
    })

}

const guardarProducto = () => {
  const nombre = agregarProductos.children[0][0].value;
  const precio = agregarProductos.children[0][1].value;
  const imagen = agregarProductos.children[0][2].value;
  const categoria = agregarProductos.children[0][3].value;

  if(nombre !== "" && precio !== "" && imagen !== "" && categoria !== ""){
      const nuevoProducto = new Producto(nombre,precio,imagen,categoria);
      productosDisponibles.push(nuevoProducto);
      localStorage.setItem("productos",JSON.stringify(productosDisponibles));
      agregarProductos.style.display = "none";
      generarProductos(productosDisponibles);
  }else{
    alert("alguno valos no estan completos")
  }

}


btnModificar.addEventListener("click", () => { editarProductos()});

const editarProductos = () => {
  divProductos.innerHTML = "";

  productosDisponibles.forEach((producto) => {
    let card = document.createElement("div");
    card.className = "producto";
    card.innerHTML = `
      <div class="card" style="width: 18rem;">
      <img class="card-img-top" src="${producto.imagen}" alt="Card image cap">
      <p>Imagen: <input type="text" value="${producto.imagen}"></p>
      <p>Nombre: <input type="text" value="${producto.nombre}"></p>
      <p>Precio: <input type="text" value="${producto.precio}"></p>
      <p>Categoria: <input type="text" value="${producto.categorias}"></p>
      <div class="card-body">
      <button id="boton${producto.id}" class="btn btn-success">Modificar</button>
      <button id="cancelar${producto.id}" class="btn btn-danger">Cancelar</button>
      </div>
  
      </div>`;

    divProductos.appendChild(card);
    const btnAceptar = document.getElementById(`boton${producto.id}`)
    const btnCancelar = document.getElementById(`cancelar${producto.id}`)

    btnAceptar.addEventListener("click", (e) => modificarProducto(e,producto.id))
    btnCancelar.addEventListener("click", () => generarProductos(productosDisponibles))
  });
}



const modificarProducto = (e,id) => {
  const productoIndice = productosDisponibles.findIndex((produc) => produc.id === id);
  const imagen = e.target.parentElement.parentElement.children[1].children[0].value;
  const nombre = e.target.parentElement.parentElement.children[2].children[0].value;
  const precio = e.target.parentElement.parentElement.children[3].children[0].value;
  const categorias = e.target.parentElement.parentElement.children[4].children[0].value;

  productosDisponibles[productoIndice].imagen = imagen;
  productosDisponibles[productoIndice].nombre = nombre;
  productosDisponibles[productoIndice].precio = precio;
  productosDisponibles[productoIndice].categorias = categorias;

  localStorage.setItem("productos",JSON.stringify(productosDisponibles));
  generarProductos(productosDisponibles);
}

