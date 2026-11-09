const API = 'php/api.php';

const formulario  = document.getElementById('formTransaccion');
const inputDesc   = document.getElementById('descripcion');
const inputMonto  = document.getElementById('monto');
const mensaje     = document.getElementById('mensaje');
const cuerpoTabla = document.getElementById('cuerpoTabla');


function formatoMonto(valor) {
    return '₡' + Number(valor).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = 'mensaje ' + tipo;
}


function crearCelda(texto, clase) {
    const td = document.createElement('td');
    td.textContent = texto;
    if (clase) td.className = clase;
    return td;
}


function decodificar(texto) {
    const aux = document.createElement('textarea');
    aux.innerHTML = texto;
    return aux.value;
}


function pintarEstado(estado) {
    cuerpoTabla.innerHTML = '';

    if (estado.transacciones.length === 0) {
        const tr = document.createElement('tr');
        const td = crearCelda('Aún no hay transacciones registradas.', 'vacio');
        td.colSpan = 3;
        tr.appendChild(td);
        cuerpoTabla.appendChild(tr);
    }

    estado.transacciones.forEach(t => {
        const tr = document.createElement('tr');
        tr.appendChild(crearCelda(t.id));
        tr.appendChild(crearCelda(decodificar(t.descripcion)));
        tr.appendChild(crearCelda(formatoMonto(t.monto), 'derecha'));
        cuerpoTabla.appendChild(tr);
    });

    document.getElementById('montoContado').textContent    = formatoMonto(estado.montoContado);
    document.getElementById('montoConInteres').textContent = formatoMonto(estado.montoConInteres);
    document.getElementById('cashBack').textContent        = '-' + formatoMonto(estado.cashBack);
    document.getElementById('montoFinal').textContent      = formatoMonto(estado.montoFinal);
    document.getElementById('fechaGenerado').textContent   =
        'Generado el ' + estado.fecha + ' · Se actualizó el archivo estado_cuenta.txt';
}


async function llamarApi(opciones = {}, query = '') {
    const respuesta = await fetch(API + query, opciones);
    const datos = await respuesta.json();
    if (!respuesta.ok) throw new Error(datos.error || 'Error inesperado');
    return datos;
}

function enviarJson(cuerpo) {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpo)
    };
}

async function cargarEstado() {
    try {
        pintarEstado(await llamarApi({}, '?accion=estado'));
    } catch (e) {
        mostrarMensaje('No se pudo cargar el estado de cuenta: ' + e.message, 'error');
    }
}


formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const descripcion = inputDesc.value.trim();
    const monto = parseFloat(inputMonto.value);

    inputDesc.classList.toggle('invalido', descripcion === '');
    inputMonto.classList.toggle('invalido', !(monto > 0));

    if (descripcion === '' || !(monto > 0)) {
        mostrarMensaje('Ingrese una descripción y un monto mayor a cero.', 'error');
        return;
    }

    try {
        const estado = await llamarApi(enviarJson({ accion: 'registrar', descripcion, monto }));
        pintarEstado(estado);
        formulario.reset();
        inputDesc.focus();
        mostrarMensaje('Transacción registrada correctamente.', 'ok');
    } catch (e) {
        mostrarMensaje(e.message, 'error');
    }
});


document.getElementById('btnReiniciar').addEventListener('click', async () => {
    if (!confirm('¿Reiniciar y volver a las transacciones de ejemplo?')) return;
    try {
        pintarEstado(await llamarApi(enviarJson({ accion: 'reiniciar' })));
        mostrarMensaje('Datos reiniciados.', 'ok');
    } catch (e) {
        mostrarMensaje(e.message, 'error');
    }
});

cargarEstado();
