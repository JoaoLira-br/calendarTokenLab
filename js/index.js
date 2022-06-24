// note: "nav" mantem registro do mes que estamos
let nav = 0;
//note: "clicado" mantem registro se um dia do mes foi clicado ou nao
let clicado = null;
//note:array de eventos vai estar em formato de string ao inves de objetos. Portanto precisa parsar com JSON.
//note: local storage e preferivel (entre cookies e session storage) pois permite que a info do usuario nunca expire(nao perder eventos salvos). e funcionam iguais como um JSON object(key, value) 

let eventos = localStorage.getItem('eventos') ? JSON.parse(localStorage.getItem('events')): [];

//note: dependendo do dia da semana que for o primeiro dia do mes, so preciso contar os dias anteriores da semana para saber quantos dias de preenchimento precisa
const diasDaSemana = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sabado'];
const calendario = document.getElementById('calendario');

function load() {
        const dt = new Date();
        console.log(dt);
        const dia = dt.getDate();
        //obs: meses comecao em 0
        const mes = dt.getMonth() + 1;
        const ano = dt.getFullYear();
        

        // calculando o primeiro dia do mes para inserir dias de padding corretamente no calendario
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
        //retirando o dia da semana de dentro da string diaLocal, com a inicial maiscula 
        const localDiaDaSemana=diaLocal.substring(0,1).toUpperCase()+diaLocal.split(', ')[0].substring(1);
        console.log(localDiaDaSemana);
        //calculando os dias de preenchimento: os dias antes do primeiro dia do mes para renderizar o calendario uniformemente
        const diasDePreenchimento = diasDaSemana.indexOf(localDiaDaSemana)
        console.log(diasDePreenchimento);

        for(let i = 1; i <= diasDePreenchimento + diasDoMes; i++){
            const blocoDeDia=document.createElement('div');
            
            if(i > diasDePreenchimento){
                blocoDeDia.classList.add('div-dia');
                blocoDeDia.addEventListener('click', () => console.log('click'));
                blocoDeDia.innerText = i - diasDePreenchimento;
                
            }else{
                blocoDeDia.classList.add('div-diaPreenchimento')
            }
            calendario.appendChild(blocoDeDia);
        }       
    }

load();
