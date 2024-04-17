document.addEventListener("DOMContentLoaded", function() {
    // Restaurar datos del localStorage si existen, o inicializar un objeto vacío
    const bebidasPorMesa = JSON.parse(localStorage.getItem('bebidasPorMesa')) || {};
    const bebidasLista = document.getElementById("bebidas-lista");
    const resetearBtn = document.getElementById("resetear-btn");
    const modal = document.getElementById("modal");
    const bebidaInput = document.getElementById("bebida-input");
    const confirmarBtn = document.getElementById("confirmar-btn");
    const closeBtn = document.getElementsByClassName("close")[0];
    const menuBtn = document.querySelector(".menu-btn");
    const menu = document.getElementById("menu");
    const mesaTitulo = document.getElementById("mesa-titulo");

    function toggleMenu() {
        menu.classList.toggle("show-menu");
    }

    resetearBtn.addEventListener("click", function() {
        bebidasLista.innerHTML = "";
        bebidasPorMesa[currentTable] = [];
        guardarDatosLocalStorage(); // Guardar datos en el localStorage
    });

    confirmarBtn.addEventListener("click", function() {
        const bebidaNombre = bebidaInput.value.trim();
        if (bebidaNombre) {
            if (!bebidasPorMesa[currentTable]) {
                bebidasPorMesa[currentTable] = [];
            }
            let bebida = bebidasPorMesa[currentTable].find(bebida => bebida.nombre === bebidaNombre);
            if (!bebida) {
                bebida = { nombre: bebidaNombre, cantidad: 0 };
                bebidasPorMesa[currentTable].push(bebida);
            }
            actualizarListaBebidas();
            bebidaInput.value = "";
            guardarDatosLocalStorage(); // Guardar datos en el localStorage
        }
    });

    document.querySelectorAll(".menu a").forEach(function(link) {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const mesa = event.target.textContent;
            currentTable = mesa;
            actualizarListaBebidas();
            mesaTitulo.textContent = mesa;
            toggleMenu();
        });
    });

    function actualizarListaBebidas() {
        bebidasLista.innerHTML = "";
        const bebidas = bebidasPorMesa[currentTable] || [];
        bebidas.forEach(function(bebida) {
            const li = document.createElement("li");
            const bebidaSpan = document.createElement("span");
            const btnDelete = document.createElement("button");
            const btnSumar = document.createElement("button");
            const btnRestar = document.createElement("button");
            const quantitySpan = document.createElement("span");

            bebidaSpan.textContent = bebida.nombre;
            quantitySpan.textContent = "Cant: " + bebida.cantidad;

            btnDelete.textContent = "X";
            btnSumar.textContent = "+";
            btnRestar.textContent = "-";

            btnDelete.classList.add("btn-delete");
            btnSumar.classList.add("btn-sumar");
            btnRestar.classList.add("btn-restar");

            btnDelete.addEventListener("click", function() {
                bebida.cantidad = 0;
                const index = bebidasPorMesa[currentTable].indexOf(bebida);
                if (index !== -1) {
                    bebidasPorMesa[currentTable].splice(index, 1);
                }
                actualizarListaBebidas();
                guardarDatosLocalStorage(); // Guardar datos en el localStorage
            });

            btnSumar.addEventListener("click", function() {
                bebida.cantidad++;
                actualizarListaBebidas();
                guardarDatosLocalStorage(); // Guardar datos en el localStorage
            });

            btnRestar.addEventListener("click", function() {
                if (bebida.cantidad > 0) {
                    bebida.cantidad--;
                    actualizarListaBebidas();
                    guardarDatosLocalStorage(); // Guardar datos en el localStorage
                }
            });

            li.appendChild(btnDelete);
            li.appendChild(bebidaSpan);
            li.appendChild(btnSumar);
            li.appendChild(btnRestar);
            li.appendChild(quantitySpan);

            li.classList.add("bebida-container");

            bebidasLista.appendChild(li);
        });

        guardarDatosLocalStorage(); // Guardar datos en el localStorage
    }

    let currentTable = "Taula 1";

    menuBtn.addEventListener("click", toggleMenu);

    document.addEventListener("click", function(event) {
        if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
            menu.classList.remove("show-menu");
        }
    });

    // Función para guardar los datos en el localStorage
    function guardarDatosLocalStorage() {
        localStorage.setItem('bebidasPorMesa', JSON.stringify(bebidasPorMesa));
    }

    // Actualizar lista de bebidas al cargar la página
    actualizarListaBebidas();
});