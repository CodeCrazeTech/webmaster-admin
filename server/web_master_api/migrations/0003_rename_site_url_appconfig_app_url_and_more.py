# Generated by Django 5.0.6 on 2024-06-19 15:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('web_master_api', '0002_alter_appconfig_app_logo'),
    ]

    operations = [
        migrations.RenameField(
            model_name='appconfig',
            old_name='site_url',
            new_name='app_url',
        ),
        migrations.AlterField(
            model_name='appconfig',
            name='menu_item',
            field=models.CharField(max_length=100),
        ),
    ]