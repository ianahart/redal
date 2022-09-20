from rest_framework import serializers
import re
from account.models import CustomUser


class LogoutSerializer(serializers.ModelSerializer):
    refresh_token = serializers.CharField()
    id = serializers.IntegerField()

    class Meta:
        model = CustomUser
        fields = ('id', 'refresh_token', )



class LoginSerializer(serializers.Serializer):
    password = serializers.CharField()
    email = serializers.CharField()
    class Meta:
        model = CustomUser
        fields = ('email', 'password')

    def validate_email(self, email: str):
        if len(email) == 0:
            raise serializers.ValidationError('Email cannot be empty.')
        return email

    def validate_password(self, password: str):
        if len(password) == 0:
            raise serializers.ValidationError('Password cannot be empty.')
        return password



class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField()
    class Meta:
        model = CustomUser
        fields = ('password','first_name', 'last_name',
                  'email', 'confirm_password')

    def validate_first_name(self, first_name: str):
        if len(first_name) == 0:
            raise serializers.ValidationError('First name cannot be empty.')
        return first_name.capitalize()

    def validate_last_name(self, last_name: str):
        if len(last_name) == 0:
            raise serializers.ValidationError('Last name cannot be empty.')
        return last_name.capitalize()


    def validate_password(self, password: str):
       data = self.get_initial()
       if data['password'] != data['confirm_password']:
           raise serializers.ValidationError('Passwords do not match.')

       lowercase, uppercase, digit, special_char = False, False, False, False

       for char in password:
           if char.lower() == char:
               lowercase = True
           if char.upper() == char:
               uppercase = True
           if char.isdigit():
               digit = True

       regex = re.compile('[@_!#$%^&*()<>?/\|}{~:]')

       if regex.search(password) != None:
            special_char= True

       rules = [lowercase, uppercase, digit, special_char]

       if not all(rule for rule in rules):
            raise serializers.ValidationError('Please include 1 special char, 1 lower, 1 upper, and 1 digit in your password.')
       return password

