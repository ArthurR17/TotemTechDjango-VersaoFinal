from django.urls import path
from .views import (tela_inicial, menu_opcoes, cursos, sobre_nos, registro, trilha_ti, trilha_auto, trilha_metal,
                    trilha_eletro, mapa, curso_detail, enviar_feedback, cursos_edicao, deletar_curso, insercoes,
                    editar_curso)


urlpatterns = [
    path('', tela_inicial, name='tela_inicial'),
    path('menu_opcoes/', menu_opcoes, name='menu_opcoes'),
    path('cursos/', cursos, name='cursos'),
    path('curso/<int:curso_id>/', curso_detail, name='curso_detail'),
    path('sobre_nos/', sobre_nos, name='sobre_nos'),
    path('registro/', registro, name='registro'),
    path('trilha_auto/', trilha_auto, name='trilha_auto'),
    path('trilha_eletro/', trilha_eletro, name='trilha_eletro'),
    path('trilha_metal/', trilha_metal, name='trilha_metal'),
    path('trilha_ti/', trilha_ti, name='trilha_ti'),
    path('mapa_senai/', mapa, name='mapa_senai'),
    path('enviar_feedback/', enviar_feedback, name='enviar_feedback'),
    path('cursos_edicao/', cursos_edicao, name='cursos_edicao'),
    path("deletar-curso/<int:curso_id>/", deletar_curso, name="deletar_curso"),
    path('insercoes/', insercoes, name='insercoes'),
    path('curso/editar/<int:id>/', editar_curso, name='editar_curso'),

]