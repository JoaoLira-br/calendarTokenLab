/*
todo: Clean commentary hell
 */

/*
 todo: SQL FETCH DATE EVENTS WITH AJAX REQUEST TO PHP FILE, SET calendar VAR TO AJAX RESPONSE
 */
/*
FETCH USER EVENTS FROM USER ID
 */
let user_id = null;
//
// let calendar = localStorage.getItem("calendar")
//   ? JSON.parse(localStorage.getItem("calendar"))
//   : [];
let calendar = [];

// $.post('/client/home/index.php', {
// }, function(response){
//   if(response.status === 'success'){
//     user_id = response.user_id;
//   } else {
//     console.log('Error fetching user id');
//   }
// }).fail(function(jqXHR, textStatus, errorThrown) {
//   console.error('Fetch Error:', errorThrown);
// });

$.post('/calendarTokenLab/server/proxy.php', {
  action: 'fetch_id'
}).done(function(data){
  // If jQuery doesn't automatically parse the JSON response, uncomment the next line:
  // data = JSON.parse(data);

  if(data && data.user_id){ // Check if data is not null and user_id exists
    console.log("User ID:", data.user_id);
    console.log("hello sir");
    user_id = data.user_id;
  } else {
    console.error('Invalid response:', data);
  }
}).fail(function(jqXHR, textStatus, errorThrown) {
  console.error('Fetch Error:', errorThrown);
});


  $.post('/calendarTokenLab/server/proxy.php', {
    action: 'fetch_events',
    user_id: user_id
  }, function(data){
    if(data.events){
      calendar = data.events;
      localStorage.setItem("calendar", JSON.stringify(calendar));
    }

  }, 'json').fail(function(jqXHR, textStatus, errorThrown){

  });







// let eventos = localStorage.getItem("eventos")
//   ? JSON.parse(localStorage.getItem("eventos"))
//   : [];

// note: "nav" mantem registro do mes que estamos
let nav = 0;
//note: "clicado" mantem registro se um dia do mes foi clicado ou nao
let diaClicado = null;
let ftScheme = null;
let bgScheme = null;
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

/*
todo: Leverage JQUERY to clean this mess of constants up to line 79.
group constants by element arrays
 */
const body = document.querySelector("body");
const beeScheme = document.getElementById("beeScheme");
const whiteBlueScheme = document.getElementById("whiteBlueScheme");
const redBlackScheme = document.getElementById("redBlackScheme");
const schemeCvs = document.querySelectorAll("canvas");

const div_calendario = document.getElementById("calendario");
const div_mesAtual = document.getElementById("mesAtual");
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

function convertTimeToMySQLFormat(timeString) {
  // Check if the time string is null or undefined
  if (timeString === "") {
    // You can return a default value, or null, depending on your requirements
    // For this example, I'm returning null
    return null;
  }

  // Split the time string by ":"
  const parts = timeString.split(":");

  // Check if the time string is in the expected format
  // if (parts.length !== 2) {
  //   throw new Error("Invalid time format. Expected HH:MM.");
  // }

  // Extract the hours and minutes
  const [hours, minutes] = parts;

  // Return the time in MySQL's TIME format
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
}

function convertDateToMySQLFormat(dateString) {
  // Split the date string by "/"
  const parts = dateString.split("/");

  // Check if the date string is in the expected format
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Expected MM/DD/YYYY.");
  }

  // Extract the month, day, and year
  const [month, day, year] = parts;

  // Return the date in MySQL's DATE format
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

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
  
  div_mesAtual.innerHTML = "";

  //mostra o mes atual e ano acima do calendario
  const monthYear = document.createElement("h2");
  monthYear.innerText = nomeMesAtual + " " + ano;
  div_mesAtual.appendChild(monthYear);

  //limpa o calendario de valores anteriores para nao sobreescrever com os valores antigos no for loop
  div_calendario.innerHTML = "";

  /*
    run for each day of the month displayed
  **/
