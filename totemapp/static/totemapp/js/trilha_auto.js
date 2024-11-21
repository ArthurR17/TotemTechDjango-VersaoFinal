// Variáveis globais
let scale = 1; // Fator de zoom
let isDragging = false; // Controle de arrasto
let startX, startY; // Posições iniciais
const img = document.getElementById('trilha');
const container = document.querySelector('.container');

// Posição original da imagem
const originalPosition = {
    left: img.offsetLeft,
    top: img.offsetTop,
};

// Funções de zoom
function zoomIn() {
    scale += 0.1; // Aumenta o fator de zoom
    img.style.transform = `scale(${scale})`;
}

function zoomOut() {
    scale = Math.max(scale - 0.1, 1); // Diminui o fator de zoom
    img.style.transform = `scale(${scale})`;
}

function resetZoom() {
    scale = 1; // Reseta o fator de zoom
    img.style.transform = 'scale(1)';
    img.style.transformOrigin = 'center center'; // Reseta a posição da imagem
}

// Função para resetar a posição da imagem
function resetImagePosition() {
    img.style.left = `${originalPosition.left}px`;
    img.style.top = `${originalPosition.top}px`;
}

// Função para mostrar e esconder "Sobre"
function toggleSobre() {
    const sobreContainer = document.querySelector('.sobre-container');
    sobreContainer.style.display = (sobreContainer.style.display === 'none' || sobreContainer.style.display === '') ? 'block' : 'none';
}

// Função para arrastar a imagem
img.addEventListener('mousedown', function(e) {
    isDragging = true;
    startX = e.clientX - img.offsetLeft;
    startY = e.clientY - img.offsetTop;
    img.style.cursor = 'move';
});

document.addEventListener('mouseup', function() {
    isDragging = false;
    img.style.cursor = 'default';
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        img.style.left = e.clientX - startX + 'px';
        img.style.top = e.clientY - startY + 'px';
        img.style.position = 'absolute';
    }
});

// Função para mostrar e esconder "Sobre"
function toggleSobre() {
    const sobreContainer = document.querySelector('.sobre-container');
    // Alterna a classe "open" e verifica o display inicial
    if (sobreContainer.style.display === 'none' || sobreContainer.style.display === '') {
        sobreContainer.style.display = 'block';
        setTimeout(() => {
            sobreContainer.classList.add('open');
        }, 10);
    } else {
        sobreContainer.classList.remove('open');
        setTimeout(() => {
            sobreContainer.style.display = 'none';
        }, 500);
    }
}


