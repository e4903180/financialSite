from django.urls import re_path 
from api import views 
 
urlpatterns = [ 
    re_path(r'^api/PricingStrategy$', views.pricing_strategy),
    re_path(r'^api/PER_River$', views.per_river_strategy),
    re_path(r'^api/SupportResistanceStrategy$', views.support_resistance_strategy),
    re_path(r'^api/inflation$', views.inflation),
    re_path(r'^api/cpi_ppi_pce$', views.cpi_ppi_pce),
]