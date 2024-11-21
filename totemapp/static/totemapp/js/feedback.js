// Abrir e fechar o modal de feedback
const openFeedbackBtn = document.getElementById('open-feedback-btn');
const feedbackModal = document.getElementById('feedback-modal');
const submitFeedbackBtn = document.getElementById('submit-feedback');
const closeModalBtn = document.getElementById('close-feedback-modal');
const feedbackOptions = document.querySelectorAll('.feedback-option');
const thankYouMessage = document.getElementById('thank-you-message');
const emojiName = document.getElementById('emoji-name');
const feedbackInput = document.getElementById('feedback-input'); // Campo de entrada de feedback
let selectedFeedback = ''; // Variável para armazenar o emoji selecionado

// Mapear os IDs dos emojis para seus nomes
const emojiNames = {
    pessimo: 'Muito Insatisfeito',
    ruim: 'Insatisfeito',
    neutro: 'Neutro',
    bom: 'Satisfeito',
    excelente: 'Muito Satisfeito'
};

// Abrir modal de feedback
openFeedbackBtn.addEventListener('click', () => {
    feedbackModal.style.display = 'flex';
    feedbackModal.style.animation = 'fadeIn 0.5s ease-in-out';
});

// Selecionar emoji de feedback
feedbackOptions.forEach(option => {
    option.addEventListener('click', () => {
        feedbackOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedFeedback = option.id; // Armazena o emoji selecionado
        emojiName.textContent = emojiNames[selectedFeedback]; // Atualiza o nome do emoji
        feedbackInput.style.display = 'block'; // Exibir campo de comentário
        feedbackInput.setAttribute('required', 'required'); // Tornar obrigatório
    });
});

// Submeter feedback
submitFeedbackBtn.addEventListener('click', () => {
    if (selectedFeedback) { // Verifica se um emoji foi selecionado
        const feedbackInputValue = feedbackInput.value.trim(); // Obtém o comentário, se houver

        // Verifica se o comentário é obrigatório
        if (feedbackInputValue === '') {
            alert("Por favor, forneça uma observação sobre como podemos melhorar."); // Mensagem de erro se não houver comentário
            return; // Não envia o feedback se o comentário for obrigatório e estiver vazio
        }

        enviarFeedback(selectedFeedback, feedbackInputValue); // Envia o feedback com comentário
    } else {
        alert("Por favor, selecione um emoji antes de enviar seu feedback."); // Mensagem de erro se não houver emoji selecionado
    }
});

// Função para enviar feedback
function enviarFeedback(feedback, text) {
    fetch('/enviar_feedback/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': getCookie('csrftoken') // Obter o token CSRF
        },
        body: new URLSearchParams({
            'emoji': feedback,
            'comentario': text // Envia o comentário, que pode ser vazio
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na resposta da rede');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.mensagem);
        thankYouMessage.innerHTML = "Obrigado pelo seu feedback!";
        thankYouMessage.style.display = 'block';
        setTimeout(() => {
            feedbackModal.style.display = 'none';
            resetFeedback();
        }, 1500);
    })
    .catch(error => {
        console.error('Erro ao enviar feedback:', error);
    });
}

// Função para obter o token CSRF
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue; // Retorna o valor do cookie
}

// Função para resetar o feedback
function resetFeedback() {
    selectedFeedback = ''; // Reseta a seleção do emoji
    feedbackOptions.forEach(opt => opt.classList.remove('selected')); // Remove a seleção dos emojis
    feedbackInput.value = ''; // Limpa o campo de entrada
    feedbackInput.style.display = 'block'; // Exibir o campo de comentário
    thankYouMessage.style.display = 'none'; // Esconde a mensagem de agradecimento
    emojiName.textContent = ''; // Limpa o nome do emoji
}

// Fechar o modal com o botão "X"
closeModalBtn.addEventListener('click', () => {
    feedbackModal.style.display = 'none'; // Fecha o modal
    resetFeedback(); // Reseta os campos
});

// Fechar o modal quando clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === feedbackModal) {
        feedbackModal.style.display = 'none';
        resetFeedback();
    }
});
