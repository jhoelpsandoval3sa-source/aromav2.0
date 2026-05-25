// ======================================
// app.js - CAFETERÍA JHOEL COMPLETO
// ======================================

// =========================
// VALIDAR SUPABASE
// =========================
if (typeof db === "undefined") {

    alert("❌ Error conectando con Supabase");

    throw new Error("Supabase no inicializado");
}

// =========================
// VARIABLES GLOBALES
// =========================
let productos = [];

let carrito = [];

let usuarioActual = null;

// =========================
// ESCAPAR HTML
// =========================
function escaparHTML(texto) {

    const div = document.createElement("div");

    div.textContent = texto || "";

    return div.innerHTML;
}

// =========================
// GUARDAR CARRITO
// =========================
function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );
}

// =========================
// CARGAR CARRITO
// =========================
function cargarCarritoGuardado() {

    const carritoGuardado =
        localStorage.getItem("carrito");

    if (carritoGuardado) {

        try {

            carrito = JSON.parse(carritoGuardado);

        } catch (err) {

            carrito = [];
        }
    }
}

// =========================
// INICIO
// =========================
document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            // =========================
            // VERIFICAR SESIÓN
            // =========================
            const {
                data: { session }
            } = await db.auth.getSession();

            if (session) {

                usuarioActual = session.user;

                console.log(
                    "✅ Usuario:",
                    usuarioActual.email
                );

                entrarSistema();

            } else {

                console.log(
                    "❌ Sin sesión"
                );

                mostrarvista("home");
            }

            // =========================
            // ESTADO USUARIO
            // =========================
            await actualizarEstadoUsuario();

            // =========================
            // RECORDAR CORREO
            // =========================
            const loginCorreo =
                document.getElementById(
                    "loginCorreo"
                );

            if (loginCorreo) {

                const correo =
                    localStorage.getItem(
                        "correo"
                    );

                if (correo) {

                    loginCorreo.value = correo;

                    loginCorreo.readOnly = true;
                }
            }

            // =========================
            // CARGAR CARRITO
            // =========================
            cargarCarritoGuardado();

            // =========================
            // PRODUCTOS
            // =========================
            await cargarProductos();

            // =========================
            // RENDER
            // =========================
            renderizarCarrito();

            actualizarContador();

            // =========================
            // FUNCIONES
            // =========================
            iniciarLogin();

            iniciarRegistro();

            iniciarContacto();

        } catch (err) {

            console.error(
                "❌ Error:",
                err
            );
        }
    }
);

// =========================
// CAMBIAR VISTA
// =========================
function mostrarvista(vista) {

    document
        .querySelectorAll(".view")
        .forEach(sec => {

            sec.classList.remove(
                "active"
            );
        });

    const vistaElement =
        document.getElementById(
            "view-" + vista
        );

    if (vistaElement) {

        vistaElement.classList.add(
            "active"
        );
    }
}

// =========================
// ESTADO USUARIO
// =========================
async function actualizarEstadoUsuario() {

    const estado =
        document.getElementById(
            "estado-usuario"
        );

    const btnLogin =
        document.getElementById(
            "btn-login"
        );

    const btnRegistro =
        document.getElementById(
            "btn-registro"
        );

    const btnCerrar =
        document.getElementById(
            "btn-cerrar"
        );

    if (!estado) return;

    const {
        data: { user }
    } = await db.auth.getUser();

    if (user) {

        estado.innerHTML = `
            ✅ ${user.email}
        `;

        if (btnLogin) {
            btnLogin.style.display =
                "none";
        }

        if (btnRegistro) {
            btnRegistro.style.display =
                "none";
        }

        if (btnCerrar) {
            btnCerrar.style.display =
                "inline-block";
        }

    } else {

        estado.innerHTML =
            "❌ No has iniciado sesión";

        if (btnLogin) {
            btnLogin.style.display =
                "inline-block";
        }

        if (btnRegistro) {
            btnRegistro.style.display =
                "inline-block";
        }

        if (btnCerrar) {
            btnCerrar.style.display =
                "none";
        }
    }
}

// =========================
// LOGIN
// =========================
function iniciarLogin() {

    const form =
        document.getElementById(
            "loginForm"
        );

    if (!form) return;

    form.addEventListener(
        "submit",
        async e => {

            e.preventDefault();

            const email =
                document
                .getElementById(
                    "loginCorreo"
                )
                .value.trim();

            const password =
                document
                .getElementById(
                    "loginPassword"
                )
                .value;

            if (!email || !password) {

                alert(
                    "Completa los campos"
                );

                return;
            }

            try {

                const {
                    data,
                    error
                } =
                await db.auth
                    .signInWithPassword({

                        email,

                        password
                    });

                if (error) {

                    alert(
                        "❌ Correo o contraseña incorrectos"
                    );

                    return;
                }

                usuarioActual =
                    data.user;

                localStorage.setItem(
                    "correo",
                    email
                );

                await actualizarEstadoUsuario();

                entrarSistema();

                alert(
                    "✅ Sesión iniciada"
                );

            } catch (err) {

                console.error(err);

                alert(
                    "Error iniciando sesión"
                );
            }
        }
    );
}

