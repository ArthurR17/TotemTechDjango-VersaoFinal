// Função para abrir o modal e preencher o conteúdo
function abrirModal(url) {
    fetch(url)
        .then(response => response.json())
        .then(curso => {
            // Atualiza o conteúdo do modal com os dados recebidos do servidor
            document.getElementById('modal-titulo').innerText = curso.nome;
            document.getElementById('modal-descricao').innerText = curso.desc;
            document.getElementById('modal-carga').innerText = 'CARGA HORÁRIA: ' + curso.carga_horaria;


            // Verifica se o curso é gratuito (valor é nulo, undefined ou zero)
            if (curso.valor && curso.valor > 0) {
                // Formata o valor do curso
                let valorFormatado = curso.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                let valorParcelado = (curso.valor / 12).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL'});

                // Atualiza o texto do modal com os valores e exibe os elementos
                document.getElementById('modal-valor').innerText = 'Valor total: ' + valorFormatado;
                document.getElementById('modal-parcela').innerText = 'Pagamento no Cartão: \n12x ' + valorParcelado;
                document.getElementById('modal-valor').style.display = 'block';
                document.getElementById('modal-parcela').style.display = 'block';
                document.getElementById('modal-desconto').style.display = 'block';
            } else {
                // Oculta os elementos de valor e parcelas para cursos gratuitos
                document.getElementById('modal-valor').style.display = 'none';
                document.getElementById('modal-parcela').style.display = 'none';
                document.getElementById('modal-desconto').style.display = 'none';
            }


            // Abre o modal
            const modal = document.getElementById('modalResumo');
            modal.style.display = 'flex';
            setTimeout(function () {
                modal.classList.add('open');
            }, 10);

            // Adiciona o event listener ao botão "Fechar"
            const modalCloseButton = document.getElementById('modal-close');
            if (modalCloseButton) {
                modalCloseButton.addEventListener('click', function () {
                    fecharModal('modalResumo');
                });
            }

            // Preenche o conteúdo dos acordeões imediatamente ao abrir o modal
            preencherConteudoAcordeao(url, 'flush-collapseOne', 'modal-programacao', 'programacao');
            preencherConteudoAcordeao(url, 'flush-collapseTwo', 'modal-requisitos', 'requisitos');
        });
}

// Função para preencher o conteúdo de um acordeão (modificada)
function preencherConteudoAcordeao(url, collapseId, contentId, dataKey) {
    fetch(url)
        .then(response => response.json())
        .then(curso => {
            const contentDiv = document.getElementById(contentId);
            contentDiv.innerHTML = '<ul>' + curso[dataKey].map(item => `<li>${item}</li>`).join('') + '</ul>';
        })
        .catch(error => {
            console.error('Erro ao buscar dados do curso:', error);
        });
}
// Função para fechar o modal (adaptada para receber o ID do modal)
function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('open');
    setTimeout(function () {
        modal.style.display = 'none';
    }, 300);
}

// Adiciona listeners de evento aos botões "Saiba mais"
document.querySelectorAll('.saiba-mais').forEach(function(button) {
    button.addEventListener('click', function() {
        const cursoId = this.getAttribute('data-id');
        abrirModal(cursoId);
    });
});

// Seleciona todos os botões "Estou interessado"
const botoesInteressado = document.querySelectorAll('.interessado');

// Adiciona um event listener a cada botão "Estou interessado"
botoesInteressado.forEach(botao => {
    botao.addEventListener('click', function() {
        const modal = document.getElementById('modalInteressado');
        modal.style.display = 'flex';
        setTimeout(function() {
            modal.classList.add('open');
        }, 10);
    });
});


// Adiciona listeners de evento para fechar os modais ao clicar fora
window.addEventListener('click', function(event) {
    const modalResumo = document.getElementById('modalResumo');
    const modalInteressado = document.getElementById('modalInteressado');

    if (event.target === modalResumo) {
        fecharModal('modalResumo');
    } else if (event.target === modalInteressado) {
        fecharModal('modalInteressado');
    }
});

// Adiciona listeners de evento para os botões de fechar (X)
document.querySelectorAll('.close').forEach(closeButton => {
    closeButton.addEventListener('click', function() {
        const modalId = this.closest('.modal').id;
        fecharModal(modalId);
    });
});


