from django.http.response import JsonResponse, HttpResponse
from rest_framework import status
 
from rest_framework.decorators import api_view
from .PythonTool.StockPriceDecision import PricingStrategy
from .PythonTool.PER_River import PerRiver
from .PythonTool.SupportResistance.SupportResistance import SupportResistance
from .PythonTool.FRED.Inflation import Inflation
from .PythonTool.FRED.CPI_PPI_PCE import CpiPpiPce
from .PythonTool.TopTicker.TopTicker import TopTicker
from .PythonTool.TwseFinancialData.TwseFinancialData import TwseFinancialData
from .DataBaseManager import DataBaseManager
import json

root_path = json.load(open("../../../root_path.json"))

DB = DataBaseManager()

@api_view(['GET'])
def analysis_download(request):
    if request.method == "GET":
        filename = request.query_params.get("filename")
        
        try:
            FilePointer = open(root_path['ALTERSERVICE_PDF_PATH'] + "/" + filename, "rb")
            response = HttpResponse(FilePointer, content_type = 'application/pdf')
            response['Content-Disposition'] = f'attachment; filename={filename}'

            return response
        except Exception as e:
            print(e)
            return JsonResponse({"message" :"File not existed"}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def analysis_html_download(request):
    if request.method == "GET":
        filename = request.query_params.get("filename")

        try:
            FilePointer = open(root_path['ALTERSERVICE_HTML_PATH'] + "/" + filename, "rb")
            response = HttpResponse(FilePointer, content_type = 'text/html')
            response['Content-Disposition'] = f'attachment; filename={filename}'

            return response
        except Exception as e:
            print(e)
            return JsonResponse({"message" :"File not existed"}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def pricing_strategy(request):
    if request.method == "GET":
        try:
            return JsonResponse(PricingStrategy(request.query_params.get("stockNum"), request.query_params.get("year")).run(),
                                status = status.HTTP_200_OK)
        
        except Exception as e:
            print(e)
            return JsonResponse({"message" : str(e)}, status = status.HTTP_400_BAD_REQUEST)
    
    return JsonResponse({"message" : "error"}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def per_river_strategy(request):
    if request.method == "GET":
        try:        
            return JsonResponse(PerRiver().run(request.query_params.get("stockNum"), "MONTH"), status = status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({"message" : str(e)}, status = status.HTTP_400_BAD_REQUEST)
    
    return JsonResponse({"message" : "error"}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def support_resistance_strategy(request):
    if request.method == "GET":
        try:
            SR = SupportResistance(request.query_params.get("stockNum"),
                                   request.query_params.get("startDate"),
                                   request.query_params.get("ma_type"),
                                   int(request.query_params.get("maLen")))
            
            SR.get_data_yfinance()
            
            return JsonResponse(SR.run(request.query_params.get("method")), status = status.HTTP_200_OK)
        except Exception as e:
            print("error: " + str(e))
            return JsonResponse({"message" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

    return JsonResponse({"message" : "error"}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def inflation(request):
    if request.method == "GET":
        try:
            return JsonResponse(Inflation(DB.db, DB.cursor).get_data(), status = status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({"message" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

    return JsonResponse({"message" : "error"}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def cpi_ppi_pce(request):
    if request.method == "GET":
        try:
            return JsonResponse(CpiPpiPce(DB.db, DB.cursor).get_data(), status = status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({"message" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

    return JsonResponse({"message" : "error"}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def top_ticker(request):
    if request.method == "GET":
        try:
            result = TopTicker(DB.db, DB.cursor).run(request.query_params.get("start_date"),
                                                    request.query_params.get("end_date"),
                                                    int(request.query_params.get("top")),
                                                    request.query_params.get("recommend"),
                                                    request.query_params.get("category"),
                                                    request.query_params.get("type"),
                                                    int(request.query_params.get("th")))
            return JsonResponse(result, status = status.HTTP_200_OK, json_dumps_params = {'ensure_ascii': False}, safe = False)

        except Exception as e:
            print(e)
            return JsonResponse({"message" : str(e)}, status = status.HTTP_400_BAD_REQUEST)

    return JsonResponse({"message" : "error"}, status = status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def twse_financial_data(request):
    if request.method == "GET":
        try:
            result = TwseFinancialData(DB.db, DB.cursor).run(request.query_params.get("start_date_twse"),
                                                            request.query_params.get("end_date_twse"),
                                                            request.query_params.get("start_date_research"),
                                                            request.query_params.get("end_date_research"))
            return JsonResponse(result, status = status.HTTP_200_OK, json_dumps_params = {'ensure_ascii': False}, safe = False)

        except Exception as e:
            print(e)
            return JsonResponse({"message" : str(e)}, status = status.HTTP_400_BAD_REQUEST)