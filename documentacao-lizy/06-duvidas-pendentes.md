# 06 — Dúvidas pendentes

## Prioridade 1 — bloqueiam homologação

0. Por que a proposta direta da OS 83 lista R$ 1.320,00 em itens, mas imprime o quadro de orçamento inteiro em R$ 0,00?
0. Qual é o fluxo oficial para vincular a OS 83 ao orçamento comercial sem redigitar serviço e produtos?
0. Por que o orçamento `1234568971` entrou em `Aguardando Aprovação` sem ter sido enviado?
0. Por que serviços não cadastrados e produtos com `Preencher Imposto` podem compor e salvar um orçamento?
0. Na OS 79, por que a tela deixou número de série, condição de pagamento, garantia, prazo de entrega e muitos campos técnicos vazios, mas permitiu concluir a peritagem e gerar proposta?
0. De onde o PDF da proposta 79 obteve `30 ddl` e `30 dias` se condição de pagamento e garantia estavam vazias na tela?
0. Por que `Laudo Técnico` e `Proposta Técnica` não geraram documento e houve erro JavaScript relacionado a `_intl`? Quais campos prévios são obrigatórios para esses relatórios?
0. Como impedir que um serviço de 2 CV e um rolamento 1220 sejam orçados para uma entrada/peritagem que indica 3 CV e rolamentos 1228/1229?
0. Por que a primeira aprovação de `1234568971` falhou silenciosamente e como o sistema garante idempotência quando o usuário tenta novamente?
0. Por que a aprovação criou a RE09 e a requisição de compra, mas não moveu a OS 83 de Peritagem para PCP?
0. Onde está a CT03 após salvar as respostas dos fornecedores, já que ela não aparece com filtros limpos nem gerou nova compra?
0. Por que o 6204 perde a unidade de medida e aparece com o SKU do 6205 na geração de compra/cotação?
0. Como recuperar a CT03 e continuar sem recriar ou duplicar orçamento, requisição, cotação ou pedido?

1. Quando a ficha de **motor elétrico** ficará disponível e quais campos/checklists WEG conterá?
2. Quais são as fichas definitivas de motor, bomba, transformador e demais equipamentos?
3. Como tratar equipamento sem número de série legível se o campo for obrigatório?
4. Qual integração faz o recebimento automático no Estoque de Terceiro? Ela usa XML, chave de acesso, importação manual ou outro mecanismo?
5. Quais ambientes existem (teste/homologação/produção) e como os dados são isolados?
6. Como cancelar, corrigir ou reabrir OS, peritagem, aprovação, baixa, compra, etapa do PCP e finalização?
7. Como o sistema trata aprovação parcial, revisão de orçamento e nova versão enviada ao cliente?
8. Quais alçadas controlam edição de preço, desconto, prazo, garantia e condições comerciais?
9. Como ocorre a entrada fiscal real e o que acontece em divergência, entrada parcial, devolução ou cancelamento?
10. Quais validações impedem finalizar PCP antes de materiais, testes e aceite técnico?

## Prioridade 2 — segurança e auditoria

1. Por que foi sugerido um usuário/e-mail compartilhado da oficina? Existe alternativa com login individual ou SSO?
2. Como cada técnico se autentica ao iniciar/finalizar uma atividade? A senha é individual?
3. Logs registram login, técnico, data/hora, dispositivo, alteração anterior/posterior e origem?
4. Quais perfis enxergam valores e quem pode alterar preços?
5. Há política de sessão, MFA, bloqueio de conta e encerramento remoto de dispositivo?
6. Tablets ficam compartilhados? Como evitar apontamento no técnico errado?
7. Quem pode excluir anexos, fotos ou registros, e há lixeira/versionamento?
8. Como são armazenados e protegidos laudos, fotos, dados de clientes e documentos fiscais?

## Prioridade 3 — operação

0. Qual é o significado oficial de `Q`, `B`, `R`, `S` e `T` na ficha de peritagem de motor? As opções devem ser mutuamente exclusivas?
0. Quais campos da avaliação inicial são obrigatórios para avançar ao orçamento e gerar laudo técnico?
0. O valor total de custo pode permanecer em `R$ 0,00` quando existem serviços e produtos com preço? De onde vem o custo utilizado para margem?

1. Quem é o dono de cada etapa e qual SLA esperado?
2. Qual nomenclatura oficial: “Análise” ou “Peritagem” na interface da Elétrica Visão?
3. Quais setores são independentes e obrigatórios para cada tipo de equipamento?
4. Como urgência/prioridade afeta fila, PCP, compras e prazo?
5. Como registrar serviço externo, saída/retorno do equipamento e responsabilidade do fornecedor?
6. Como funciona controle de qualidade, teste final e liberação?
7. Como funciona expedição, comprovante de entrega e aceite do cliente?
8. Qual é o processo de garantia, retorno, retrabalho e pós-venda?
9. Quais indicadores e relatórios são indispensáveis por setor?
10. O laudo técnico e o laudo final precisam de assinatura eletrônica, responsável técnico ou aprovação?

## Prioridade 4 — documentos e comunicação

1. Onde está o PDF do workflow prometido no treinamento?
2. Quais termos gerais e de garantia devem constar na proposta/laudo?
3. Quando mostrar ou ocultar peças e valores no orçamento?
4. Qual regra oficial de frete CIF/FOB e responsabilidade pela entrega?
5. Qual e-mail/remetente envia orçamentos? Há cópia interna e tratamento de falha?
6. Como versionar proposta, laudo, anexos e histórico de envio?
7. Quais documentos WEG são obrigatórios por serviço/equipamento?

## Prioridade 5 — migração e integração

1. Existe API oficial documentada do ERP? Qual autenticação, escopo, rate limit e ambiente sandbox?
2. Existem webhooks para OS, orçamento, aprovação, estoque, compra, PCP, faturamento e expedição?
3. Quais formatos de importação/exportação existem e quem pode usá-los?
4. Há documentação de integrações nativas e contratos de suporte/SLA?
5. Como exportar uma cópia completa e auditável dos dados da empresa?
6. Qual estratégia foi acordada para histórico, OS abertas, estoque, financeiro e fiscal do Alterdata?
7. Qual o plano de contingência se o Lizy ou a internet ficarem indisponíveis?
