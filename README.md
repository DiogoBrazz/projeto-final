# projeto-final aaa

<<<----------SERVIÇOS---------->>>

-> Visualizar todos os serviços
# kubectl get pods -A -w

<<<----------MONITORAMENTO---------->>>

-> Visualizar todos os serviços de monitoramento:
# kubectl get svc -n monitoring

<<<----------GRAFANA---------->>>

-> Pegar o EXTERNAL-IP:
# kubectl get service prometheus-stack-grafana -n monitoring -w 

<<<----------GERAL---------->>>

CI/CD Pipeline para Ambiente de Stage (GKE, Prometheus, Grafana)
Este repositório contém a configuração de uma pipeline de CI/CD completa para implantar uma aplicação Backend e Frontend em um cluster Kubernetes (GKE) no Google Cloud Platform. A pipeline inclui o provisionamento de infraestrutura com Terraform e a configuração de monitoramento com Prometheus e Grafana, incluindo dashboards automáticos.

🚀 Visão Geral da Pipeline
Esse projeto automatiza o provisionamento da infraestrutura e aplicação utilizando:

 -Provisionamento de Infraestrutura (Terraform): Cria ou atualiza o cluster GKE e o bucket de estado do Terraform.
 -Monitoramento (Prometheus + Grafana): Implanta o stack de monitoramento (Prometheus e Grafana) no cluster GKE, configurando automaticamente dashboards essenciais.
 -Testes de Backend: Executa os testes unitários e de integração do serviço de backend.
 -Build e Push de Imagens Docker: Constrói as imagens Docker do Backend e Frontend e as envia para o Artifact Registry do GCP.
 -Deploy da Aplicação: Implanta as aplicações Backend e Frontend no cluster GKE.

📂 Estrutura do Repositório

.
├── .github/
│   └── workflows/
│       └── stage-pipeline.yml          
├── terraform/
│   └── stage/
│       ├── main.tf                      
│       ├── variables.tf           
│       └── outputs.tf                 
├── backend/                           
│   ├── src/
│   │   └── ...
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   ├── server.test.js
│   └── Dockerfile
├── frontend/                         
│   ├── src/
│   │   └── ...
│   ├── app.js
│   ├── index.html
│   ├── nginx.conf
│   └── Dockerfile
├── arquivos/                           
│   ├── namespaces.yaml                
│   ├── backend-config/
│   │   ├── backend-deployment.yaml      
│   │   └── backend-service.yaml         
│   ├── database/                       
│   │   ├── mysql-pvc.yaml
│   │   ├── mysql-service.yaml
│   │   └── mysql-statefulset.yaml
│   ├── frontend-config/
│   │   ├── frontend-deployment.yaml     
│   │   └── frontend-service.yaml        
│   └── monitoring/                      
│       └── helm-dashboard-values.yaml  

⚙️ Pré-requisitos

Conta o Google Cloud 
 -conta de serviço
 -permissões de conta de serviço
Artiact Registry
 -Imagens Docker
Docker e Docker Compose
Secrets do GitHub Actions

CI/CD GiHub Actions

Esse projeto possui dois fluxos de automação

 -prod-pipeline.yml
 -stage-pipeline.yml

A stage é executada quando é feio um push
A Prod é executada manualmente


🚀 Detalhes dos Jobs da Pipeline
1. terraform - Provisionamento de Infraestrutura
Responsabilidade: Gerencia a infraestrutura como código (IaC) usando Terraform, criando ou atualizando o cluster GKE.
Ações:
Faz o checkout do código.
Autentica no Google Cloud usando GCP_SA_KEY_STAGE.
Configura o Terraform.
Verifica e cria (se necessário) o bucket GCS para o estado do Terraform.
Executa terraform init para conectar ao backend de estado.
Executa terraform apply -auto-approve para aplicar as mudanças de infraestrutura definidas em ./terraform/stage.
2. deploy-monitoring - Implantação de Monitoramento
Responsabilidade: Configura o Prometheus e o Grafana no cluster GKE, incluindo dashboards pré-definidos.
Dependência: terraform (garante que o cluster GKE esteja pronto).
Ações:
Faz o checkout do código.
Autentica no Google Cloud e conecta ao cluster GKE.
Instala o Helm.
Adiciona o repositório Helm da comunidade Prometheus.
Executa helm upgrade --install prometheus-stack ... usando o arquivo ./monitoring/helm-dashboard-values.yaml. Este comando:
Instala/atualiza o kube-prometheus-stack no namespace monitoring.
Espera (--wait) que todos os componentes estejam prontos.
Tem um tempo limite (--timeout 15m) para evitar falhas por demora no provisionamento de recursos de rede (ex: Load Balancer).
Configura o Grafana com a senha do admin e provisiona o dashboard através do values.yaml.
3. test - Testes de Backend
Responsabilidade: Garante a qualidade do código do backend antes da construção da imagem Docker.
Dependência: terraform (o cluster não precisa estar com a aplicação, apenas a infraestrutura base).
Ações:
Faz o checkout do código.
Configura o Node.js.
Instala as dependências (npm install) e executa os testes (npm test) no diretório ./backend.
4. build-and-push - Build e Push de Imagens Docker
Responsabilidade: Constrói as imagens Docker do Backend e Frontend e as envia para o Artifact Registry do GCP.
Dependência: test (só executa se os testes passarem).
Ações:
Faz o checkout do código.
Autentica no Google Cloud e configura o Docker para o Artifact Registry.
Constrói a imagem do Backend com a tag github.sha e a envia.
Constrói a imagem do Frontend com a tag github.sha e a envia.
5. deploy - Implantação da Aplicação
Responsabilidade: Implanta as imagens Docker da aplicação (Backend e Frontend) no cluster GKE.
Dependências: build-and-push (garante que as imagens estejam prontas) e deploy-monitoring (garante que o monitoramento esteja no ar para receber métricas da aplicação).
Ações:
Faz o checkout do código.
Configura o CLI gcloud e o kubectl e autentica no Google Cloud.
Conecta ao cluster GKE.
Substitui os placeholders das imagens nos arquivos de deployment do Kubernetes (backend-deployment.yaml, frontend-deployment.yaml) pela tag github.sha das imagens recém-construídas.
Aplica os manifestos do Kubernetes (.yaml) do diretório ./arquivos/ ao cluster, criando namespaces, deployments, services e o banco de dados.

🛠️ Como Monitorar

Encontre o IP-externo do Grafana nos logs do job deploy-monitoring 
kubectl get svc prometheus-stack-grafana -n monitoring
navegue até http://<IP-externo>
Faça o Lgin com usuário e senha