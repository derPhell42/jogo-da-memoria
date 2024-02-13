let gameStarted = false;
if (!gameStarted) {
    // Exibir o overlay de introdução
}
// Adiciona um ouvinte de evento para o botão Novo Jogo
document.getElementById("reset-button").addEventListener("click", startNewGame);


const emojis = [
    "🤷‍♂️", "🤷‍♂️",
    "🤣", "🤣",
    "💻", "💻",
    "😡", "😡",
    "👾", "👾",
    "😎", "😎",
    "👻", "👻",
    "👽", "👽"
];
let openCards = [];
let timer; // Variável para armazenar o timer
let points = 300; // Inicializa o contador de pontos com 300
const timeLimit = 300; // Limite de tempo em segundos
const pointLossInterval = 10; // Intervalo de perda de pontos em segundos
const pointsLostPerInterval = 30; // Quantidade de pontos perdidos a cada intervalo
const pointsLostPerMismatch = 25; // Quantidade de pontos perdidos em caso de par errado
const pointsGainedPerMatch = 60; // Quantidade de pontos ganhos em caso de par certo
let gameEnded = false; // Variável para rastrear se o jogo terminou

// Embaralha os emojis
let shuffleEmojis = emojis.sort(() => (Math.random() > 0.5 ? 2 : -1));

// Função para iniciar o jogo
function startGame() {
    gameStarted = true;
    resetTimer(); // Reinicia o timer
    startTimer(); // Inicia o timer

    // Limpa o conteúdo da área do jogo antes de iniciar
    clearGameArea();

    // Define o número de cartas a serem criadas como metade do número de emojis
    const maxCards = Math.min(emojis.length, 16); // Limita a 16 cartas

    // Cria as cartas do jogo
    for (let i = 0; i < maxCards; i++) {
        let box = document.createElement("div");
        box.className = "item";
        box.innerHTML = shuffleEmojis[i];
        box.onclick = handleClick;
        document.querySelector(".game").appendChild(box);
    }
}

// Função para limpar a área do jogo antes de iniciar um novo jogo
function clearGameArea() {
    const gameArea = document.querySelector(".game");
    gameArea.innerHTML = ""; // Limpa o conteúdo da área do jogo
}

