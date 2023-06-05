from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from api.models import Telemetria
from api.serializers import TelemetriaSerializer

@csrf_exempt
def telemetrias(request):
  if request.method ==  'POST':
    data = JSONParser().parse(request)
    serializer = TelemetriaSerializer(data=data)
    if serializer.is_valid():
      serializer.save()
      return JsonResponse(serializer.data, status=201)
    
    return JsonResponse(serializer.errors, status=400)
  
