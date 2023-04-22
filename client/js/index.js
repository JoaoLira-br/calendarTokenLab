//note:array de eventos vai estar em formato de string ao inves de objetos. Portanto precisa parsar com JSON.
//note: local storage e preferivel (entre cookies e session storage) pois permite que a info do usuario nunca expire(nao perder eventos salvos). e funcionam iguais como um JSON object(key, value)
// let dateSchedule =

let calendar = localStorage.getItem("calendar")
  ? JSON.parse(localStorage.getItem("calendar"))
  : [];

// let eventos = localStorage.getItem("eventos")
//   ? JSON.parse(localStorage.getItem("eventos"))
//   : [];

// note: "nav" mantem registro do mes que estamos
let nav = 0;
//note: "clicado" mantem registro se um dia do mes foi clicado ou nao
let diaClicado = null;

let eventoClicado = null;
let dateEvent = null;

//note: dependendo do dia da semana que for o primeiro dia do mes, so preciso contar os dias anteriores da semana para saber quantos dias de preenchimento precisa
const diasDaSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const beeScheme = document.getElementById("beeScheme");
const whiteBlueScheme = document.getElementById("whiteBlueScheme");
const redBlackScheme = document.getElementById("redBlackScheme");

const div_calendario = document.getElementById("calendario");
const mesAtual = document.getElementById("mesAtual");
const buttonProximo = document.getElementById("buttonProximo");
const buttonVoltar = document.getElementById("buttonVoltar");

//modal e a janela de popup quando o user clica em algum dos blocos
const modalNovoEvento = document.getElementById("modalNovoEvento");
//backdrop e o sombreamento atras do popup 'modal'
const backDrop = document.getElementById("modalBackDrop");
//inputEventoTitulo e o input de texto do popup
const modalTitulo = document.getElementById("mne_titulo");
const inputEventoTitulo = document.getElementById("inputEventoTitulo");
const inputEventoDescricao = document.getElementById("inputEventoDescricao");
const eventoInicio = document.getElementById("input-eventoInicio");
const eventoFim = document.getElementById("input-eventoFim");

const modalEditarEvento = document.getElementById("modalEditarEvento");
// ? Change from `const` to `let` possibly ?
const me_inputEventoTitulo = document.getElementById("me_inputEventoTitulo");
const me_inputEventoDescricao = document.getElementById(
  "me_inputEventoDescricao"
);
const me_inputEventoInicio = document.getElementById("me_inputEventoInicio");
const me_inputEventoFim = document.getElementById("me_inputEventoFim");

//popup que abre quando se clica em um dia com um evento ja existente
const modalDeletarEvento = document.getElementById("modalDeletarEvento");

const buttonDeletar = document.getElementById("buttonDeletar");
const buttonFechar = document.getElementById("buttonFechar");
const buttonEditar = document.getElementById("buttonEditar");
const buttonCriar = document.getElementById("buttonCriar");
const buttonCancelar = document.getElementById("buttonCancelar");
const me_buttonSalvar = document.getElementById("me_buttonSalvar");
const me_buttonCancelar = document.getElementById("me_buttonCancelar");

//essa funcao abre um popup na tela quando o user clicar em dos blocos de dia do calendario

