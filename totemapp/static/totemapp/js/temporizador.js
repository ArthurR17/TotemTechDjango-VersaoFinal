// Define o tempo limite de inatividade (em milissegundos)
const tempoLimite = 60000;
let temporizador;

// Função que redireciona para a tela inicial
function redirecionarParaTelaInicial() {
    window.location.href = urlTelaInterativa;
}

// Função que reseta o temporizador de inatividade
function resetarTemporizador() {
    clearTimeout(temporizador);
    temporizador = setTimeout(redirecionarParaTelaInicial, tempoLimite); // Reinicia o temporizador
}

// Define eventos que resetam o temporizador (movimento do mouse, teclas e toques)
window.onload = function() {
    document.body.addEventListener('mousemove', resetarTemporizador);
    document.body.addEventListener('keydown', resetarTemporizador);
    document.body.addEventListener('touchstart', resetarTemporizador);
    resetarTemporizador(); // Inicia o temporizador quando a página carrega
};