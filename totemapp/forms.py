# forms.py
from django import forms
from .models import Feedback, Curso, Interesse
import re
from django.core.exceptions import ValidationError
from django.core.mail import EmailMessage
from datetime import datetime


class InteresseForm(forms.ModelForm):
    class Meta:
        model = Interesse
        fields = ['nome', 'data_nascimento', 'cpf', 'email', 'telefone']

    # Personalizando o widget de data_nascimento
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['data_nascimento'].widget = forms.DateInput(attrs={
            'type': 'text',  # Mantendo como texto para uso do flatpickr
            'placeholder': 'dd/mm/aaaa'  # Placeholder para o formato
        })

    # Regex para cada campo do formulário
    def clean_nome(self):
        nome = self.cleaned_data['nome']
        if re.search(r'\d', nome):
            raise forms.ValidationError("O nome não pode conter números.")
        return nome

    def clean_cpf(self):
        cpf = self.cleaned_data['cpf']
        if not re.match(r'^\d{3}\.\d{3}\.\d{3}-\d{2}$', cpf):
            raise forms.ValidationError("CPF inválido.")
        return cpf

    def clean_telefone(self):
        telefone = self.cleaned_data['telefone']
        if not re.match(r'^\(\d{2}\) \d{5}-\d{4}$', telefone):
            raise forms.ValidationError("Telefone inválido.")
        return telefone


class FeedbackForm(forms.ModelForm):
    class Meta:
        model = Feedback
        fields = ['emoji', 'comentario']  # Certifique-se de que esses campos correspondem aos definidos no seu modelo


class CursoForm(forms.ModelForm):
    MODALIDADE_CHOICES = [
        ('Presencial', 'Presencial'),
        ('A Distância', 'A Distância'),
    ]

    NIVEL_CHOICES = [
        ('Cursos Técnicos', 'Cursos Técnicos'),
        ('Cursos Livres', 'Cursos Livres'),
        ('Aprendiz SENAI', 'Aprendiz SENAI'),
        ('Graduação', "Graduação"),
        ('Pós-graduação', 'Pós-graduação'),
        ('Superior Extensão', 'Superior Extensão'),
    ]

    AREA_CHOICES = [
        ('Administração e Gestão', 'Administração e Gestão'),
        ('Alimentos e Bebidas', 'Alimentos e Bebidas'),
        ('Tecnologia da Informação e Informática', 'Tecnologia da Informação e Informática'),
        (
            'Design Gráfico, Papel, Celulose, Gráfica e Editorial',
            'Design Gráfico, Papel, Celulose, Gráfica e Editorial'),
        ('Metalurgia e Soldagem', 'Metalurgia e Soldagem'),
        ('Mecâtronica, Sistemas de Automação, Energia e Eletrônica', 'Mecâtronica, Sistemas de Automação, Energia e Eletrônica'),
        ('Meio Ambiente, Saúde e Segurança do Trabalho', 'Meio Ambiente, Saúde e Segurança do Trabalho'),
        ('Automotiva', 'Automotiva'),
        ('Logística e Transporte', 'Logística e Transporte'),
        ('Fabricação Mecânica e Mecânica Industrial', 'Fabricação Mecânica e Mecânica Industrial'),
        ('Design de Moda, Têxtil, Vestuário, Calçados e Joalheria', 'Design de Moda, Têxtil, Vestuário, Calçados e Joalheria'),
        ('Construção Civil e Design de Mobiliário', 'Construção Civil e Design de Mobiliário'),
        ('Química, Cerâmica e Plásticos', 'Química, Cerâmica e Plásticos'),
        ('Refrigeração e Climatização', 'Refrigeração e Climatização'),
    ]

    modalidade = forms.ChoiceField(
        choices=[('', 'Selecione a Modalidade do curso')] + MODALIDADE_CHOICES,
        label="Modalidade"
    )
    nivel = forms.ChoiceField(
        choices=[('', 'Selecione o Nível do curso')] + NIVEL_CHOICES,
        label="Nível",
    )
    area = forms.ChoiceField(
        choices=[('', 'Selecione a Área do curso')] + AREA_CHOICES,
        label="Área",
        initial=None  # Sem valor padrão
    )

    # O usuário pode inserir qualquer valor de texto.
    desc = forms.CharField(
        widget=forms.Textarea(attrs={
            'placeholder': 'Digite a descrição do curso',
            'class': 'text-area'
        }),
        label="Descrição"
    )

    requisitos = forms.CharField(
        widget=forms.Textarea(attrs={
            'placeholder': 'Digite os requisitos separados por ponto e vírgula (;)',
            'class': 'text-area'
        }),
        label="Requisitos"
    )

    programacao = forms.CharField(
        widget=forms.Textarea(attrs={
            'placeholder': 'Digite a programação separada por ponto e vírgula (;)',
            'class': 'text-area'
        }),
        label="Programação"
    )

    gratis = forms.ChoiceField(
        choices=[(False, 'Não'), (True, 'Sim')],
        label="Gratuito?",
        widget=forms.Select(attrs={'id': 'gratis-select'}),
        initial=True  # Define "Sim" como padrão
    )
    valor = forms.CharField(
        required=False,
        label="Valor do curso",
        widget=forms.TextInput(attrs={'id': 'valor-mascara', 'placeholder': 'Digite o valor'})
    )

    class Meta:
        model = Curso
        fields = ['nome', 'programacao', 'carga_horaria', 'requisitos', 'modalidade', 'nivel', 'area', 'desc', 'gratis',
                  'valor']
