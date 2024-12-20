# Generated by Django 5.0.7 on 2024-10-17 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('totemapp', '0006_feedback'),
    ]

    operations = [
        migrations.CreateModel(
            name='Interessado',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=255)),
                ('data_nascimento', models.DateField()),
                ('cpf', models.CharField(max_length=11, unique=True)),
                ('email', models.EmailField(max_length=254)),
                ('telefone', models.CharField(blank=True, max_length=15)),
            ],
        ),
    ]
