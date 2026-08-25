# 07 — Registro inicial de riscos

| ID | Risco | Prob. | Impacto | Evidência | Controle recomendado |
|---|---|---:|---:|---|---|
| R01 | Ficha de motor indisponível/incompleta no go-live | Alta | Crítico | V01 27:52–28:23 | Tornar a homologação da ficha de motor um critério de bloqueio da virada. |
| R02 | Credencial compartilhada da oficina reduz rastreabilidade | Alta | Alto | V01 28:23–29:39 | Preferir usuários individuais/MFA; se inviável, exigir técnico individual e logs imutáveis. |
| R03 | Finalização indevida faz etapas obrigatórias avançarem automaticamente | Média | Alto | V01 24:35–25:59 | Permissões, confirmação, checklist e possibilidade controlada de correção. |
| R04 | Edição de preços/descontos sem alçada | Média | Alto | V01 11:12–11:31 | Perfil comercial, limites e aprovação para exceções. |
| R05 | Aprovação/reprovação registrada sem evidência do cliente | Média | Alto | V01 15:07–15:27 | Anexar e-mail/pedido, registrar usuário/data e exigir motivo. |
| R06 | Foto/anexo selecionado incorretamente para o laudo | Alta | Médio/Alto | V01 01:35–02:54 e 07:18–10:20 | Pré-visualização obrigatória e revisão antes do envio. |
| R07 | Serviço ou peça omitido na peritagem não chega ao PCP/estoque | Média | Alto | V01 05:48–07:18 e 21:23–22:57 | Checklist por ficha e conferência Comercial/PCP. |
| R08 | Saldo/baixa de estoque divergente da retirada física | Média | Alto | V01 16:15–16:48 | Dupla validação, identificação do retirante e inventário de teste. |
| R09 | Entrada fiscal não validada ponta a ponta | Alta | Crítico | V01 19:27–20:44 | Teste com documento autorizado em homologação e conciliação estoque/financeiro. |
| R10 | Migração incompleta de cadastros e saldos do Alterdata | Alta | Crítico | S01; ausência de evidência | Reconciliação por domínio, amostras e totais de controle. |
| R11 | OS em andamento ficam órfãs no corte | Média | Crítico | Pendente | Definir estratégia: concluir no legado, migrar ou operar paralelo com regra clara. |
| R12 | Termos de garantia/condições ainda não configurados | Alta | Alto | V01 13:13–13:39 | Aprovação jurídica/comercial e teste de todos os modelos. |
| R13 | Envio de orçamento para destinatário incorreto | Média | Alto | V01 14:06–14:56 | Confirmação do destinatário, domínio e histórico de envio. |
| R14 | Dependência de internet/SaaS sem contingência | Média | Alto | S01 | Plano de indisponibilidade, contatos, exportações e SLA contratual. |
| R15 | Automação futura baseada em interface frágil | Média | Médio/Alto | API pública não confirmada | Priorizar API suportada; RPA somente com conta restrita e monitoramento. |
| R16 | Dados sensíveis expostos em logs/documentação | Baixa/Média | Alto | Escopo de análise | Redação de evidências, controle de acesso e proibição de segredos no repositório. |
| R17 | Serviço/produto incompatível com dados técnicos da peritagem chega à proposta | Alta | Crítico | L02, OS 79: 3 CV versus serviço 2 CV; rolamentos 1228/1229 versus produto 1220 | Validações cruzadas, catálogo técnico e revisão obrigatória antes do envio. |
| R18 | PDF imprime condição e garantia diferentes da tela | Média/Alta | Alto | L02, OS 79: tela vazia; PDF com 30 ddl/30 dias | Exibir origem/default, exigir confirmação e comparar prévia antes do envio. |
| R19 | Número de série e campos técnicos essenciais não são obrigatórios | Alta | Alto | L02, OS 79 salva com série e ensaios vazios | Regras por ficha/equipamento e bloqueios de conclusão configuráveis. |
| R20 | Laudo técnico/proposta técnica falham sem retorno útil ao usuário | Alta | Alto | L02, erro `_intl` e nenhuma saída após repetição | Corrigir gerador, validar pré-requisitos e apresentar mensagem acionável. |
| R21 | Prazo previsto da OS não é refletido na proposta | Alta | Alto | L02, 13/08/2026 no cabeçalho; prazo vazio no PDF | Mapeamento automático ou campo comercial obrigatório com conferência. |
| R22 | Custo zerado distorce margem e decisão comercial | Média/Alta | Alto | L02, custo R$ 0,00 com orçamento R$ 795,00 | Configurar custos e bloquear aprovação quando custo/margem estiverem ausentes. |
| R23 | Foto inadequada é enviada no relatório/proposta | Média | Médio/Alto | L02, imagem de chegada aparenta ser logomarca | Checklist visual e prévia obrigatória antes do envio. |
| R24 | Proposta da OS apresenta itens corretos, mas total comercial zerado | Alta | Crítico | L03, OS 83: itens R$ 1.320,00 e quadro Orçamento R$ 0,00 | Bloquear envio quando soma de itens divergir do total; teste automatizado do PDF. |
| R25 | Orçamento avança para aguardando aprovação sem envio ao cliente | Alta | Alto | L03, orçamento 1234568971 | Separar criação, envio e espera de aprovação; exigir evento e auditoria de envio. |
| R26 | Itens não cadastrados ou sem imposto completo são aceitos | Alta | Alto/Crítico | L03, alerta de serviço não cadastrado e produtos `Preencher Imposto` | Validação bloqueante de cadastro e tributação antes de salvar/enviar. |
| R27 | OS e orçamento comercial não possuem vínculo/propagação clara | Alta | Alto | L03, itens e condições redigitados no orçamento 1234568971 | Identificador de origem, sincronização controlada e prevenção de duplicidade. |
| R28 | Serviço externo não tem regra clara de custo versus preço | Média/Alta | Alto | L03, R$ 250,00 na OS e ausência na proposta | Definir contabilização, margem e exibição por tipo de serviço externo. |
| R29 | Aprovação comercial falha silenciosamente ou exige repetição, com risco de efeitos duplicados | Alta | Crítico | L03, primeira tentativa falhou e a segunda aprovou | Idempotência, mensagem de causa, chave única e consulta de efeitos antes de permitir repetição. |
| R30 | Produto errado é comprado por perda de unidade ou troca de SKU | Alta | Crítico | L03, 6204 sem unidade e exibido com SKU do 6205 | Bloquear compra em divergência, conferir código/SKU/UM em todas as etapas e manter trilha de origem. |
| R31 | Cotação desaparece após salvar respostas sem gerar pedido de compra | Alta | Crítico | L03, CT03 saiu da listagem e não apareceu em Compras | Recuperação por ID, estados explícitos, log de transição e teste de regressão do ciclo de cotação. |
| R32 | Aprovação movimenta estoque/compras, mas não move a OS ao PCP | Alta | Crítico | L03, orçamento 1234568971 aprovado; OS 83 permaneceu em Peritagem | Vínculo obrigatório OS-orçamento e transação atômica ou compensável entre Comercial, Estoque e PCP. |
| R33 | Campos inline de preço/imposto favorecem gravação na coluna errada | Alta | Alto | L03, 155% inserido temporariamente em ICMS ao preencher valores | Rótulos persistentes, foco visível, validação de faixa e confirmação antes de salvar. |
| R34 | Carregamento infinito impede conferir itens de compra | Alta | Alto | L03, expansão em `Carregando Registros...` com erro genérico | Timeout visível, retentativa segura e rota alternativa documentada. |
| R35 | Datas podem sofrer deslocamento entre cadastro e reabertura | Média | Alto | L03, serviço externo registrado como 05/08 e reaberto como 04/08 | Padronizar fuso/data sem hora e testar ida e volta em todos os módulos. |

## Critérios mínimos de go-live sugeridos

- Ficha de motor validada por técnicos e gestão.
- Perfis e rastreabilidade aprovados.
- Cenário completo com OS nova, laudos, orçamento, aprovação, estoque/compra, PCP, faturamento e saída.
- Reconciliação de cadastros, saldos e pendências do Alterdata.
- Modelos de documentos e regras WEG aprovados.
- Plano de contingência e rollback definido.
- Treinamento por função e checklist de operação.

Esses critérios são **Sugestões**, não regras confirmadas do Lizy.
