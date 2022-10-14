from django.contrib import admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .forms import UserCreationForm, UserChangeForm
from .models import CustomUser


class CustomUserAdmin(BaseUserAdmin):
    list_display = ('email', 'is_staff', 'is_superuser')

    add_form = UserCreationForm
    form = UserChangeForm
    model = CustomUser
    readonly_fields = ('last_login', 'date_joined', 'id')
    ordering = ('email',)
    search_fields = ('first_name', 'last_name', 'email')
    fieldsets = (
        (
            'Fields',
            {
                'fields': (
                    'email',
                    'about',
                    'display_name',
                    'date_joined',
                    'gender',
                    'country',
                    'avatar_url',
                    'first_name',
                    'last_name',
                    'name',
                    'avatar_file',
                    'last_login',
                    'is_active',
                    'is_staff',
                    'is_superuser',
                    'groups',
                    'user_permissions',
                    'password',
                )
            },
        ),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )


admin.site.register(CustomUser, CustomUserAdmin)

