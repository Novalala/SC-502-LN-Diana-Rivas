<?php

session_start();

const TASA_INTERES  = 0.026; // 2.6 %
const TASA_CASHBACK = 0.001; // 0.1 %

if (!isset($_SESSION['transacciones'])) {
    $_SESSION['transacciones'] = [];
}
$transacciones = &$_SESSION['transacciones'];

function registrarTransaccion($id, $descripcion, $monto)
{
    global $transacciones;

    array_push($transacciones, [
        'id'          => $id,
        'descripcion' => $descripcion,
        'monto'       => (float) $monto,
    ]);
}

function formatoMonto($valor)
{
    return '₡' . number_format($valor, 2, '.', ',');
}

function generarEstadoDeCuenta()
{
    global $transacciones;

    $montoContado = 0;
    foreach ($transacciones as $t) {
        $montoContado += $t['monto'];
    }

    $montoConInteres = $montoContado * (1 + TASA_INTERES);

    $cashBack = $montoContado * TASA_CASHBACK;

    $montoFinal = $montoConInteres - $cashBack;

    $estado = [
        'transacciones'   => array_values($transacciones),
        'montoContado'    => round($montoContado, 2),
        'montoConInteres' => round($montoConInteres, 2),
        'cashBack'        => round($cashBack, 2),
        'montoFinal'      => round($montoFinal, 2),
        'fecha'           => date('d/m/Y H:i:s'),
    ];

    guardarArchivoTxt($estado);

    return $estado;
}

function guardarArchivoTxt($estado)
{
    $linea = str_repeat('=', 62) . "\n";
    $sep   = str_repeat('-', 62) . "\n";

    $txt  = $linea;
    $txt .= "            ESTADO DE CUENTA - TARJETA DE CREDITO\n";
    $txt .= $linea;
    $txt .= "Fecha de generacion: {$estado['fecha']}\n\n";
    $txt .= sprintf("%-6s %-38s %15s\n", 'ID', 'DESCRIPCION', 'MONTO');
    $txt .= $sep;

    if (empty($estado['transacciones'])) {
        $txt .= "(Sin transacciones registradas)\n";
    }
    foreach ($estado['transacciones'] as $t) {
        $desc = html_entity_decode($t['descripcion'], ENT_QUOTES, 'UTF-8');
        $txt .= sprintf(
            "%-6s %-38s %15s\n",
            $t['id'],
            mb_substr($desc, 0, 38),
            formatoMonto($t['monto'])
        );
    }

    $txt .= $sep;
    $txt .= sprintf("%-45s %15s\n", 'Monto total de contado:',       formatoMonto($estado['montoContado']));
    $txt .= sprintf("%-45s %15s\n", 'Monto con interes (2.6%):',     formatoMonto($estado['montoConInteres']));
    $txt .= sprintf("%-45s %15s\n", 'Cash back (0.1% del contado):', '-' . formatoMonto($estado['cashBack']));
    $txt .= $linea;
    $txt .= sprintf("%-45s %15s\n", 'MONTO FINAL A PAGAR:',          formatoMonto($estado['montoFinal']));
    $txt .= $linea;

    file_put_contents(__DIR__ . '/../estado_cuenta.txt', $txt);
}


function cargarSimulacion()
{
    registrarTransaccion(1, 'Supermercado Auto Mercado', 45500.00);
    registrarTransaccion(2, 'Gasolinera Delta',          22000.00);
    registrarTransaccion(3, 'Restaurante Rostipollos',   18750.50);
    registrarTransaccion(4, 'Farmacia Fischel',          12300.00);
    registrarTransaccion(5, 'Servicio de streaming',      7900.00);
}
