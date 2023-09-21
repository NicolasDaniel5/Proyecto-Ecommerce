const btnRegister = document.getElementById("btnRegister");
const formRegister = document.getElementById("userRegister");
const formLogin = document.getElementById("userLogin");
const btnLogin = document.getElementById("btnLogearse");

class newUser{
    constructor(user, pass){
        this.id = usuarios.length + 1
        this.user = user
        this.pass = pass
        this.admin = false
    }
}

const traerUsuarios = async () => {
    try {
        const response = await fetch("/db/usuarios.json");
        const data = await response.json();
        localStorage.setItem("usuarios", JSON.stringify(data));
    }catch (error) {
        console.log(error);
    }

}
traerUsuarios();
let usuarios = JSON.parse(localStorage.getItem("usuarios"));



btnLogin?.addEventListener("click", (e) => {
    e.preventDefault();;

    const user = formLogin.children[0].children[1].value;
    const pass = formLogin.children[1].children[1].value;

    validarYlogear(user, pass);



})

const validarYlogear = (user, pass) => {

    const userExiste = usuarios.find((usuario)  => usuario?.user === user);

    if(userExiste === undefined || userExiste.pass !== pass){
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Usuario o contraseña incorrectos',
          })
    }else{
        let usuario = {
            user: userExiste.user,
            pass: userExiste.pass,
            admin: userExiste.admin
        }
        sessionStorage.setItem("usuario", JSON.stringify(usuario));
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Sesion Iniciada',
            showConfirmButton: false,
            timer: 2000
          })
        setTimeout(() => {location.href = "/index.html"},2000);    
    } 
}


btnRegister?.addEventListener("click", (e) => {
    e.preventDefault();
    const user = formRegister.children[0].children[1].value;
    const pass = formRegister.children[1].children[1].value;

    const nuevoUsuario = new newUser(user, pass);

    validarYRegistrar(nuevoUsuario);
})


const validarYRegistrar = (nuevoUsuario) => {

    const userNuevo = usuarios.find((usuario) => usuario?.user === nuevoUsuario.user);
    if(userNuevo === undefined){

        usuarios.push(nuevoUsuario);
        //Guardo el usario en el localStorage,lo que pasa es que saca los datos de un archivo.Json entonces al recargar la pagina trae los datos del archivo y pisa localStorage actual
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        sessionStorage.setItem("usuario", JSON.stringify(nuevoUsuario));
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Gracias por registrarse',
            text: 'sera redirigido a la pagina principal',
            showConfirmButton: false,
            timer: 2000
          })
        setTimeout(() => {location.href = "/index.html"},2000);   
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'El usuario ya existe, inicias sesion',
            confirmButtonText: 'confirmar'
          })
    }

}