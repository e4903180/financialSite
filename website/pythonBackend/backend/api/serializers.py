from rest_framework import serializers 
from api.serializers import CPI

class Serializer(serializers.ModelSerializer):

    class Cpi:
        model = CPI
        fields = ("ID", "date", "CPI")
