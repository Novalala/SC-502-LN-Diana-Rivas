<?php

require_once __DIR__ . '/funciones.php';

header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['simulado'])) {
    cargarSimulacion();
    $_SESSION['simulado'] = true;
}

$entrada = json_decode(file_get_contents('php://input'), true) ?? [];
$accion  = $_GET['accion'] ?? ($entrada['accion'] ?? 'estado');

try {
    if ($accion === 'registrar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $descripcion = trim($entrada['descripcion'] ?? '');
        $monto       = $entrada['monto'] ?? null;

        if ($descripcion === '' || !is_numeric($monto) || $monto <= 0) {
            http_response_code(422);
            echo json_encode(['error' => 'Ingrese una descripción y un monto mayor a cero.']);
            exit;
        }

        $descripcion = htmlspecialchars($descripcion, ENT_QUOTES, 'UTF-8');
        $nuevoId     = count($transacciones) + 1;
        registrarTransaccion($nuevoId, $descripcion, $monto);

    } elseif ($accion === 'reiniciar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        $transacciones = [];
        cargarSimulacion();
    }

    echo json_encode(generarEstadoDeCuenta());

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Error del servidor: ' . $e->getMessage()]);
}
