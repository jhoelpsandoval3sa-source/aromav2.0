// ======================================
// app.js ORDENADO - CAFETERIA JHOEL
// ======================================

// =========================
// CAMBIO DE VISTAS
// =========================
function mostrarvista(vista) {
    document.querySelectorAll(".view").forEach(sec => {
        sec.classList.remove("active");
    });

    document.getElementById("view-" + vista).classList.add("active");
}

// =========================
// VARIABLES GLOBALES
// =========================
let productos = [];
let carrito = [];

// =========================
// INICIAR PAGINA
// =========================
document.addEventListener("DOMContentLoaded", async () => {

    // revisar sesión
    const { data } = await db.auth.getSession();

    if (data.session) {
        entrarSistema();
    } else {
        mostrarvista("home"); // invitado
    }

    // recordar correo
    const correo = localStorage.getItem("correo");

    if (correo && document.getElementById("loginCorreo")) {
        loginCorreo.value = correo;
        loginCorreo.readOnly = true;
    }

    await cargarProductos();

    renderizarCarrito();
    actualizarContador();

    iniciarLogin();
    iniciarRegistro();
    iniciarContacto();
});

// =========================
// LOGIN
// =========================
function iniciarLogin() {

    const form = document.getElementById("loginForm");
    if (!form) return;

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const email = loginCorreo.value;
        const password = loginPassword.value;

        const { error } = await db.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert("Correo o contraseña incorrectos");
            return;
        }

        localStorage.setItem("correo", email);

        entrarSistema();
    });
}

// =========================
// REGISTRO
// =========================
function iniciarRegistro() {

    const form = document.getElementById("registroForm");
    if (!form) return;

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const nombre = regNombre.value;
        const correo = regCorreo.value;
        const password = regPassword.value;

        const { error } = await db.auth.signUp({
            email: correo,
            password: password,
            options: {
                data: {
                    nombre: nombre
                }
            }
        });

        if (error) {
            alert(error.message);
            return;
        }

        localStorage.setItem("correo", correo);

        alert("Cuenta creada correctamente");

        form.reset();

        mostrarvista("login");
    });
}

// =========================
// ENTRAR SISTEMA
// =========================
async function entrarSistema() {

    document.querySelector("nav").style.display = "flex";

    mostrarvista("home");
}

// =========================
// CERRAR SESION
// =========================
async function cerrarSesion() {
    await db.auth.signOut();
    location.reload();
}

// =========================
// OTRA CUENTA
// =========================
function usarOtraCuenta() {
    localStorage.removeItem("correo");

    loginCorreo.readOnly = false;
    loginCorreo.value = "";
}

// =========================
// CARGAR PRODUCTOS SUPABASE
// =========================
async function cargarProductos() {

    const { data, error } = await db
        .from("products")
        .select("*")
        .eq("disponible", true);

    if (error) {
        console.log(error);
        return;
    }

    productos = data;

    renderizarproducto();
}

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

            <p>${p.descripcion}</p>

            <span>Bs ${p.precio}</span>

            <button onclick="comprar(${p.id})">
                Comprar
            </button>

        </div>
        `;
    });

    contenedor.innerHTML = html;
}

// =========================
// COMPRAR
// =========================
function comprar(id) {

    const producto = productos.find(p => p.id === id);

    const existe = carrito.find(p => p.id === id);

    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    renderizarCarrito();
    actualizarContador();
}

// =========================
// CARRITO
// =========================
function renderizarCarrito() {

const contenedor = document.getElementById("view-cart");

let html = "<h2>Carrito</h2>";

if (carrito.length === 0) {

html += "<p>Tu carrito está vacío</p>";

} else {

let total = 0;
let totalCantidad = 0;

html += `
<div class="cart-header">
<span>Producto</span>
<span>Precio</span>
<span>Cantidad</span>
<span>Subtotal</span>
</div>
`;

carrito.forEach(p => {

const subtotal = p.precio * p.cantidad;
total += subtotal;
totalCantidad += p.cantidad;

html += `
<div class="cart-row">

<span>${p.nombre}</span>

<span>Bs ${p.precio}</span>

<div class="cantidad-box">
<button onclick="disminuirCantidad(${p.id})">−</button>
<span>${p.cantidad}</span>
<button onclick="aumentarCantidad(${p.id})">+</button>
</div>

<span>Bs ${subtotal}</span>

</div>
`;
});

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


function aumentarCantidad(id){

const producto = carrito.find(p => p.id === id);

if(producto){
producto.cantidad++;
}

renderizarCarrito();
actualizarContador();
}

function disminuirCantidad(id){

const producto = carrito.find(p => p.id === id);

if(producto){

producto.cantidad--;

if(producto.cantidad <= 0){
carrito = carrito.filter(p => p.id !== id);
}

}

renderizarCarrito();
actualizarContador();
}

// =========================
// CONTADOR
// =========================
function actualizarContador() {

    let total = 0;

    carrito.forEach(p => total += p.cantidad);

    cart-count.textContent === total;
}

// =========================
// VACIAR
// =========================
function vaciarCarrito() {
    carrito = [];
    renderizarCarrito();
    actualizarContador();
}

// =========================
// PAGAR
// =========================
function pagar() {

    if (carrito.length === 0) {
        alert("Carrito vacío");
        return;
    }

    let mensaje = "🛒 Pedido Cafetería %0A%0A";

    let total = 0;

    carrito.forEach(p => {

        const subtotal = p.precio * p.cantidad;

        total += subtotal;

        mensaje += `${p.nombre} x${p.cantidad} = Bs ${subtotal}%0A`;
    });

    mensaje += `%0ATotal: Bs ${total}`;

    window.open(
        `https://wa.me/59164916803?text=${mensaje}`,
        "_blank"
    );
}

// =========================
// CONTACTO
// =========================
function iniciarContacto() {

    const form = document.getElementById("formContacto");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        emailjs.send(
            "service_4r0zhsb",
            "template_0now3v8",
            {
                name: nombre.value,
                email: correo.value,
                message: mensaje.value
            }
        ).then(() => {
            alert("Mensaje enviado");
            form.reset();
        });
    });
}