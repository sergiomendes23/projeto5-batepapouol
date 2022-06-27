let mensages = []
let conteudo = document.querySelector('.mensagens')
let usuarioPrivate = ""
let sendMensages = document.querySelector('escreverMensagem')
let nomeChat = ""
entrei()

setInterval (getMensage, 3000)
function getMensage(){
    let promise =  axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then((response) => {
         mensages = response.data
         conteudo.innerHTML = "";

         for (let i = 0; i < mensages.length; i++){
             if (mensages[i].type === "status"){
                conteudo.innerHTML += `
                <div class="mensageStatus">
                    <span>(${mensages[i].time}) </span>
                    <span>${mensages[i].from}</span>
                    <span>${mensages[i].text}</span>
                </div>
                `
             }else if(mensages[i].type === "message"){
                conteudo.innerHTML +=
                `
                <div class="mensageAll">
                    <span>(${mensages[i].time})</span>
                    <span>${mensages[i].from}</span>
                    <span> para <strong>${mensages[i].to}</strong>:</span>
                    <span>${mensages[i].text}</span>
                </div>
                `
             }else if(mensages[i].to === "usuarioPrivate"){
                conteudo.innerHTML +=
                `
                <div class="mensagePrivate">
                    <span>(${mensages[i].time})</span>
                    <span>${mensages[i].from}</span>
                    <span> reservadamente para <strong>${mensages[i].to}</strong>:</span>
                    <span>${mensages[i].text}</span>
                </div>
                `
             }
         }
         let lastMessage = conteudo.querySelector(".mensagens");
        lastMessage.scrollIntoView()
    })
}
function entrei(){
    nomeChat = prompt ("Seja bem vindo! Qual é o seu nome?")
    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', {name:nomeChat})
    promise.then(getMensage())
    promise.catch(tratarErro)
}

function tratarErro(){
    alert ("Este nome de usuário já existe, tente outro.");
    entrei();
 }

setInterval(logStatus, 5000);
function logStatus(){
    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', {name:nomeChat});
}
function enviarMensagem(){
    let receberMensagem = document.querySelector('input');
    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', {
        from: nomeChat,
        to: 'todos',
        text: receberMensagem.value,
        type: 'message'
    })
    receberMensagem.value = ""
    promise.then((response) => {
        getMensage()
    })
    promise.catch((error) => window.location.reload())
}