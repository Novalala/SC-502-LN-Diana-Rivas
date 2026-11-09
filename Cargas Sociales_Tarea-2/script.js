const PORCENTAJE_CARGAS = 0.1083; 

function calcularCargas(salario) {
  return salario * PORCENTAJE_CARGAS;
}

function calcularRenta(salario) {
  let impuesto = 0;

  if (salario > 4727000) {
    impuesto = (salario - 4727000) * 0.25 + (4727000 - 2364000) * 0.20 + (2364000 - 1347000) * 0.15 + (1347000 - 918000) * 0.10;
  } else if (salario > 2364000) {
    impuesto = (salario - 2364000) * 0.20 + (2364000 - 1347000) * 0.15 + (1347000 - 918000) * 0.10;
  } else if (salario > 1347000) {
    impuesto = (salario - 1347000) * 0.15 + (1347000 - 918000) * 0.10;
  } else if (salario > 918000) {
    impuesto = (salario - 918000) * 0.10;
  }

  return impuesto;
}

document.getElementById("btnCalcular").addEventListener("click", function () {
  const salario = parseFloat(document.getElementById("salarioBruto").value);
  const resultado = document.getElementById("resultadoSalario");

  if (isNaN(salario) || salario <= 0) {
    resultado.innerHTML = "Por favor ingrese un salario válido.";
    return;
  }

  const cargas = calcularCargas(salario);
  const renta = calcularRenta(salario);
  const neto = salario - cargas - renta;

  resultado.innerHTML =
    "Cargas sociales: ₡" + cargas.toFixed(2) + "<br>" +
    "Impuesto sobre la renta: ₡" + renta.toFixed(2) + "<br>" +
    "Salario neto: ₡" + neto.toFixed(2);
});


document.getElementById("btnCambiar").addEventListener("click", function () {
  document.getElementById("parrafo").innerHTML = "¡El texto del párrafo ha cambiado!";
});


document.getElementById("btnEdad").addEventListener("click", function () {
  const edad = parseInt(document.getElementById("edad").value);
  const mensaje = document.getElementById("mensajeEdad");

  if (isNaN(edad)) {
    mensaje.innerHTML = "Por favor ingrese una edad válida.";
  } else if (edad > 18) {
    mensaje.innerHTML = "Eres mayor de edad.";
  } else {
    mensaje.innerHTML = "Eres menor de edad.";
  }
});

const estudiantes = [
  { nombre: "Ana", apellido: "Mora", nota: 90 },
  { nombre: "Luis", apellido: "Rojas", nota: 75 },
  { nombre: "María", apellido: "Vargas", nota: 85 },
  { nombre: "Carlos", apellido: "Solís", nota: 90 }
];

document.getElementById("btnEstudiantes").addEventListener("click", function () {
  const lista = document.getElementById("listaEstudiantes");
  lista.innerHTML = "";
  let suma = 0;

  estudiantes.forEach(function (estudiante) {
    const div = document.createElement("div");
    div.innerHTML = estudiante.nombre + " " + estudiante.apellido + " - Nota: " + estudiante.nota;
    lista.appendChild(div);
    suma = suma + estudiante.nota;
  });

  const promedio = suma / estudiantes.length;
  document.getElementById("promedio").innerHTML =
    "Promedio de notas: " + promedio.toFixed(2);
});
