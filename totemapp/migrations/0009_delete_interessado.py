# Generated by Django 5.0.7 on 2024-10-17 14:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('totemapp', '0008_alter_interessado_cpf_alter_interessado_nome_and_more'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Interessado',
        ),
    ]