// Acordeão para Programação e Requisitos
document.getElementById('accordionFlushExample').addEventListener('shown.bs.collapse', function (event) {
    const button = event.target.previousElementSibling.querySelector('.accordion-button');

    // Obtém a URL do atributo de dados do botão do acordeão
    const url = button.dataset.url;

    // Busca os dados do curso usando a URL
    fetch(url)
        .then(response => response.json())
        .then(curso => {
            // Movendo todo o código para dentro do then, incluindo a definição de accordionCollapse
            const accordionCollapse = event.target;
            if (accordionCollapse.id === 'flush-collapseOne') {
                const programacaoDiv = document.getElementById('modal-programacao');
                programacaoDiv.innerHTML = '<ul>' + curso.programacao.map(item => `<li>${item}</li>`).join('') + '</ul>';
            } else if (accordionCollapse.id === 'flush-collapseTwo') {
                const requisitosDiv = document.getElementById('modal-requisitos');
                requisitosDiv.innerHTML = '<ul>' + curso.requisitos.map(item => `<li>${item}</li>`).join('') + '</ul>';
            }
        })
        .catch(error => {
            console.error('Erro ao buscar dados do curso:', error);
            // Adicione aqui um tratamento de erro mais amigável para o usuário, se necessário
        });
});



// Seleciona os modais e o botão de fechar
const modalConfirmacao = document.getElementById("modalConfirmacao");
const modalInteressado = document.getElementById("modalInteressado");
const closeModalBtn = document.querySelector(".close-modal");

// Seleciona o formulário de interesse e o de busca
const formInteressado = document.getElementById("form-interessado");



// Adiciona event listeners aos botões "Estou interessado"
document.querySelectorAll('.interessado').forEach(botao => {
    botao.addEventListener('click', function() {
        // Abre o modal "Estou Interessado"
        modalInteressado.classList.add('open');
    });
});

// Adiciona listeners de evento para fechar os modais ao clicar fora
window.addEventListener('click', function(event) {
    if (event.target === modalInteressado) {
        modalInteressado.classList.remove('open');
    }
    if (event.target === modalConfirmacao) {
        modalConfirmacao.classList.remove('open');
    }
});

// Adiciona listeners de evento para os botões de fechar (X) de outros modais
document.querySelectorAll('.close').forEach(closeButton => {
    closeButton.addEventListener('click', function() {
        const modalId = this.closest('.modal').id;
        document.getElementById(modalId).classList.remove('open');
    });
});




document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('modalConfirmacaoNova');
    const fecharModalButton = document.querySelector('.fechar-modal-novo');

    // Esconde o modal automaticamente após 5 segundos
    if (modal && modal.style.display === 'block') {
        setTimeout(() => {
            modal.style.display = 'none'; // Esconde o modal
            window.location.href = window.location.pathname; // Reseta a página
        }, 5000); // 5000 milissegundos = 5 segundos
    }

    // Adiciona evento para fechar o modal ao clicar no botão
    if (fecharModalButton) {
        fecharModalButton.addEventListener('click', () => {
            modal.style.display = 'none'; // Esconde o modal ao clicar
            window.location.href = window.location.pathname; // Reseta a página
        });
    }
});

function abrirModalInteressado(botao) {
    // Obtém o nome do curso do atributo data-curso-nome
    const cursoNome = botao.getAttribute('data-curso-nome');

    // Verifica se o cursoNome foi obtido
    console.log("Nome do curso selecionado:", cursoNome);

    // Define o valor do campo oculto no formulário com o nome do curso
    document.getElementById('curso_nome').value = cursoNome;

    // Abre o modal de interesse
    const modal = document.getElementById('modalInteressado');
    modal.style.display = 'flex';
    setTimeout(function () {
        modal.classList.add('open');
    }, 10);
}

function filtrarCursos(checkbox) {
    const urlParams = new URLSearchParams(window.location.search);

    if (checkbox.checked) {
        urlParams.set('gratuitos', '1'); // Adiciona o parâmetro "gratuitos=1"
    } else {
        urlParams.delete('gratuitos'); // Remove o parâmetro "gratuitos"
    }

    window.location.search = urlParams.toString(); // Redireciona para a nova URL
}