// a funcao load() serve para preencher e mostrar o calendario, levando em consideracao os eventos, e o mes que se esta
function load() {
  const dt = new Date();
  // console.log(dt);
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }

  const dia = dt.getDate();
  //obs: meses comecam em 0
  const mes = dt.getMonth() + 1;
  const ano = dt.getFullYear();
  // calculando o primeiro dia do Mes para inserir dias de preenchimento corretamente no calendario
  const primeiroDiaDoMes = new Date(ano, mes - 1, 1);

  //calculando a quantidade de dias do mes para poder renderizar apropriadamente no calendario. o '0' como param day e igual a o utlimo dia do mes anterior, ou seja, dias do mes
  const diasDoMes = new Date(ano, mes, 0).getDate();

  const diaLocal = primeiroDiaDoMes.toLocaleDateString("pt-br", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  const nomeMesAtual = dt.toLocaleDateString("pt-BR", { month: "long" });

  //retirando o dia da semana de dentro da string diaLocal, com a inicial maiscula
  const localDiaDaSemana =
    diaLocal.substring(0, 1).toUpperCase() +
    diaLocal.split(", ")[0].substring(1);
  // console.log(localDiaDaSemana);

  //calculando os dias de preenchimento: os dias antes do primeiro dia do mes para renderizar o calendario uniformemente
  const diasDePreenchimento = diasDaSemana.indexOf(localDiaDaSemana);
  // console.log(diasDePreenchimento);

  //mostra o mes atual e ano acima do calendario
  mesAtual.innerText =
    nomeMesAtual.substring(0, 1).toUpperCase() +
    nomeMesAtual.substring(1) +
    ", " +
    ano;

  //limpa o calendario de valores anteriores para nao sobreescrever com os valores antigos no for loop
  div_calendario.innerHTML = "";

  /*
    run for each day of the month displayed
  **/
  for (let dia = 1; dia <= diasDePreenchimento + diasDoMes; dia++) {
    fillDateBlocks(dia);
  }

  function fillDateBlocks(dia) {
    const blocoDeDia = document.createElement("div");

    // * format of dateString === (local storage) eventos.date
    const dateString = `${mes}/${dia - diasDePreenchimento}/${ano}`;

    if (dia > diasDePreenchimento) {
      blocoDeDia.classList.add("div-dia");

      blocoDeDia.innerText = dia - diasDePreenchimento;

      if (dia - diasDePreenchimento === dia && nav === 0) {
        blocoDeDia.id = "diaAtual";
      }

      let dateEvents = calendar.find((e) => e.date === dateString)
        ? calendar.find((e) => e.date === dateString).dateEvents
        : null;

      fillEventBlocks(dateEvents, dateString, blocoDeDia);
      //
      // eventDiv.addEventListener("click", () => {
      // })
    } else {
      blocoDeDia.classList.add("div-diaPreenchimento");
    }
    div_calendario.appendChild(blocoDeDia);
  }

  function fillEventBlocks(dateEvents, dateString, blocoDeDia) {
    let eventDivs = [];

    //
    if (dateEvents !== null && dateEvents.length != 0) {
      let index = 0;
      dateEvents.forEach((dateEvent) => {
        eventDivs.push(document.createElement("div"));
        eventDivs[index].classList.add("eventos");
        eventDivs[index].innerHTML = dateEvent.title;
        blocoDeDia.appendChild(eventDivs[index]);
        index++;
      });
      //  eventDiv = document.createElement("div");
      // eventDiv.classList.add("eventos");
      // eventDiv.innerHTML = dateEvents[0].title;
      // blocoDeDia.appendChild(eventDiv);
    }

    blocoDeDia.addEventListener("click", (event) => {
      const targetElement = event.target;
      console.log(`? target element ${targetElement.innerHTML}`);
      let idxOfTarget = eventDivs.indexOf(targetElement);

      idxOfTarget != -1
        ? abrirModal(dateString, dateEvents[idxOfTarget])
        : abrirModal(dateString, null);

      // if(eventDivs.indexOf(targetElement != -1)){
      //   // console.log(`? target element ${targetElement.innerHTML} === eventDiv ${eventDivs.innerHTML}`);
      //   abrirModal(dateString, dateEvents[0]);

      // } else {
      //     abrirModal(dateString, null);
      //   }
      // if (targetElement.classList.contains("eventos")) {

      //   console.log(`O evento ${targetElement.innerHTML}
      //   com innerText ${targetElement.innerText}
      //    com tipo ${targetElement.type}
      //    na data ${dateString} foi clicado:`);
      //    //   abrirModal(dateString, eventDiv.innerText);
      // }
    });
  }
}

function abrirModal(date, dateEvent) {
  diaClicado = date;
  const dateSchedule = calendar.find((e) => e.date === diaClicado);
  // if(dateSchedule){
  if (dateEvent != null) {
    eventoClicado = dateEvent;

    modalDeletarEvento.style.display = "block";

    document.getElementById("eventoTitulo").innerText = dateEvent.title;
    document.getElementById("eventoDescricao").innerText =
      dateEvent.description;
    document.getElementById("eventoComeco").innerText = dateEvent.start;
    document.getElementById("eventoFim").innerText = dateEvent.end;
  } else {
    modalNovoEvento.style.display = "block";
  }
  //  } else {
  //     modalNovoEvento.style.display = "block";
  //   }
  backDrop.style.display = "block";
}

function fecharModal() {
  inputEventoTitulo.classList.remove("error");
  modalNovoEvento.style.display = "none";
  backDrop.style.display = "none";
  modalDeletarEvento.style.display = "none";
  inputEventoTitulo.value = "";
  modalEditarEvento.style.display = "none";
  me_inputEventoDescricao.value = "";
  me_inputEventoInicio.value = "";
  me_inputEventoFim.value = "";
  me_inputEventoTitulo.value = "";

  diaClicado = null;
  eventoClicado = null;
  load();
}

/*
 Goes to modal modalDestino WITHOUT changing the diaClicado and eventoClicado
**/
function trocarModal(modalDestino) {
  inputEventoTitulo.classList.remove("error");
  modalNovoEvento.style.display = "none";
  backDrop.style.display = "none";
  modalDeletarEvento.style.display = "none";
  inputEventoTitulo.value = "";
  switch (modalDestino) {
    case modalEditarEvento:
      modalEditarEvento.style.display = "block";
      break;
    case modalDeletarEvento:
      modalDeletarEvento.style.display = "block";
    default:
      break;
  }
  backDrop.style.display = "block";
}

