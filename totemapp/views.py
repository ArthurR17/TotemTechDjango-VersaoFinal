from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Q
from .forms import CursoForm, FeedbackForm, InteresseForm
from .models import Curso, Interesse
from django.core.mail import send_mail
from django.utils.html import strip_tags
from django.conf import settings
from django.shortcuts import get_object_or_404
from babel.dates import format_date


def tela_inicial(request):
    # Desloga o usuário toda vez que a página for acessada
    logout(request)
    return render(request, 'paginas/tela_inicial.html')


def menu_opcoes(request):
    # Desloga o usuário toda vez que a página for acessada
    logout(request)
    return render(request, 'paginas/menu_opcoes.html')


def cursos(request):
    cursos = Curso.objects.all()
    form = InteresseForm()

    # Filtragem por parâmetros GET
    search_query = request.GET.get('search')
    area = request.GET.get('area')
    nivel = request.GET.get('nivel')
    modalidade = request.GET.get('modalidade')
    gratuitos = request.GET.get('gratuitos')

    # Filtro de pesquisa (busca por nome, área ou modalidade)
    if search_query:
        cursos = cursos.filter(
            Q(nome__icontains=search_query) |
            Q(area__icontains=search_query) |
            Q(modalidade__icontains=search_query)
        )

    # Filtro para cursos com área, nível ou modalidade específicas
    if area:
        cursos = cursos.filter(area=area)
    if nivel:
        cursos = cursos.filter(nivel=nivel)
    if modalidade:
        cursos = cursos.filter(modalidade=modalidade)

    if gratuitos == '1':  # Verifica se o checkbox está marcado
        cursos = cursos.filter(gratis=False)  # Filtra cursos que são gratuitos

    # Paginação
    paginator = Paginator(cursos, 10)  # 10 cursos por página
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Lógica do formulário
    if request.method == 'POST':
        form = InteresseForm(request.POST)
        if form.is_valid():
            # Salvar dados no banco de dados
            interesse = form.save(commit=False)
            interesse.curso_nome = request.POST.get('curso_nome', '')
            interesse.save()

            # Obter a data de nascimento diretamente do formulário validado
            data_nascimento = form.cleaned_data['data_nascimento']

            # Formatando a data de nascimento no formato "Dia de Mês de Ano" em português
            data_nascimento_formatada = format_date(data_nascimento, format='long', locale='pt_BR')

            # Enviar e-mail
            assunto = f"Novo Interesse no Curso: {interesse.curso_nome}"
            mensagem_html = f"""
                    <h2>Detalhes do Interesse no Curso: {interesse.curso_nome}</h2>
                    <p><strong>Nome:</strong> {interesse.nome}</p>
                    <p><strong>Data de Nascimento:</strong> {data_nascimento_formatada}</p>
                    <p><strong>CPF:</strong> {interesse.cpf}</p>
                    <p><strong>Email:</strong> {interesse.email}      </p>
                    <p><strong>Telefone:</strong> {interesse.telefone}</p>
                    <p><strong>Curso:</strong> {interesse.curso_nome}</p>
                """
            mensagem_texto = strip_tags(mensagem_html)  # Mensagem alternativa sem HTML

            # Envia o e-mail usando a função send_mail
            send_mail(
                assunto,
                mensagem_texto,
                settings.EMAIL_HOST_USER,  # Remetente
                ['arthur48.santos@hotmail.com'],  # Destinatário
                fail_silently=False,
                html_message=mensagem_html  # Inclui versão HTML
            )

            return redirect(request.path + '?modal=1')
        else:
            messages.error(request, "Por favor, corrija os erros no formulário.")

    mostrar_modal_confirmacao = request.GET.get('modal') == '1'

    return render(request, 'paginas/cursos.html', {
        'page_obj': page_obj,
        'form': form,
        'mostrar_modal_confirmacao': mostrar_modal_confirmacao,
    })


def curso_detail(request, curso_id):
    try:
        curso = Curso.objects.get(pk=curso_id)
        data = {
            'nome': curso.nome,
            'desc': curso.desc,
            'carga_horaria': curso.carga_horaria,
            'valor': curso.valor,  # Valor padrão se None
            'requisitos': curso.requisitos.split(';'),  # Converte a string em listas
            'programacao': curso.programacao.split(';')  # Converte a string em array
        }
        return JsonResponse(data)
    except Curso.DoesNotExist:
        return JsonResponse({'error': 'Curso não encontrado'}, status=404)


def sobre_nos(request):
    return render(request, 'paginas/sobrenos.html')


@csrf_exempt
def enviar_feedback(request):
    if request.method == 'POST':
        print("Dados recebidos:", request.POST)  # Verifica se os dados estão chegando
        form = FeedbackForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'mensagem': 'Feedback enviado com sucesso!'})
        else:
            print("Erros no formulário:", form.errors)  # Mostra erros se o formulário não for válido
            return JsonResponse({'mensagem': 'Erro ao enviar feedback: ' + str(form.errors)}, status=400)
    return JsonResponse({'mensagem': 'Método não permitido.'}, status=405)