document.addEventListener('DOMContentLoaded', function() {
    // Máscara para o CPF no formato 000.000.000-00
    new Cleave('#id_cpf', {
        delimiters: ['.', '.', '-'],
        blocks: [3, 3, 3, 2],
        numericOnly: true
    });

    // Máscara para o Telefone no formato (00) 00000-0000
    new Cleave('#id_telefone', {
        delimiters: ['(', ') ', '-'],
        blocks: [0, 2, 5, 4],
        numericOnly: true
    });

    const cpfInput = document.querySelector('#id_cpf');
    const telefoneInput = document.querySelector('#id_telefone');
    const emailInput = document.querySelector('#id_email');
    const nomeInput = document.querySelector('#id_nome');
    const dataNascimentoInput = document.querySelector('#id_data_nascimento'); // Supondo que esse seja o ID do campo de data
    const mensagemErro = document.getElementById('mensagemErro');

    // Função de validação para o CPF
    function validarCpf() {
        if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpfInput.value)) {
            return "CPF inválido. Utilize o formato 000.000.000-00.";
        }
        return '';
    }

    // Função de validação para o Telefone
    function validarTelefone() {
        if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(telefoneInput.value)) {
            return "Telefone inválido. Utilize o formato (00) 00000-0000.";
        }
        return '';
    }

    // Função de validação para o Email
    function validarEmail() {
        if (!/\S+@\S+\.\S+/.test(emailInput.value)) {
            return "Email inválido.";
        }
        return '';
    }

    // Função de validação para o Nome
    function validarNome() {
        if (!nomeInput.value) {
            return "O nome é obrigatório.";
        }
        return '';
    }

    // Função de validação para a Data de Nascimento
    function validarDataNascimento() {
        if (!dataNascimentoInput.value) {
            return "A data de nascimento é obrigatória.";
        }
        return '';
    }

    // Função de validação geral que mostra mensagens de erro
    function validarCampos() {
        mensagemErro.innerHTML = ''; // Limpa mensagens anteriores

        let mensagensErro = [];
        const cpfErro = validarCpf();
        const telefoneErro = validarTelefone();
        const emailErro = validarEmail();
        const nomeErro = validarNome();
        const dataNascimentoErro = validarDataNascimento();

        if (cpfErro) mensagensErro.push(cpfErro);
        if (telefoneErro) mensagensErro.push(telefoneErro);
        if (emailErro) mensagensErro.push(emailErro);
        if (nomeErro) mensagensErro.push(nomeErro);
        if (dataNascimentoErro) mensagensErro.push(dataNascimentoErro);

        // Exibe mensagens de erro
        if (mensagensErro.length > 0) {
            mensagemErro.innerHTML = mensagensErro.join('<br>'); // Mostra as mensagens de erro
        }
    }

    // Adiciona evento de input aos campos para validar apenas ao digitar
    cpfInput.addEventListener('input', function() {
        const erro = validarCpf();
        mensagemErro.innerHTML = erro ? erro : ''; // Limpa a mensagem se não houver erro
    });

    telefoneInput.addEventListener('input', function() {
        const erro = validarTelefone();
        mensagemErro.innerHTML = erro ? erro : ''; // Limpa a mensagem se não houver erro
    });

    emailInput.addEventListener('input', function() {
        const erro = validarEmail();
        mensagemErro.innerHTML = erro ? erro : ''; // Limpa a mensagem se não houver erro
    });

    nomeInput.addEventListener('input', function() {
        const erro = validarNome();
        mensagemErro.innerHTML = erro ? erro : ''; // Limpa a mensagem se não houver erro
    });

    dataNascimentoInput.addEventListener('input', function() {
        const erro = validarDataNascimento();
        mensagemErro.innerHTML = erro ? erro : ''; // Limpa a mensagem se não houver erro
    });

    // Adiciona evento de submit para validar antes de enviar
    document.getElementById('form-interessado').addEventListener('submit', function(event) {
        validarCampos(); // Valida os campos antes de enviar

        // Se houver mensagens de erro, não envia o formulário
        if (mensagemErro.innerHTML !== '') {
            event.preventDefault(); // Impede o envio
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-interessado');
    const botaoEnviar = document.getElementById('botaoEnviar');
    const loading = document.getElementById('loading');

    form.addEventListener('submit', function(event) {
        botaoEnviar.disabled = true; // Desativa o botão de enviar
        loading.style.display = 'flex'; // Mostra o ícone de carregamento
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // Bloqueia o scroll horizontal
    document.body.style.overflowX = 'hidden';

    // Adiciona um evento de redimensionamento para garantir que o scroll horizontal permaneça bloqueado
    window.addEventListener('resize', function() {
        document.body.style.overflowX = 'hidden';
    });
});











