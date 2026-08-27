from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver

from .models import News, Photo, Leader


def _delete_file_field(field_file):
    """Actually delete the file from Cloudinary (not just the DB reference)."""
    if field_file and field_file.name:
        try:
            field_file.delete(save=False)
        except Exception as exc:
            print(f"Cloudinary delete failed for {field_file.name}: {exc}")


def _delete_old_file_on_change(sender, instance, field_name):
    """When an existing row's image/pdf is being replaced, delete the
    OLD Cloudinary file first so it doesn't become an orphan."""
    if not instance.pk:
        return  # new row being created, nothing to replace yet

    try:
        old_instance = sender.objects.get(pk=instance.pk)
    except sender.DoesNotExist:
        return

    old_file = getattr(old_instance, field_name)
    new_file = getattr(instance, field_name)
    new_name = new_file.name if new_file else None

    if old_file and old_file.name != new_name:
        _delete_file_field(old_file)


# ---- Row deleted from admin console -> delete its Cloudinary file(s) ----

@receiver(post_delete, sender=News)
def news_delete_files(sender, instance, **kwargs):
    _delete_file_field(instance.image)
    _delete_file_field(instance.pdf)


@receiver(post_delete, sender=Photo)
def photo_delete_file(sender, instance, **kwargs):
    _delete_file_field(instance.image)


@receiver(post_delete, sender=Leader)
def leader_delete_file(sender, instance, **kwargs):
    _delete_file_field(instance.image)


# ---- Row edited with a new image/pdf -> delete the OLD Cloudinary file ----

@receiver(pre_save, sender=News)
def news_delete_old_files(sender, instance, **kwargs):
    _delete_old_file_on_change(sender, instance, "image")
    _delete_old_file_on_change(sender, instance, "pdf")


@receiver(pre_save, sender=Photo)
def photo_delete_old_file(sender, instance, **kwargs):
    _delete_old_file_on_change(sender, instance, "image")


@receiver(pre_save, sender=Leader)
def leader_delete_old_file(sender, instance, **kwargs):
    _delete_old_file_on_change(sender, instance, "image")
