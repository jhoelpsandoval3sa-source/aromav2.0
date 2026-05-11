// =========================
// CAMBIO DE VISTAS
// =========================
function mostrarvista(vista){
    document.getElementById("view-registro").classList.remove("active");
    document.getElementById("view-home").classList.remove("active");
    document.getElementById("view-menu").classList.remove("active");
    document.getElementById("view-cart").classList.remove("active");
    document.getElementById("view-contact").classList.remove("active");

    document.getElementById("view-" + vista).classList.add("active");
}




document.addEventListener("DOMContentLoaded", function(){

const formRegistro = document.getElementById("registroForm");

if(formRegistro){

formRegistro.addEventListener("submit", async function(e){
e.preventDefault();

const nombre = document.getElementById("regNombre").value;
const correo = document.getElementById("regCorreo").value;
const password = document.getElementById("regPassword").value;

const { data, error } = await db.auth.signUp({
email: correo,
password: password,
options:{
data:{
nombre:nombre
}
}
});

if(error){
alert("❌ " + error.message);
}else{
alert("✅ Cuenta creada correctamente");
formRegistro.reset();
mostrarvista("home");
}

});

}

});







// =========================
// PRODUCTOS
// =========================
const productos = [
    { id:1, nombre:"cafe", descripcion:"cafe clasico", precio:12, imagen:"img/cafe.jpg" },
    { id:2, nombre:"brownie", descripcion:"masa de chocolate", precio:8, imagen:"img/brownie.jpg" },
    { id:3, nombre:"capuccino", descripcion:"expreso con leche", precio:18, imagen:"img/capuccino.jpg" },
    { id:4, nombre:"cuernito", descripcion:"masa con queso", precio:10, imagen:"img/cuernito.jpg" },
    { id:5, nombre:"empanada", descripcion:"relleno con queso", precio:7, imagen:"img/empanada.jpg" },
    { id:6, nombre:"helado", descripcion:"artesanal", precio:15, imagen:"img/helado.jpg" },
    { id:7, nombre:"donas", descripcion:"glaseado chocolate", precio:8, imagen:"img/donas.jpg" },
    { id:8, nombre:"pastel", descripcion:"con crema y frutas", precio:12, imagen:"img/pastel.jpg" }
];

let carrito = [];


// =========================
// RENDER PRODUCTOS
// =========================
function renderizarproducto() {
    const contenedor = document.getElementById("products-container");
    let html = "";

    productos.forEach(p => {
        html += `
        <div class="product-card">
            <h3>${p.nombre}</h3>
            <img src="${p.imagen}" alt="${p.nombre}">
            <span>Bs ${p.precio}</span>

            <button class="btn-comprar" onclick="comprar(${p.id})">
                Comprar
            </button>
        </div>`;
    });

    contenedor.innerHTML = html;
}


