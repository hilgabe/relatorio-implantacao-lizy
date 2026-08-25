# 09 — Avaliação preliminar de API, MCP e automações

## Conclusão executiva

Não foi localizada, nas páginas públicas oficiais consultadas, documentação de uma API pública ou de webhooks do ERP Lizy. Isso **não prova que a API não exista**; significa apenas que a existência, o contrato e o acesso ainda precisam ser confirmados com o suporte/fornecedor.

O site oficial afirma que a plataforma integra áreas do ERP e que o produto Lizy DataFlow conecta ERPs, CRMs, planilhas, APIs, bancos de dados e IoT. Essa comunicação confirma capacidade institucional de integração, mas não confirma endpoints utilizáveis pela Elétrica Visão nem uma API do ERP. `[W01][W03]`

## Matriz de evidência

| Tema | Situação | Classificação |
|---|---|---|
| API pública do ERP | Nenhuma documentação pública oficial localizada | Pendente |
| Webhooks do ERP | Nenhuma documentação pública oficial localizada | Pendente |
| Importação/exportação | Entradas por nota e anexos foram demonstradas; exportações estruturadas não foram analisadas | Parcial/Pendente |
| Integrações nativas | Recebimento automático foi mencionado sem tecnologia; CRM/WhatsApp/Google aparecem no site institucional | Confirmado apenas em nível institucional |
| DataFlow | Página oficial cita APIs, bancos, ETL, governança e dashboards | Confirmado para o produto DataFlow, não para acesso direto ao ERP |
| Automação de navegador | Tecnicamente possível em páginas autenticadas | Possibilidade técnica; não recomendada sem contrato e autorização |
| MCP | Tecnicamente possível como camada sobre API/serviço autorizado | Possibilidade técnica; inexistente nesta etapa |

## Ordem de preferência técnica

1. **API oficial e documentada**, com ambiente de teste, escopos mínimos, auditoria e suporte.
2. **Exportações/importações suportadas** ou integração disponibilizada pela equipe Lizy.
3. **DataFlow ou conector oficial**, se o caso for leitura, consolidação e indicadores.
4. **Automação de navegador (RPA)** apenas para lacunas sem interface suportada, com conta restrita e forte monitoramento.

## Como um MCP poderia ser usado futuramente

Um servidor MCP não deve acessar o banco ou “descobrir” endpoints privados. Ele serviria como uma camada controlada sobre capacidades autorizadas, por exemplo:

- consultar OS por número/status;
- obter laudo e documentos permitidos;
- listar pendências de peritagem, compras ou PCP;
- gerar relatórios de auditoria;
- preparar uma ação e exigir confirmação humana antes de gravar;
- registrar origem, usuário, parâmetros, resultado e correlação da operação.

Antes de qualquer protótipo, são necessários API/contrato, sandbox, credenciais técnicas próprias, escopos, política de dados, limites e autorização expressa.

## Possibilidades de automação por navegador

- **Leitura assistida:** coletar status/telas e montar relatórios — risco menor, ainda sujeito a sessão e mudanças de interface.
- **Preenchimento assistido:** preparar campos sem enviar — risco médio; exige validação humana.
- **Gravação automática:** aprovar, baixar estoque, finalizar PCP, emitir ou enviar — risco alto e não autorizada.

Riscos principais: seletores frágeis, sessão expirada, mudança de layout, duplicidade por repetição, ausência de idempotência, credenciais compartilhadas e dificuldade de reversão.

## Casos candidatos, após homologação

- Validação de campos obrigatórios antes de salvar.
- Conferência entre ficha, laudo e orçamento.
- Alertas de OS paradas por etapa/SLA.
- Detecção de material pendente e prazo de compra.
- Relatório diário de PCP e exceções.
- Reconciliação entre pedido, entrada, estoque e contas a pagar.
- Geração de pacote de auditoria por OS.
- Consulta orientada por linguagem natural via MCP, inicialmente somente leitura.

## Perguntas ao suporte Lizy

1. Existe portal de desenvolvedores ou OpenAPI/Swagger?
2. Há ambiente sandbox e credenciais de serviço?
3. Quais objetos e operações são suportados?
4. Existem webhooks e garantias de entrega/repetição?
5. Como funcionam paginação, rate limit, idempotência e versionamento?
6. Há exportação completa e incremental com histórico?
7. O contrato permite RPA e integração de terceiros?
8. Quem é responsável por suporte e mudanças de versão?
9. O DataFlow pode fornecer leitura governada dos dados da Elétrica Visão?
10. Quais operações só podem ser feitas pela equipe Lizy?

## Fronteira de segurança desta etapa

Nenhum endpoint foi inspecionado, nenhuma credencial foi lida, nenhuma requisição interna foi reproduzida e nenhuma integração foi criada.
