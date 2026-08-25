# 05 — Comparação inicial: Alterdata × Lizy

## Limite da comparação

O Alterdata não foi aberto nem demonstrado nesta etapa. As observações abaixo sobre o sistema anterior vêm exclusivamente do contexto fornecido pelo usuário `[S01]`. Não há base para comparar telas, campos, relatórios, regras fiscais ou desempenho por módulo.

| Aspecto | Alterdata — declarado pelo usuário | Lizy — evidência disponível | Classificação |
|---|---|---|---|
| Arquitetura de acesso | Instalado em servidor e hospedado em AWS para acesso remoto | Acesso por navegador; dashboard web observado | Confirmado por S01/L01 |
| Experiência | Pesado, com funções não utilizadas, travamentos/lentidão | Percebido até agora como mais simples e intuitivo | Declaração do usuário, não medição |
| Infraestrutura | Dependência e custos de AWS, manutenção e administração | Menor dependência de infraestrutura interna | Provável; custos/contrato não analisados |
| Mobilidade | Maior dificuldade fora da empresa | Uso em navegador e demonstração com tablet/câmera | Confirmado em parte |
| Fluxo de manutenção | Não documentado | Workflow integrado de OS, peritagem, comercial, estoque, compras, PCP e finalização | Confirmado para V01 |
| Laudos | Não informado | Laudo técnico e laudo final gerados pelo fluxo | Confirmado para V01 |
| Integração entre áreas | Não informado | Aprovação alimenta PCP/Suprimentos; entrada alimenta estoque/financeiro | Confirmado/declarado em V01 |
| Ficha de motor | Não informado | Ainda em personalização/priorização no treinamento | Confirmado como pendência |

## Mudanças de trabalho prováveis

- A equipe passa a registrar a OS e evidências no mesmo fluxo que alimenta orçamento, compras e produção.
- Fotos tiradas pelo tablet podem substituir transferência manual de imagens.
- Técnicos passam a iniciar/finalizar atividades e selecionar sua identificação no sistema.
- O Comercial recebe escopo técnico estruturado e controla envio/aprovação dentro do ERP.
- Estoque e Compras trabalham a partir de requisições ligadas à OS.
- PCP usa serviços planejáveis e etapas obrigatórias com avanço automático.

Todas essas mudanças devem ser validadas em homologação com cenários reais antes da virada.

## Riscos específicos da migração

- Cadastros do Alterdata podem não mapear diretamente para clientes, fornecedores, produtos, serviços, setores e fichas do Lizy.
- Saldos, pedidos abertos, contas, documentos fiscais e OS em andamento exigem estratégia de corte.
- Tabelas de serviços/peças desatualizadas contaminam orçamento e planejamento.
- A ficha de motor incompleta impede validar o processo predominante da empresa.
- Usuários podem reproduzir hábitos do Alterdata e ignorar os gatilhos/status do Lizy.
- Falta de equivalência documental pode afetar laudos WEG, histórico de garantia e auditoria.

## Evidências ainda necessárias

- Exportações e telas do Alterdata para cada processo crítico.
- Dicionário de cadastros e campos nos dois sistemas.
- Lista de saldos/pendências na data de corte.
- Modelos atuais de OS, laudo, orçamento, requisição, pedido e documentos fiscais.
- Regras fiscais/contábeis e integrações existentes.
- Relatórios indispensáveis que precisam ter equivalente no Lizy.