// =========================
// AGREGAR AL CARRITO
// =========================
function comprar(id) {
    const producto = productos.find(p => p.id === id);
    const existe = carrito.find(p => p.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    renderizarCarrito();
    actualizarContador();
}


// =========================
// AUMENTAR / DISMINUIR
// =========================
function aumentarCantidad(id) {
    const p = carrito.find(p => p.id === id);
    if (p) p.cantidad++;

    renderizarCarrito();
    actualizarContador();
}

function disminuirCantidad(id) {
    const p = carrito.find(p => p.id === id);

    if (p) {
        p.cantidad--;
        if (p.cantidad <= 0) {
            carrito = carrito.filter(x => x.id !== id);
        }
    }

    renderizarCarrito();
    actualizarContador();
}


// =========================
// RENDER CARRITO
// =========================
function renderizarCarrito() {
    const contenedor = document.getElementById("view-cart");

    let html = "<h2>Carrito</h2>";

    if (carrito.length === 0) {
        html += "<p>Tu carrito está vacío</p>";

        html += `
        <div class="cart-actions">
            <button class="btn-vaciar" onclick="vaciarCarrito()">
                Vaciar carrito
            </button>

            <button class="btn-pagar" onclick="pagar()">
                Pagar por WhatsApp
            </button>
        </div>
        `;
    } else {

        let total = 0;
        let totalCantidad = 0;

        html += `
        <div class="cart-table">
            <div class="cart-header">
                <span>Producto</span>
                <span>Descripción</span>
                <span>Precio</span>
                <span>Cantidad</span>
            </div>
        `;

        carrito.forEach(p => {
            const subtotal = p.precio * p.cantidad;
            total += subtotal;
            totalCantidad += p.cantidad;

            html += `
            <div class="cart-row">
                <span>${p.nombre}</span>
                <span>${p.descripcion}</span>
                <span>Bs ${subtotal}</span>

                <div class="cantidad-box">
                    <button onclick="disminuirCantidad(${p.id})">−</button>
                    <span>${p.cantidad}</span>
                    <button onclick="aumentarCantidad(${p.id})">+</button>
                </div>
            </div>`;
        });

        html += `</div>`;

        html += `
        <div class="cart-summary">
            <div>Total productos: ${totalCantidad}</div>
            <div class="total">Bs ${total}</div>
        </div>

        <div class="cart-actions">
            <button class="btn-vaciar" onclick="vaciarCarrito()">
                Vaciar carrito
            </button>

            <button class="btn-pagar" onclick="pagar()">
                Pagar por WhatsApp
            </button>
        </div>
        `;
    }

    contenedor.innerHTML = html;
}


// =========================
// CONTADOR NAV
// =========================
function actualizarContador() {
    const contador = document.getElementById("cart-count");

    let total = 0;
    carrito.forEach(p => total += p.cantidad);

    contador.textContent = total;

    if (total > 0) {
        contador.classList.add("active");
    } else {
        contador.classList.remove("active");
    }
}


// =========================
// VACIAR CARRITO
// =========================
function vaciarCarrito() {
    carrito = [];
    renderizarCarrito();
    actualizarContador();
}


// =========================
// PAGAR POR WHATSAPP
// =========================
function pagar() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío");
        return;
    }

    let mensaje = "🛒 *Pedido Cafetería*%0A%0A";
    let total = 0;

    carrito.forEach(p => {
        const subtotal = p.precio * p.cantidad;
        total += subtotal;

        mensaje += `• ${p.nombre} x${p.cantidad} = Bs ${subtotal}%0A`;
    });

    mensaje += `%0A💰 *Total: Bs ${total}*`;

    const numero = "59164916803";

    const url = `https://wa.me/${numero}?text=${mensaje}`;
    window.open(url, "_blank");

    carrito = [];
    renderizarCarrito();
    actualizarContador();
}


// =========================
// FORMULARIO CONTACTO
// =========================
document.addEventListener("DOMContentLoaded", function(){

    const form = document.getElementById("formContacto");

    form.addEventListener("submit", function(e){
        e.preventDefault();

        let nombre = document.getElementById("nombre");
        let correo = document.getElementById("correo");
        let mensaje = document.getElementById("mensaje");

        let valido = true;

        limpiarErrores();

        if(nombre.value.trim() === ""){
            mostrarError(nombre, "El nombre es obligatorio");
            valido = false;
        }

        if(correo.value.trim() === ""){
            mostrarError(correo, "El correo es obligatorio");
            valido = false;
        } else if(!validarEmail(correo.value)){
            mostrarError(correo, "Correo inválido");
            valido = false;
        }

        if(mensaje.value.trim() === ""){
            mostrarError(mensaje, "El mensaje no puede estar vacío");
            valido = false;
        }

        if(!valido) return;

        emailjs.send("service_4r0zhsb", "template_0now3v8", {
            name: nombre.value,
            email: correo.value,
            message: mensaje.value
        })
        .then(function() {
            alert("Mensaje enviado ✅");
            form.reset();
            limpiarErrores();
        })
        .catch(function(error) {
            console.log(error);
            alert("Error ❌");
        });

    });

    function validarEmail(email){
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function mostrarError(input, mensaje){
        input.classList.add("error");

        let small = document.createElement("small");
        small.classList.add("mensaje-error");
        small.innerText = mensaje;

        input.parentNode.appendChild(small);
    }

    function limpiarErrores(){
        document.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
        document.querySelectorAll(".mensaje-error").forEach(el => el.remove());
    }

});


renderizarCarrito();


// =========================
// INICIO
// =========================
document.addEventListener("DOMContentLoaded", function() {
    renderizarproducto();     // ← Aquí estaba el error
    renderizarCarrito();
    actualizarContador();
});