// Função chamada quando uma carta é clicada
function handleClick() {
    if (!gameEnded && openCards.length < 2) { // Verifica se o jogo ainda não terminou
        this.classList.add("boxOpen");
        this.classList.add("selected");
        openCards.push(this);
    }

    // Verifica se duas cartas foram viradas
    if (openCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

// Função para verificar se as cartas viradas são iguais
function checkMatch() {
    if (openCards[0].innerHTML === openCards[1].innerHTML) {
        // Se as cartas são iguais, adiciona a classe 'boxMatch'
        openCards[0].classList.add("boxMatch");
        openCards[1].classList.add("boxMatch");
        updatePoints(pointsGainedPerMatch); // Atualiza os pontos ganhos
    } else {
        // Se as cartas são diferentes, remove a classe 'boxOpen'
        openCards[0].classList.remove("boxOpen");
        openCards[1].classList.remove("boxOpen");
        updatePoints(-pointsLostPerMismatch); // Atualiza os pontos perdidos
    }

    openCards = []; // Limpa o array de cartas viradas

    // Verifica se o jogo acabou (todas as cartas foram combinadas)
    if (!gameEnded && document.querySelectorAll(".boxMatch").length === emojis.length) {
        endGame(); // Chama a função de fim de jogo
    }
}

// Função para atualizar os pontos
function updatePoints(change) {
    if (!gameEnded) { // Verifica se o jogo ainda não terminou
        points += change; // Atualiza os pontos

        // Atualiza a exibição dos pontos na interface
        document.querySelector(".points").textContent = `Pontos: ${points}`;

        // Seleciona o elemento que exibe as mudanças nos pontos ganhos ou perdidos
        const pointChangesElement = change > 0 ? document.getElementById('point-changes-gained') : document.getElementById('point-changes-lost');

        // Remove todas as classes de mudança para garantir que apenas uma seja adicionada por vez
        pointChangesElement.classList.remove('up', 'down');

        // Adiciona a classe correspondente à mudança nos pontos
        if (change !== 0) {
            showPointChange(pointChangesElement, change > 0 ? 'up' : 'down', change);
        }
    }
}

function showPointChange(element, className, change) {
    // Adiciona a classe para a mudança nos pontos
    element.classList.add(className);

    // Atualiza o texto das mudanças nos pontos
    element.textContent = `${change > 0 ? '+' : ''}${change}`;

    // Remove a classe de animação após algum tempo para poder aplicá-la novamente no próximo número
    setTimeout(() => {
        element.classList.remove(className);
        element.textContent = '';
    }, 1000);
}

// Função para iniciar o timer
function startTimer() {
    let timeRemaining = timeLimit; // Tempo restante em segundos

    timer = setInterval(() => {
        if (!gameEnded && timeRemaining > 0) { // Verifica se o jogo ainda não terminou e o tempo não esgotou
            timeRemaining--; // Decrementa o tempo restante
            // Atualiza a exibição do tempo na interface
            document.querySelector(".time").textContent = `Tempo: ${formatTime(timeRemaining)}`;

            // Deduz pontos apenas após os primeiros 10 segundos decorridos
            if (timeRemaining % pointLossInterval === 0 && timeRemaining < timeLimit) {
                updatePoints(-pointsLostPerInterval); // Atualiza os pontos perdidos
            }
        } else {
            clearInterval(timer); // Para o timer
            if (timeRemaining <= 0) {
                endGame(); // Chama a função de fim de jogo se o tempo esgotar
            }
        }
    }, 1000); // Atualiza a cada segundo
}

// Função para formatar o tempo (mm:ss)
function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Função para encerrar o jogo e exibir o overlay
function endGame() {
    gameEnded = true; // Define que o jogo terminou

    // Cria um elemento div para o overlay
    const overlay = document.createElement("div");
    overlay.classList.add("overlay2"); // Usando o nome overlay2

    // Cria o conteúdo do overlay
    const overlayContent = document.createElement("div");
    overlayContent.classList.add("overlay2-content");

    // Adiciona a quantidade de pontos
    const pointsDisplay = document.createElement("p");
    pointsDisplay.textContent = `Você fez ${points} pontos!`;
    overlayContent.appendChild(pointsDisplay);

    // Adiciona o botão "Novo Jogo"
    const newGameButton = document.createElement("button");
    newGameButton.textContent = "Novo Jogo";
    newGameButton.onclick = startNewGame; // Define a função a ser chamada ao clicar no botão
    overlayContent.appendChild(newGameButton);

    // Adiciona o conteúdo do overlay ao elemento overlay
    overlay.appendChild(overlayContent);

    // Adiciona o overlay ao corpo do documento
    document.body.appendChild(overlay);
}

// Função para iniciar um novo jogo
function startNewGame() {
    gameEnded = false; // Define que o jogo começou novamente
    resetTimer(); // Reinicia o timer

    // Remove o overlay
    const overlay = document.querySelector(".overlay2"); // Usando o nome overlay2
    if (overlay) {
        overlay.parentNode.removeChild(overlay);
    }

    // Reinicia o jogo
    points = 300; // Reinicia os pontos
    document.querySelector(".points").textContent = `Pontos: ${points}`; // Atualiza a exibição dos pontos na interface
    document.querySelector(".time").textContent = `Tempo: 05:00`; // Atualiza a exibição do tempo na interface
    startTimer(); // Inicia o timer
    startGame(); // Inicia um novo jogo
}

// Função para reiniciar o timer
function resetTimer() {
    clearInterval(timer); // Limpa o timer
}

// Inicia o jogo
startGame();

// Adiciona um ouvinte de evento de clique ao corpo
document.body.addEventListener("click", function(event) {
    // Cria um elemento de efeito de propagação
    const spreadEffect = document.createElement("div");
    spreadEffect.classList.add("spread-effect");

    // Define a posição do efeito para onde ocorreu o clique
    spreadEffect.style.left = event.pageX + "px";
    spreadEffect.style.top = event.pageY + "px";

    // Adiciona o efeito ao corpo
    document.body.appendChild(spreadEffect);

    // Remove o elemento de efeito após a animação ser concluída
    spreadEffect.addEventListener("animationend", function() {
        document.body.removeChild(spreadEffect);
    });
});
