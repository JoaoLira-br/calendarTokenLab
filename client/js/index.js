
//note:array de eventos vai estar em formato de string ao inves de objetos. Portanto precisa parsar com JSON.
//note: local storage e preferivel (entre cookies e session storage) pois permite que a info do usuario nunca expire(nao perder eventos salvos). e funcionam iguais como um JSON object(key, value) 
let eventos = localStorage.getItem('eventos') ? JSON.parse(localStorage.getItem('eventos')): [];

// note: "nav" mantem registro do mes que estamos
let nav = 0;
//note: "clicado" mantem registro se um dia do mes foi clicado ou nao
let clicado = null;

//note: dependendo do dia da semana que for o primeiro dia do mes, so preciso contar os dias anteriores da semana para saber quantos dias de preenchimento precisa
const diasDaSemana = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];

const calendario = document.getElementById('calendario');
const mesAtual = document.getElementById('mesAtual');
const buttonProximo = document.getElementById('buttonProximo');
const buttonVoltar = document.getElementById('buttonVoltar');

//modal e a janela de popup quando o user clica em algum dos blocos
const newEventModal = document.getElementById('newEventModal');
//backdrop e o sombreamento atras do popup 'modal'
const backDrop = document.getElementById('modalBackDrop');
//eventTitleInput e o input de texto do popup
const eventTitleInput = document.getElementById('eventTitleInput');
const eventDescriptionInput = document.getElementById('eventDescriptionInput');
const eventoInicio = document.getElementById('input-eventoInicio');
const eventoFim = document.getElementById('input-eventoFim');

const saveButton = document.getElementById('saveButton');
const cancelButton = document.getElementById('cancelButton');

//popup que abre quando se clica em um dia com um evento ja existente
const deleteEventModal = document.getElementById('deleteEventModal');
const deleteButton = document.getElementById('deleteButton');
const closeButton = document.getElementById('closeButton');
const editButton = document.getElementById('editButton');

//essa funcao abre um popup na tela quando o user clicar em dos blocos de dia do calendario
function openModal(date){
    clicado = date;
    const eventsForDay = eventos.find(e => e.date === clicado);
    if(eventsForDay){
        document.getElementById('eventText').innerText = eventos.title;
        deleteEventModal.style.display = 'block';
    }else{
        newEventModal.style.display = 'block';
    }
backDrop.style.display = 'block';
}

// essa funcao fecha todos os popups que estao na tela 
function closeModal(){
    eventTitleInput.classList.remove('error');
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    deleteEventModal.style.display = 'none';
    eventTitleInput.value = '';
    clicado = null;
    load();
}
//essa funcao serve para salvar os eventos que eu criar um dia
function saveEvent(){
    if(eventTitleInput.value){
        eventTitleInput.classList.remove('error');
        eventos.push({
            date: clicado,
            title: eventTitleInput.value,
            description: eventDescriptionInput.value,
            start: eventoInicio.value,
            end:eventoFim.value
            
        });
        
        localStorage.setItem('eventos', JSON.stringify(eventos));
        closeModal();
    }else{
        eventTitleInput.classList.add('error');
    }  
}

function deleteEvent(){
    eventos = eventos.filter(e => e.date !== clicado);
    localStorage.setItem('eventos', JSON.stringify(eventos));
    
    closeModal();
}


// a funcao load() serve para preencher e mostrar o calendario, levando em consideracao os eventos, e o mes que se esta
function load() {
        const dt = new Date();
        console.log(dt);
        if(nav !== 0){
            dt.setMonth(new Date().getMonth() + nav);
        }

        const dia = dt.getDate();
        //obs: meses comecam em 0
        const mes = dt.getMonth() + 1;
        const ano = dt.getFullYear();
        // calculando o primeiro dia do Mes para inserir dias de preenchimento corretamente no calendario
        const primeiroDiaDoMes = new Date(ano, mes-1, 1);

        //calculando a quantidade de dias do mes para poder renderizar apropriadamente no calendario. o '0' como param day e igual a o utlimo dia do mes anterior, ou seja, dias do mes
        const diasDoMes = new Date(ano, mes, 0).getDate();

        const diaLocal = primeiroDiaDoMes.toLocaleDateString('pt-br',
        {
        weekday:"long",
        day:"numeric",
        month:"numeric",
        year:"numeric"
        }
        );

        const nomeMesAtual=dt.toLocaleDateString('pt-BR',{month:'long'});

        //retirando o dia da semana de dentro da string diaLocal, com a inicial maiscula 
        const localDiaDaSemana=diaLocal.substring(0,1).toUpperCase()+diaLocal.split(', ')[0].substring(1);
        console.log(localDiaDaSemana);

        //calculando os dias de preenchimento: os dias antes do primeiro dia do mes para renderizar o calendario uniformemente
        const diasDePreenchimento = diasDaSemana.indexOf(localDiaDaSemana);
        console.log(diasDePreenchimento);
        
        //mostra o mes atual e ano acima do calendario
        mesAtual.innerText=nomeMesAtual.substring(0,1).toUpperCase()+nomeMesAtual.substring(1)+", "+ano;

        //limpa o calendario de valores anteriores para nao sobreescrever com os valores antigos no for loop
        calendario.innerHTML = '';
        

        
        for(let i = 1; i <= diasDePreenchimento + diasDoMes; i++){
            const blocoDeDia=document.createElement('div');
            
            if(i > diasDePreenchimento){
                blocoDeDia.classList.add('div-dia');
                blocoDeDia.addEventListener('click', () => openModal(`${mes}/${i - diasDePreenchimento}/${ano}`));
                blocoDeDia.innerText = i - diasDePreenchimento;
                const diaString = `${mes}/${i - diasDePreenchimento}/${ano}`;
                const eventsForDay = eventos.find(e => e.date === diaString);

                if(i - diasDePreenchimento === dia && nav === 0){
                    blocoDeDia.id = 'diaAtual';
                }
                if(eventsForDay){
                    const eventDiv = document.createElement('div');
                    eventDiv.classList.add('eventos');
                    eventDiv.innerText = eventsForDay.title;
                    blocoDeDia.appendChild(eventDiv);
                }
                
            }else{
                blocoDeDia.classList.add('div-diaPreenchimento')
            }
            calendario.appendChild(blocoDeDia);
        }     

    }
  

    function clicarButtons(){
        buttonProximo.addEventListener('click',() => {
            nav++;
            load();
        });
        buttonVoltar.addEventListener('click',() => {
            nav--;
            load();
        });


         cancelButton.addEventListener('click', () => closeModal());
         saveButton.addEventListener('click', () => saveEvent());
         deleteButton.addEventListener('click', () => deleteEvent());
         closeButton.addEventListener('click', () => closeModal());
         editButton.addEventListener('click', () => editEvent());
        
    }

clicarButtons();
load();
