var estado = document.getElementById("estado");

if (estado.textContent === "Aprobado") {
    estado.style.color = "green";
} else {
    estado.style.color = "red";
}
estado.style.fontWeight = "bold";
