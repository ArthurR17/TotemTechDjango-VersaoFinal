# Generated by Django 5.1.1 on 2024-10-08 19:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('totemapp', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='curso',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]