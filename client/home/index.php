<?php
require 'includes/sessions.php';
require_login($logged_in);
?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Calendario de Eventos</title>
    <link rel="stylesheet" href="./../css/styles.css" />
  </head>
  <body id="body-calendario">
    <main>
      <!-- todo:modals vao servir como popups para adicionar eventos no calendario -->
      <header><h1>Calendar</h1></header>
      <div class="wrapper">
        <div id="header">
          <div id="mesAtual"></div>
          <div id="colorSchemes">
            <canvas id="beeScheme">
              a bee color scheme for the calendar
            </canvas>

            <canvas id="whiteBlueScheme">
              a white and blue color scheme for the calendar
            </canvas>

            <canvas id="redBlackScheme">
              a red and black color scheme for the calendar
            </canvas>
          </div>
          <div id="nav">
            <button id="buttonVoltar">Voltar</button>
            <button id="buttonProximo">Proximo</button>
          </div>
        </div>

        <div id="semana">
          <div class="dias-da-semana">Domingo</div>
          <div class="dias-da-semana">Segunda</div>
          <!-- nota formatar nome terca feira -->
          <div class="dias-da-semana">Terça</div>
          <div class="dias-da-semana">Quarta</div>
          <div class="dias-da-semana">Quinta</div>
          <div class="dias-da-semana">Sexta</div>
          <div class="dias-da-semana">Sábado</div>
        </div>
        <div id="calendario"></div>
      </div>
      <div id="modalNovoEvento">
        <h2 id="mne_titulo">Novo Evento</h2>
        <input
          type="text"
          name="inputEventoTitulo"
          placeholder="Titulo do Evento"
          id="inputEventoTitulo"
        />
        <textarea
          name="inputEventoDescricao"
          cols="20"
          rows="5"
          placeholder="Descrição do Evento"
          id="inputEventoDescricao"
        ></textarea>
        <div class="div-tempo">
          <span>De: </span>&nbsp;
          <input
            type="time"
            name="InicioEvento"
            id="input-eventoInicio"
          />&nbsp;
          <span>Até: </span>
          <input type="time" name="FimEvento" id="input-eventoFim" />
        </div>

        <button id="buttonCriar">Criar</button>
        <button id="buttonCancelar">Cancelar</button>
      </div>
      <div id="modalEditarEvento">
        <h2 id="me_titulo">Editar Evento</h2>
        <input
          type="text"
          name="inputEventoTitulo"
          placeholder="Titulo do Evento"
          id="me_inputEventoTitulo"
        />
        <textarea
          name="inputEventoDescricao"
          cols="20"
          rows="5"
          placeholder="Descrição do Evento"
          id="me_inputEventoDescricao"
        ></textarea>
        <div class="div-tempo">
          <span>De: </span>&nbsp;
          <input
            type="time"
            name="InicioEvento"
            id="me_inputEventoInicio"
          />&nbsp;
          <span>Até: </span>
          <input type="time" name="FimEvento" id="me_inputEventoFim" />
        </div>

        <button id="me_buttonSalvar">Salvar</button>
        <button id="me_buttonCancelar">Cancelar</button>
      </div>
      <div id="modalDeletarEvento">
        <h2>Evento</h2>
        <p id="eventoTitulo"></p>
        <p id="eventoDescricao"></p>
        <div class="div-tempo">
          <span>De: </span>
          <p id="eventoComeco"></p>
          &nbsp;
          <span>Até: </span>
          <p id="eventoFim"></p>
        </div>
        <div>
          <button id="buttonDeletar">Deletar</button>
          <button id="buttonFechar">Fechar</button>
          <button id="buttonEditar">Editar</button>
        </div>
      </div>
      <div id="modalBackDrop"></div>
    </main>
    <footer>
      <div id="register">
        <a href="signup.php">Signup</a>
        <a href="./login.php">Login</a>
      </div>
    </footer>
    <script src="./../js/index.js"></script>
  </body>
</html>
