# models.py
from django.db import models


class Interesse(models.Model):
    curso_nome = models.CharField(max_length=250)
    nome = models.CharField(max_length=250)
    data_nascimento = models.DateField()
    cpf = models.CharField(max_length=14)  # 000.000.000-00 tem 14 caracteres
    email = models.EmailField()
    telefone = models.CharField(max_length=15)  # (00) 00000-0000 tem 15 caracteres


class Feedback(models.Model):
    emoji = models.CharField(max_length=20)
    comentario = models.TextField()  # O campo de texto para o comentário

    def __str__(self):
        return f"{self.emoji}: {self.comentario}"


class Curso(models.Model):
    nome = models.CharField(max_length=255)
    carga_horaria = models.IntegerField()
    programacao = models.TextField(default="")
    requisitos = models.TextField()
    modalidade = models.CharField(max_length=100)
    nivel = models.CharField(max_length=100)
    area = models.CharField(max_length=100)
    desc = models.CharField(max_length=1000)
    gratis = models.BooleanField(default=True, verbose_name="Gratuito?")
    valor = models.IntegerField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Define valor como 0 se o curso for gratuito
        if self.gratis:
            self.valor = 0
        super().save(*args, **kwargs)

    def descricao_resumida(self):
        if len(self.desc) > 10:
            return self.desc[:10] + "..."
        else:
            return self.desc

    def __str__(self):
        return self.nome
