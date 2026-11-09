<?php include "evaluacion.php"; ?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Evaluación académica</title>
    <link rel="stylesheet" href="estilos.css">
</head>
<body>
    <h1>Evaluación académica</h1>
    <p>Estudiante: <?php echo $estudiante; ?></p>

    <table>
        <tr>
            <th>Evaluación</th>
            <th>Nota</th>
        </tr>
        <tr>
            <td>Nota 1</td>
            <td><?php echo $nota1; ?></td>
        </tr>
        <tr>
            <td>Nota 2</td>
            <td><?php echo $nota2; ?></td>
        </tr>
        <tr>
            <td>Nota 3</td>
            <td><?php echo $nota3; ?></td>
        </tr>
    </table>

    <p>Promedio: <?php echo number_format($promedio, 2); ?></p>
    <p>Estado: <span id="estado"><?php echo $estado; ?></span></p>

    <script src="script.js"></script>
</body>
</html>
