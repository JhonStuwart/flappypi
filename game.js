<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>Flappy Pi</title>

<meta name="viewport" content="
  width=device-width,
  height=device-height,
  initial-scale=1.0,
  maximum-scale=1.0,
  user-scalable=no
">

<style>
html, body {
    margin: 0;
    padding: 0;
    background: black;
    height: 100%;
    overflow: hidden;
}

#gameWrapper {
    position: relative;
    width: 100%;
    height: 100%;
}

canvas {
    display: block;
}

/* MENU */
#menu {
    position: absolute;
    inset: 0;
    background: #76c7c0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

#menu h1 {
    margin-bottom: 10px;
}

#highScoreText {
    font-size: 20px;
    margin-bottom: 15px;
}

button, select {
    padding: 12px 20px;
    font-size: 18px;
    margin-top: 10px;
}

/* GAME OVER (apenas botão, sem texto) */
#gameOver {
    position: absolute;
    inset: 0;
    display: none;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: 60px;
    z-index: 10;
    pointer-events: none;
}

#restartBtn {
    pointer-events: auto;
}
</style>
</head>

<body>

<div id="gameWrapper">

    <div id="menu">
        <h1>Flappy Pi</h1>

        <p id="highScoreText">High Score: 0</p>

        <select id="bgSelect">
            <option value="day">Dia</option>
            <option value="night">Noite</option>
        </select>

        <button id="playBtn">Jogar</button>
    </div>

    <div id="gameOver">
        <button id="restartBtn">Voltar ao Menu</button>
    </div>

    <canvas id="gameCanvas"></canvas>
</div>

<script src="audio.js"></script>
<script src="game.js"></script>

</body>
</html>
