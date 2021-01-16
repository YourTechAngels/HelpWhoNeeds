from rest_framework import serializers
from .models import User


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("uid", "email", "first_name", "last_name", "date_of_birth",
                  "phone_number", "post_code", "address_line_1", "address_line_2", "city", "county", "DBS_required",
                  "user_type")
        depth = 1