// =========================
// REGISTRO
// =========================
function iniciarRegistro() {

    const form =
        document.getElementById(
            "registroForm"
        );

    if (!form) return;

    form.addEventListener(
        "submit",
        async e => {

            e.preventDefault();

            const nombre =
                document
                .getElementById(
                    "regNombre"
                )
                .value.trim();

            const correo =
                document
                .getElementById(
                    "regCorreo"
                )
                .value.trim();

            const password =
                document
                .getElementById(
                    "regPassword"
                )
                .value;

            if (
                !nombre ||
                !correo ||
                !password
            ) {

                alert(
                    "Completa todos los campos"
                );

                return;
            }

            try {

                const {
                    error
                } =
                await db.auth.signUp({

                    email: correo,

                    password: password,

                    options: {

                        data: {

                            nombre: nombre
                        }
                    }
                });

                if (error) {

                    alert(
                        "❌ " +
                        error.message
                    );

                    return;
                }

                alert(
                    "✅ Cuenta creada"
                );

                form.reset();

                mostrarvista(
                    "login"
                );

            } catch (err) {

                console.error(err);

                alert(
                    "Error registrando"
                );
            }
        }
    );
}

// =========================
// ENTRAR SISTEMA
// =========================
function entrarSistema() {

    const nav =
        document.querySelector("nav");

    if (nav) {

        nav.style.display =
            "flex";
    }

    mostrarvista("home");
}

// =========================
// CERRAR SESIÓN
// =========================
async function cerrarSesion() {

    await db.auth.signOut();

    usuarioActual = null;

    carrito = [];

    guardarCarrito();

    localStorage.removeItem(
        "correo"
    );

    await actualizarEstadoUsuario();

    alert(
        "✅ Sesión cerrada"
    );

    location.reload();
}

// =========================
// PRODUCTOS
// =========================
async function cargarProductos() {

    try {

        const {
            data,
            error
        } = await db
            .from("products")
            .select("*")
            .eq(
                "disponible",
                true
            )
            .order(
                "id",
                {
                    ascending: true
                }
            );

        if (error) {

            console.error(error);

            return;
        }

        productos = data || [];

        renderizarProductos();

    } catch (err) {

        console.error(err);
    }
}

