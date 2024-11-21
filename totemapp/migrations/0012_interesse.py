# Generated by Django 5.0.7 on 2024-10-24 18:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('totemapp', '0011_delete_interesse'),
    ]

    operations = [
        migrations.CreateModel(
            name='Interesse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=250)),
                ('data_nascimento', models.DateField()),
                ('cpf', models.IntegerField()),
                ('email', models.EmailField(max_length=254)),
                ('telefone', models.IntegerField()),
            ],
        ),
    ]
