from django.db import migrations, models


def rebuild_mptt_tree(apps, schema_editor):
    # Import Note model via apps to ensure historical correctness
    Note = apps.get_model('api', 'Note')
    try:
        # If django-mptt is available, use its rebuild utilities
        from mptt.utils import rebuild
    except Exception:
        rebuild = None

    if rebuild is not None:
        # Rebuild the whole tree for Note (single model tree)
        rebuild(Note)
    else:
        # Fallback: initialize all MPTT fields for rows without parents as separate trees
        # This won't compute nested ordering, but prevents NULLs to satisfy constraints.
        # Subsequent app runtime can re-save to correct, or you can run manage.py rebuild_mptt.
        for idx, note in enumerate(Note.objects.all().order_by('id'), start=1):
            # Basic defaults to avoid NULLs
            if getattr(note, 'tree_id', None) in (None, 0):
                note.tree_id = idx
            if getattr(note, 'lft', None) in (None, 0):
                note.lft = 1
            if getattr(note, 'rght', None) in (None, 0):
                note.rght = 2
            if getattr(note, 'level', None) in (None, 0):
                note.level = 0
            note.save(update_fields=['tree_id', 'lft', 'rght', 'level'])


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_note_important_alter_visitorpresence_id'),
    ]

    operations = [
        # 1) Add parent and MPTT fields as nullable to satisfy existing rows
        migrations.AddField(
            model_name='note',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=models.deletion.CASCADE, related_name='children', to='api.note'),
        ),
        migrations.AddField(
            model_name='note',
            name='lft',
            field=models.PositiveIntegerField(null=True, blank=True, db_index=True),
        ),
        migrations.AddField(
            model_name='note',
            name='rght',
            field=models.PositiveIntegerField(null=True, blank=True, db_index=True),
        ),
        migrations.AddField(
            model_name='note',
            name='tree_id',
            field=models.PositiveIntegerField(null=True, blank=True, db_index=True),
        ),
        migrations.AddField(
            model_name='note',
            name='level',
            field=models.PositiveIntegerField(null=True, blank=True, db_index=True),
        ),

        # 2) Data migration to compute MPTT structure
        migrations.RunPython(rebuild_mptt_tree, migrations.RunPython.noop),

        # 3) Make MPTT fields non-nullable after they are populated
        migrations.AlterField(
            model_name='note',
            name='lft',
            field=models.PositiveIntegerField(db_index=True),
        ),
        migrations.AlterField(
            model_name='note',
            name='rght',
            field=models.PositiveIntegerField(db_index=True),
        ),
        migrations.AlterField(
            model_name='note',
            name='tree_id',
            field=models.PositiveIntegerField(db_index=True),
        ),
        migrations.AlterField(
            model_name='note',
            name='level',
            field=models.PositiveIntegerField(db_index=True),
        ),
    ]


