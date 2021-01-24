from rest_framework import serializers
from .models import User


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
<<<<<<< HEAD
        fields = ("id", "uid", "email", "first_name", "last_name", "date_of_birth",
                  "phone_number", "post_code", "address_line_1", "address_line_2", "city", "county", "is_volunteer",
                  "dbs")
=======

        fields = ("id", "email", "first_name", "last_name", "date_of_birth",
                  "phone_number", "post_code", "address_line_1", "address_line_2",
                  "city", "county", "is_volunteer", "dbs")
>>>>>>> 60be7c465b57bc64602ac710f041d544a7f6fad5
        depth = 1
