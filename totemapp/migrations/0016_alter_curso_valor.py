# Generated by Django 5.0.7 on 2024-10-31 11:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('totemapp', '0015_alter_curso_valor'),
    ]

    operations = [
        migrations.AlterField(
            model_name='curso',
            name='valor',
            field=models.IntegerField(null=True),
        ),
    ]