function criarEvento() {
  if (inputEventoTitulo.value) {
    inputEventoTitulo.classList.remove("error");

    let dateSchedule = calendar.find((e) => e.date == diaClicado);
    if (dateSchedule) {
      let event = dateSchedule.dateEvents.find(
        (e) => e.title == inputEventoTitulo.value
      );
      if (event) {
        console.log("There is already an event with the same title, do");
      } else {
        dateSchedule.dateEvents.push({
          title: inputEventoTitulo.value,
          description: inputEventoDescricao.value,
          start: eventoInicio.value,
          end: eventoFim.value,
        });
      }
    } else {
      calendar.push({
        date: diaClicado,
        dateEvents: [
          {
            title: inputEventoTitulo.value,
            description: inputEventoDescricao.value,
            start: eventoInicio.value,
            end: eventoFim.value,
          },
        ],
      });
    }

    // localStorage.setItem("eventos", JSON.stringify(eventos));
    localStorage.setItem("calendar", JSON.stringify(calendar));

    inputEventoTitulo.value = "";
    inputEventoDescricao.value = "";
    eventoFim.value = "";
    eventoInicio.value = "";
    fecharModal();
  } else {
    inputEventoTitulo.classList.add("error");
  }
}

function salvarEvento() {
  if (me_inputEventoTitulo.value) {
    inputEventoTitulo.classList.remove("error");
    let dateSchedule = calendar.find((e) => e.date == diaClicado);

    // ? eu pensei que oldEvent seria uma referencia para o eventoClicado, mas não é, e como se fosse uma copia, então não consigo alterar o eventoClicado com oldEvent = newEvent?

    const newEvent = {
      title: me_inputEventoTitulo.value,
      description: me_inputEventoDescricao.value,
      start: me_inputEventoInicio.value,
      end: me_inputEventoFim.value,
    };

    const dateEvents = calendar.find((e) => e.date === diaClicado).dateEvents;

    //filter and push
    calendar.find((e) => e.date === diaClicado).dateEvents = dateEvents.filter(
      (e) => e !== eventoClicado
    );
    calendar.find((e) => e.date === diaClicado).dateEvents.push(newEvent);
    localStorage.setItem("calendar", JSON.stringify(calendar));
    fecharModal();
  }
}

function editarEvento() {
  trocarModal(modalEditarEvento);
  me_inputEventoTitulo.value = eventoClicado.title;

  if (eventoClicado.description)
    me_inputEventoDescricao.value = eventoClicado.description;

  if (eventoClicado.start) me_inputEventoInicio.value = eventoClicado.start;

  if (eventoClicado.end) me_inputEventoFim.value = eventoClicado.end;

  //todo: uma vez que usuario terminou workflow no editar anular o evento clicado e dia clicado
}

function fillColorPicker() {
  // const beeScheme = document.getElementById("beeScheme");
  // const whiteBlueScheme = document.getElementById("whiteBlueScheme");
  // const redBlackScheme = document.getElementById("redBlackScheme");

  const ctxBee = beeScheme.getContext("2d");
  const ctxWhiteBlue = whiteBlueScheme.getContext("2d");
  const ctxRedBlack = redBlackScheme.getContext("2d");

  ctxBee.fillStyle = "#D6AA3E";
  ctxBee.fillRect(0, 0, beeScheme.width, beeScheme.height / 2);
  ctxBee.fillStyle = "#312428";

  ctxBee.fillRect(
    0,
    beeScheme.height / 2,
    beeScheme.width,
    beeScheme.height / 2
  );

  ctxWhiteBlue.fillStyle = "#A7DDF9";
  ctxWhiteBlue.fillRect(
    0,
    0,
    whiteBlueScheme.width,
    whiteBlueScheme.height / 2
  );
  ctxWhiteBlue.fillStyle = "#F8EDF8";

  ctxWhiteBlue.fillRect(
    0,
    whiteBlueScheme.height / 2,
    whiteBlueScheme.width,
    whiteBlueScheme.height / 2
  );

  ctxRedBlack.fillStyle = "#EC6773";
  ctxRedBlack.fillRect(0, 0, redBlackScheme.width, redBlackScheme.height / 2);
  ctxRedBlack.fillStyle = "#5B5356";

  ctxRedBlack.fillRect(
    0,
    redBlackScheme.height / 2,
    redBlackScheme.width,
    redBlackScheme.height / 2
  );
}

function deletarEvento() {
  // eventos = eventos.filter((e) => e.date !== clicado);
  const dateEvents = calendar.find((e) => e.date === diaClicado).dateEvents;
  calendar.find((e) => e.date === diaClicado).dateEvents = dateEvents.filter(
    (e) => e !== eventoClicado
  );

  // buttonDeletar.removeEventListener("click", deletarEvento(eventTitle));
  localStorage.setItem("calendar", JSON.stringify(calendar));
  fecharModal();
}

function clicarButtons() {
  buttonProximo.addEventListener("click", () => {
    nav++;
    load();
  });
  buttonVoltar.addEventListener("click", () => {
    nav--;
    load();
  });
  buttonDeletar.addEventListener("click", () => deletarEvento());
  buttonCancelar.addEventListener("click", () => fecharModal());
  me_buttonCancelar.addEventListener("click", () => fecharModal());
  buttonCriar.addEventListener("click", () => criarEvento());
  me_buttonSalvar.addEventListener("click", () => salvarEvento());
  buttonFechar.addEventListener("click", () => fecharModal());
  buttonEditar.addEventListener("click", () => editarEvento());
}

clicarButtons();
load();
fillColorPicker();