def registro(request):
    if request.method == 'POST':
        form = CursoForm(request.POST)  # Instancia o formulário com os dados enviados
        # Verifica se o formulário é válido
        if form.is_valid():
            form.save()  # Salva os dados do curso no banco de dados
            messages.success(request, 'Curso registrado com sucesso!')  # Exibe mensagem de sucesso
            form = CursoForm()  # Reseta o formulário após o salvamento
            # Renderiza a página com o formulário limpo e um indicador de que o curso foi inserido
            return render(request, 'paginas/registro.html', {
                'form': form,
                'mostrar_modal': False,
                'curso_inserido': True  # Indica que o curso foi inserido com sucesso
            })

        else:
            # Exibe mensagem de erro caso o formulário seja inválido
            messages.error(request, 'Por favor, corrija os erros abaixo.')
    else:
        # Se não for uma requisição POST (por exemplo, uma requisição GET), exibe um formulário vazio
        form = CursoForm()

    # Renderiza a página com o formulário (sem o modal de login) e o indicador de que nenhum curso foi inserido
    return render(request, 'paginas/registro.html', {
        'form': form,
        'mostrar_modal': False,
        'curso_inserido': False  # Indica que ainda não foi inserido um curso
    })


def trilha_auto(request):
    return render(request, 'paginas/trilha_auto.html')


def trilha_eletro(request):
    return render(request, 'paginas/trilha_eletro.html')


def trilha_metal(request):
    return render(request, 'paginas/trilha_metal.html')


def trilha_ti(request):
    return render(request, 'paginas/trilha_ti.html')


def mapa(request):
    return render(request, 'paginas/mapa_senai.html')


def cursos_edicao(request):
    cursos = Curso.objects.all()

    # Filtragem por parâmetros GET
    search_query = request.GET.get('search')
    area = request.GET.get('area')
    nivel = request.GET.get('nivel')
    modalidade = request.GET.get('modalidade')
    gratuitos = request.GET.get('gratuitos')

    # Filtro de pesquisa (busca por nome, área ou modalidade)
    if search_query:
        cursos = cursos.filter(
            Q(nome__icontains=search_query) |
            Q(area__icontains=search_query) |
            Q(modalidade__icontains=search_query)
        )

    # Filtro para cursos com área, nível ou modalidade específicas
    if area:
        cursos = cursos.filter(area=area)
    if nivel:
        cursos = cursos.filter(nivel=nivel)
    if modalidade:
        cursos = cursos.filter(modalidade=modalidade)

    if gratuitos == '1':  # Verifica se o checkbox está marcado
        cursos = cursos.filter(gratis=False)  # Filtra cursos que são gratuitos

    # Paginação
    paginator = Paginator(cursos, 10)  # 10 cursos por página
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'paginas/cursos_edicao.html', {
        'page_obj': page_obj,
    })


def deletar_curso(request, curso_id):
    if request.method == "POST":
        curso = get_object_or_404(Curso, id=curso_id)
        nome_curso = curso.nome
        curso.delete()

        return JsonResponse({"success": True, "nome": nome_curso})
    return JsonResponse({"success": False}, status=400)


def insercoes(request):
    # Verifica se o usuário está autenticado
    if request.user.is_authenticated:
        # Renderiza a página com o formulário (sem o modal de login) e o indicador de que nenhum curso foi inserido
        return render(request, 'paginas/insercoes.html', {
            'mostrar_modal': False,
        })
    else:
        # Se o usuário não estiver autenticado, exibe o modal de login
        if request.method == 'POST':
            # Coleta o nome de usuário e senha do formulário de login
            username = request.POST.get('username')
            password = request.POST.get('password')
            # Autentica o usuário com base nas credenciais fornecidas
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # Se a autenticação for bem-sucedida, faz o login do usuário
                login(request, user)
                return redirect('insercoes')  # Redireciona para a página de registro após o login
            else:
                # Se o login falhar, exibe uma mensagem de erro
                messages.error(request, 'Login ou senha incorretos.')

        # Renderiza a página com o modal de login e o indicador de que nenhum curso foi inserido
        response = render(request, 'paginas/insercoes.html', {
            'mostrar_modal': True,  # Exibe o modal de login
        })

    # Limpa as mensagens após renderizar a página
    storage = messages.get_messages(request)
    list(storage)  # Converte o storage em uma lista para esvaziá-lo

    return response


def editar_curso(request, id):
    curso = get_object_or_404(Curso, id=id)
    if request.method == 'POST':
        form = CursoForm(request.POST, instance=curso)
        if form.is_valid():
            form.save()
            return render(request, 'paginas/editar_curso.html', {'curso_editado': True})
    else:
        form = CursoForm(instance=curso)
    return render(request, 'paginas/editar_curso.html', {'form': form, 'curso': curso})
