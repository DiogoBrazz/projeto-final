# projeto-final

<<<----------SERVIÇOS---------->>>

-> Visualizar todos os serviços
# kubectl get pods -A -w

<<<----------MONITORAMENTO---------->>>

-> Visualizar todos os serviços de monitoramento:
# kubectl get svc -n monitoring

<<<----------GRAFANA---------->>>

-> Pegar o EXTERNAL-IP:
# kubectl get service prometheus-stack-grafana -n monitoring -w 

