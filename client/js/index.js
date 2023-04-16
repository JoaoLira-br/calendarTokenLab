

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

const div_calendario = document.getElementById("calendario");
const mesAtual = document.getElementById("mesAtual");
const buttonProximo = document.getElementById("buttonProximo");
const buttonVoltar = document.getElementById("buttonVoltar");

//modal e a janela de popup quando o user clica em algum dos blocos
const modalNovoEvento = document.getElementById("modalNovoEvento");
//backdrop e o sombreamento atras do popup 'modal'
const backDrop = document.getElementById("modalBackDrop");
//inputEventoTitulo e o input de texto do popup
const inputEventoTitulo = document.getElementById("inputEventoTitulo");
const inputEventoDescricao = document.getElementById("inputEventoDescricao");
const eventoInicio = document.getElementById("input-eventoInicio");
const eventoFim = document.getElementById("input-eventoFim");

const buttonSalvar = document.getElementById("buttonSalvar");
const buttonCancelar = document.getElementById("buttonCancelar");

//popup que abre quando se clica em um dia com um evento ja existente
const modalDeletarEvento = document.getElementById("modalDeletarEvento");

const buttonDeletar = document.getElementById("buttonDeletar");
const buttonFechar = document.getElementById("buttonFechar");
const buttonEditar = document.getElementById("buttonEditar");

//essa funcao abre um popup na tela quando o user clicar em dos blocos de dia do calendario




function abrirModal(date, dateEvent) {
  
  diaClicado = date;
  console.dir(calendar);
  const dateSchedule = calendar.find((e) => e.date === diaClicado);

  if(dateSchedule){

    if(dateEvent != null){
     eventoClicado = dateEvent;

      modalDeletarEvento.style.display = "block";
      document.getElementById("eventoTitulo").innerText = dateEvent.title;
      document.getElementById("eventoDescricao").innerText =
        dateEvent.description;
      document.getElementById("eventoComeco").innerText = dateEvent.start;
      document.getElementById("eventoFim").innerText = dateEvent.end;

      

    } else {
     modalNovoEvento.style.display = "block";
    // modalDeletarEvento.style.display = "block";
    // document.getElementById("eventoTitulo").innerText = eventosDoDia.title;
    // document.getElementById("eventoDescricao").innerText =
    //   eventosDoDia.description;
    // document.getElementById("eventoComeco").innerText = eventosDoDia.start;
    // document.getElementById("eventoFim").innerText = eventosDoDia.end;
    }
 } else {
    modalNovoEvento.style.display = "block";
  }
  backDrop.style.display = "block";
}

// essa funcao fecha todos os popups que estao na tela
function fecharModal() {
  inputEventoTitulo.classList.remove("error");
  modalNovoEvento.style.display = "none";
  backDrop.style.display = "none";
  modalDeletarEvento.style.display = "none";
  inputEventoTitulo.value = "";
  diaClicado = null;
  eventoClicado = null;
  load();
}

function salvarEvento() {

  // ? como achar evento?
  // console.log(eventos.find(e));
  
  if (inputEventoTitulo.value) {
    inputEventoTitulo.classList.remove("error");
    /*
    
    encapsular infos depois de date para uma JSON array para caber varios eventos

    Pseudocode de calendar object em localstorage: 
    calendar.find(e => date == clicado)
    if (not find)
      create new date 
    **/
   
    // eventos.push({
    //   date: clicado,
    //   title: inputEventoTitulo.value,
    //   description: inputEventoDescricao.value,
    //   start: eventoInicio.value,
    //   end: eventoFim.value,
    // });

    
      //RASCUNHO: 
      let dateSchedule = calendar.find((e) => e.date == diaClicado); 
      if (dateSchedule){
        let event = dateSchedule.dateEvents.find(e => e.title == inputEventoTitulo.value);
        if(event){
            console.log("There is already an event with the same title, do");
            
        } else{
          dateSchedule.dateEvents.push({
            title: inputEventoTitulo.value,
            description: inputEventoDescricao.value,
            start: eventoInicio.value,
            end: eventoFim.value,            
          })
        }
      } else {
        calendar.push({date: diaClicado, dateEvents: [{
          title: inputEventoTitulo.value,
          description: inputEventoDescricao.value,
          start: eventoInicio.value,
          end: eventoFim.value, 
          }]
      })
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

function editarEvento() {}


//todo: dateEvent nao e updated em deltarModal, 
// ele continua com o primeiro evento removido

function deletarEvento(dateEvent) {
  // eventos = eventos.filter((e) => e.date !== clicado);
  const dateEvents = calendar.find((e) => e.date === diaClicado).dateEvents; 
  calendar.find((e) => e.date === diaClicado).dateEvents = dateEvents.filter((e) => e !== eventoClicado);
  
  // buttonDeletar.removeEventListener("click", deletarEvento(eventTitle));
  localStorage.setItem("calendar", JSON.stringify(calendar));
  fecharModal();
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

      let dateEvents = calendar.find((e) => e.date === dateString) ? 
      calendar.find((e) => e.date === dateString).dateEvents : 
      null;

      // ! caution here
      
        
          fillEventBlocks(dateEvents, dateString, blocoDeDia);
          //
          // eventDiv.addEventListener("click", () => {
          // })
      
      
    } else {
      blocoDeDia.classList.add("div-diaPreenchimento");
    }
    div_calendario.appendChild(blocoDeDia);
  }


  /*
todo: testar passar events[i] como param de abrir modal se targetElement === eventDiv
  **/
  function fillEventBlocks(dateEvents, dateString, blocoDeDia) {
    let eventDivs = [];
    
    //
    if(dateEvents !== null && dateEvents.length != 0){
      let index = 0;
      dateEvents.forEach(dateEvent => {
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
      : abrirModal(dateString, null)

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
  buttonSalvar.addEventListener("click", () => salvarEvento());
  buttonFechar.addEventListener("click", () => fecharModal());
  buttonEditar.addEventListener("click", () => editarEvento());
}

clicarButtons();
load();