//   $.ajax({
//     url: '/calendarTokenLab/server/proxy.php',
//     type: 'POST',
//     data: {action: 'fetch_events', user_id: user_id},
//     dataType: 'json'
//   }).then(function(response2) {
//   console.log('Second request successful:', response2);
//   // This function is called when the second request is successful.
//   // 'response2' contains the data returned from the second request.
//   calendar = response2.events;
//
// }).catch(function(error) {
//       // This function is called if any of the requests fail.
//       // 'error' contains the error information.
//
//       console.error('Request failed:', error);
//     });
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

      /*
       TODO: SQL FETCH DATE EVENTS FROM USER ID WHERE DATE = datestring

       */
      let dateSchedule = calendar.find((e) => e.date === dateString);

      let dateEvents = dateSchedule
        ? dateSchedule.dateEvents
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
        if (ftScheme) eventDivs[index].classList.add(ftScheme);
        if (bgScheme) eventDivs[index].classList.add(bgScheme);
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

/*

 */
/**
 * @param {null} date
 * @param {*} dateEvent
 */
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

function criarEvento() {
  if (inputEventoTitulo.value) {
    inputEventoTitulo.classList.remove("error");
    console.log(`diaClicado: ${diaClicado}\n`);
    console.log(`inputInicioValue: ${eventoInicio.value}\n`);
    console.log(`inputFimValue: ${eventoFim.value}\n`);
    console.log(`evento: ${calendar}`)



    /*
    TODO: SQL FETCH EVENTS BASED ON DATE
     */
    let dateSchedule = calendar.find((e) => e.date == diaClicado);
    if (dateSchedule) {
      let event = dateSchedule.dateEvents.find(
        (e) => e.title == inputEventoTitulo.value
      );
      if (event) {
        console.log("There is already an event with the same title, do");
      } else {
        /*
        TODO: SQL INSERT INTO dateEvents VALUES title description start end date User id
         */
        const newEvent = {
            title: inputEventoTitulo.value,
            description: inputEventoDescricao.value,
            start: eventoInicio.value,
            end: eventoFim.value,


        }

        dateSchedule.dateEvents.push(newEvent);
      }
    } else {
      /*
      it will become irrelevant whether a day has an event or not after implementing a date field
       */
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
    console.log(diaClicado)
    const mySqlEvent = {
      title: inputEventoTitulo.value,
      description: inputEventoDescricao.value,
      start: eventoInicio.value,
      end: eventoFim.value,
      date: diaClicado,
    }


    $.post('/calendarTokenLab/server/proxy.php', {
      action: 'create_event',
      user_id: user_id,
      event: mySqlEvent
    }).done(function(response){
      console.log('something')
      if(response){
        console.log(response.success)
      }else{
        console.log("no response");
      }
    }).fail(function(jqXHR, textStatus, errorThrown){
      console.error('Fetch Error:', errorThrown);
    });

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
    let dateEvent = calendar.find((e) => e.date == diaClicado).dateEvents.find((e) => e.title == eventoClicado.title);


    // ? eu pensei que oldEvent seria uma referencia para o eventoClicado, mas não é, e como se fosse uma copia, então não consigo alterar o eventoClicado com oldEvent = newEvent?

    const newEvent = {
      title: me_inputEventoTitulo.value,
      description: me_inputEventoDescricao.value,
      start: me_inputEventoInicio.value,
      end: me_inputEventoFim.value,
      date: diaClicado
    };

    const dateEvents = calendar.find((e) => e.date === diaClicado).dateEvents;


    $.post('/calendarTokenLab/server/proxy.php', {
      action: 'update_event',
      id: dateEvent.id,
      event: newEvent
    }).done(function(response){
      console.log('something')
      if(response){
        console.log(response.success)
      }else{
        console.log("no response");
      }
    }).fail(function(jqXHR, textStatus, errorThrown){
      console.error('Fetch Error:', errorThrown);
    });

    // filter and push
    // calendar.find((e) => e.date === diaClicado).dateEvents = dateEvents.filter(
    //   (e) => e !== eventoClicado
    // );
    // calendar.find((e) => e.date === diaClicado).dateEvents.push(newEvent);
    // localStorage.setItem("calendar", JSON.stringify(calendar));
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

function deletarEvento() {
  //TODO: DELETE event where date = dia clicado
  // eventos = eventos.filter((e) => e.date !== clicado);
  
  const dateEvents = calendar.find((e) => e.date === diaClicado).dateEvents;
  calendar.find((e) => e.date === diaClicado).dateEvents = dateEvents.filter(
    (e) => e !== eventoClicado
  );
  dateEvent = calendar.find((e) => e.date === diaClicado).dateEvents.find((e) => e.title == eventoClicado.title)

  $.post('/calendarTokenLab/server/proxy.php',{
    action: 'delete_event',
  id: dateEvent.id
  }).done(
      function(response){
        console.log('something')
        if(response){
          console.log(response.success)
        }else{
          console.log("no response");
        }
      }
  ).fail(function (jqXHR, textStatus, errorThrown){
    console.error('Fetch Error:', errorThrown);

  })
  // buttonDeletar.removeEventListener("click", deletarEvento(eventTitle));
  localStorage.setItem("calendar", JSON.stringify(calendar));
  fecharModal();
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

function removeClassesByPattern(element, regexPattern) {
  // Iterate over the classList
  for (var i = 0; i < element.classList.length; i++) {
    // Reset the lastIndex property of the regex pattern if it's global
    if (regexPattern.global) {
      regexPattern.lastIndex = 0;
    }

    // Test the class name against the regex pattern
    if (regexPattern.test(element.classList[i])) {
      // Remove the class if it matches the pattern
      element.classList.remove(element.classList[i]);

      // Decrement the counter to account for the removed class
      i--;
    }
  }
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

function applyScheme(event) {
  // Pattern to match strings that start with 'ft'
  const ftPattern = /^ft/;
  // Pattern to match strings that start with 'bg'
  const bgPattern = /^bg/;

  const div_semana = document.getElementById("semana");
  const div_diasDaSemana = document.getElementsByClassName("dias-da-semana");
  const div_eventos = document.getElementsByClassName("eventos");
  const btns_nav = document.querySelectorAll("#header button");
  const div_register = document.getElementById("register");

  const fontSchemeArr = [
    div_mesAtual,
    div_register,
    ...div_diasDaSemana,
    ...div_eventos,
    ...btns_nav,
  ];
  const bgColorSchemeArr = [body, ...div_eventos, ...btns_nav];

  const schemeId = event.target.id;
  switch (schemeId) {
    case "beeScheme":
      ftScheme = "ft_beeScheme";
      bgScheme = "bg_beeScheme";
      break;
    case "whiteBlueScheme":
      ftScheme = "ft_whiteBlueScheme";
      bgScheme = "bg_whiteBlueScheme";
      break;
    case "redBlackScheme":
      ftScheme = "ft_redBlackScheme";
      bgScheme = "bg_redBlackScheme";
    default:
      console.log("No id added to clicked canvas");
      break;
  }

  if (ftScheme && bgScheme) applySchemeClasses(ftScheme, bgScheme);

  function applySchemeClasses(cls_ftScheme, cls_bgScheme) {
    fontSchemeArr.forEach((div) => {
      removeClassesByPattern(div, ftPattern);
      div.classList.add(cls_ftScheme);
    });
    bgColorSchemeArr.forEach((div) => {
      removeClassesByPattern(div, bgPattern);
      div.classList.add(cls_bgScheme);
    });
  }
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
  schemeCvs.forEach((canvas) => {
    canvas.addEventListener("click", (event) => {
      applyScheme(event);
    });
  });
  // beeScheme.addEventListener("click", (event) => applyBeeScheme(event));
  // whiteBlueScheme.addEventListener("click", () => applyWBScheme());
  // redBlackScheme.addEventListener("click", () => applyRBScheme());
}

$.post('/calendarTokenLab/server/proxy.php', {
  action: 'fetch_id'
}).done(function(data){
  // If jQuery doesn't automatically parse the JSON response, uncomment the next line:
  // data = JSON.parse(data);

  if(data && data.user_id){ // Check if data is not null and user_id exists
    console.log("User ID:", data.user_id);
    console.log("hello sir");
    user_id = data.user_id;
    clicarButtons();
    load();
    fillColorPicker();
  } else {
    console.error('Invalid response:', data);
  }
}).fail(function(jqXHR, textStatus, errorThrown) {
  console.error('Fetch Error:', errorThrown);
});
// clicarButtons();
// load();
// fillColorPicker();
