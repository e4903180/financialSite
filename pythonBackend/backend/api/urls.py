from django.urls import re_path 
from api import views 
 
urlpatterns = [ 
    re_path(r'^api/PricingStrategy$', views.pricing_strategy),
    re_path(r'^api/PER_River$', views.per_river_strategy),
    re_path(r'^api/SupportResistanceStrategy$', views.support_resistance_strategy),
    re_path(r'^api/inflation$', views.inflation),
    re_path(r'^api/analysis_download$', views.analysis_download),
    re_path(r'^api/analysis_html_download$', views.analysis_html_download),
    re_path(r'^api/top_ticker$', views.top_ticker),
    re_path(r'^api/twse_financial_data$', views.twse_financial_data),
    # re_path(r'^api/cpi_ppi_pce$', views.cpi_ppi_pce),
]