// =========================
// RENDER PRODUCTOS
// =========================
function renderizarProductos() {

    const contenedor =
        document.getElementById(
            "products-container"
        );

    if (!contenedor) return;

    let html = "";

    productos.forEach(p => {

        html += `
        <div class="product-card">

            <h3>
                ${escaparHTML(
                    p.nombre
                )}
            </h3>

            <img
                src="${
                    p.imagen ||
                    "img/default.jpg"
                }"
                alt="${escaparHTML(
                    p.nombre
                )}"
            >

            <p>
                ${escaparHTML(
                    p.descripcion
                )}
            </p>

            <span class="precio">
                Bs ${Number(
                    p.precio
                ).toFixed(2)}
            </span>

            <button
                class="btn-comprar"
                onclick="comprar(${p.id})"
            >
                Agregar al carrito
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

    if (!usuarioActual) {

        alert(
            "⚠️ Debes iniciar sesión"
        );

        mostrarvista("login");

        return;
    }

    const producto =
        productos.find(
            p => p.id === id
        );

    if (!producto) return;

    const existe =
        carrito.find(
            p => p.id === id
        );

    if (existe) {

        existe.cantidad++;

    } else {

        carrito.push({

            ...producto,

            cantidad: 1
        });
    }

    guardarCarrito();

    renderizarCarrito();

    actualizarContador();

    alert(
        "✅ Producto agregado"
    );
}

// =========================
// RENDER CARRITO
// =========================
function renderizarCarrito() {

    const contenedor =
        document.getElementById(
            "cart-items"
        );

    if (!contenedor) return;

    let html = "";

    if (carrito.length === 0) {

        html = `
            <h2>🛒 Carrito</h2>
            <p>Vacío</p>
        `;

    } else {

        let total = 0;

        html += `
            <h2>🛒 Carrito</h2>
        `;

        carrito.forEach(p => {

            const subtotal =
                p.precio *
                p.cantidad;

            total += subtotal;

            html += `
            <div class="cart-row">

                <span>
                    ${p.nombre}
                </span>

                <span>
                    Bs ${subtotal}
                </span>

                <button
                    onclick="disminuirCantidad(${p.id})"
                >
                    -
                </button>

                <span>
                    ${p.cantidad}
                </span>

                <button
                    onclick="aumentarCantidad(${p.id})"
                >
                    +
                </button>

            </div>
            `;
        });

        html += `
        <h3>
            Total: Bs ${total}
        </h3>

        <button
            onclick="vaciarCarrito()"
        >
            Vaciar carrito
        </button>

        <button
            onclick="pagar()"
        >
            Pagar
        </button>
        `;
    }

    contenedor.innerHTML = html;
}

// =========================
// AUMENTAR
// =========================
function aumentarCantidad(id) {

    const producto =
        carrito.find(
            x => x.id === id
        );

    if (producto) {

        producto.cantidad++;
    }

    guardarCarrito();

    renderizarCarrito();

    actualizarContador();
}

// =========================
// DISMINUIR
// =========================
function disminuirCantidad(id) {

    const producto =
        carrito.find(
            x => x.id === id
        );

    if (!producto) return;

    producto.cantidad--;

    if (producto.cantidad <= 0) {

        carrito =
            carrito.filter(
                x => x.id !== id
            );
    }

    guardarCarrito();

    renderizarCarrito();

    actualizarContador();
}

// =========================
// CONTADOR
// =========================
function actualizarContador() {

    let total = 0;

    carrito.forEach(p => {

        total += p.cantidad;
    });

    const contador =
        document.getElementById(
            "cart-count"
        );

    if (contador) {

        contador.textContent =
            total;
    }
}

// =========================
// VACIAR
// =========================
function vaciarCarrito() {

    carrito = [];

    guardarCarrito();

    renderizarCarrito();

    actualizarContador();
}

// =========================
// PAGAR
// =========================
async function pagar() {

    if (carrito.length === 0) {

        alert("Carrito vacío");

        return;
    }

    try {

        const {
            data: { user }
        } = await db.auth.getUser();

        if (!user) {

            alert(
                "Inicia sesión"
            );

            return;
        }

        let total = 0;

        carrito.forEach(item => {

            total +=
                item.precio *
                item.cantidad;
        });

        // =========================
        // CREAR PEDIDO
        // =========================
        const {
            data: pedido,
            error: pedidoError
        } = await db
            .from("orders")
            .insert([
                {
                    user_id:
                        user.id,

                    total:
                        total,

                    estado:
                        "pendiente"
                }
            ])
            .select()
            .single();

        if (pedidoError) {

            console.error(
                pedidoError
            );

            alert(
                pedidoError.message
            );

            return;
        }

        // =========================
        // ITEMS
        // =========================
        const productosPedido =
            carrito.map(producto => ({

                order_id:
                    pedido.id,

                product_id:
                    producto.id,

                cantidad:
                    producto.cantidad,

                precio_unit:
                    producto.precio
            }));

        const {
            error: itemsError
        } = await db
            .from("order_items")
            .insert(
                productosPedido
            );

        if (itemsError) {

            console.error(
                itemsError
            );

            alert(
                itemsError.message
            );

            return;
        }

        // =========================
        // WHATSAPP
        // =========================
        const mensaje =
            encodeURIComponent(`

🛒 NUEVO PEDIDO

Pedido #${pedido.id}

${carrito.map(i => `
${i.nombre}
x${i.cantidad}
= Bs ${i.precio * i.cantidad}
`).join("\n")}

TOTAL: Bs ${total}

`);

        window.open(
            `https://wa.me/59164916803?text=${mensaje}`,
            "_blank"
        );

        vaciarCarrito();

        alert(
            `✅ Pedido #${pedido.id} guardado`
        );

    } catch (err) {

        console.error(err);

        alert(
            "Error procesando pedido"
        );
    }
}

// =========================
// CONTACTO EMAILJS
// =========================
function iniciarContacto() {

    const form =
        document.getElementById(
            "formContacto"
        );

    if (!form) return;

    form.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const nombre =
                document
                .getElementById(
                    "nombre"
                )
                .value.trim();

            const correo =
                document
                .getElementById(
                    "correo"
                )
                .value.trim();

            const mensaje =
                document
                .getElementById(
                    "mensaje"
                )
                .value.trim();

            try {

                await emailjs.send(

                    "service_4r0zhsb",

                    "template_0now3v8",

                    {
                        from_name:
                            nombre,

                        from_email:
                            correo,

                        message:
                            mensaje
                    }
                );

                alert(
                    "✅ Mensaje enviado"
                );

                form.reset();

            } catch (error) {

                console.error(
                    error
                );

                alert(
                    "❌ Error enviando mensaje"
                );
            }
        }
    );
}