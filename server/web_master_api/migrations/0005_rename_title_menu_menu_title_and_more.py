# Generated by Django 5.0.6 on 2024-06-20 16:43

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('web_master_api', '0004_menu_menuitem_menu_id'),
    ]

    operations = [
        migrations.RenameField(
            model_name='menu',
            old_name='title',
            new_name='menu_title',
        ),
        migrations.RenameField(
            model_name='menuitem',
            old_name='menu_icons',
            new_name='menu_icon',
        ),
    ]
