# 04 — Catálogo inicial de módulos

## Logística / Estoque de Terceiro

- **Finalidade confirmada:** receber e controlar equipamentos de clientes, abrir OS e devolver o equipamento após conclusão.
- **Usuários prováveis:** recebimento, logística e expedição.
- **Entradas:** nota/remessa, chave, cliente, equipamentos, fotos e identificação.
- **Saídas:** OS por equipamento, etiqueta e registro de devolução pendente.
- **Riscos:** vínculo incorreto, OS duplicada, equipamento sem rastreio ou baixa de saída indevida.
- **Fonte:** V01 00:00–00:03 e 00:26:44–00:27:03.

## Serviços / Peritagem

- **Finalidade confirmada:** registrar inspeção, dados técnicos, evidências, escopo, peças e serviços externos.
- **Usuários:** técnicos/peritos.
- **Entradas:** ficha do equipamento, medições, checklists, observações, fotos, PDFs, serviços e peças.
- **Saídas:** laudo técnico, escopo para orçamento e identificação do técnico/status.
- **Riscos:** ficha inadequada, laudo incompleto, divergência entre evidência e escopo.
- **Fonte:** V01 00:03:58–00:10:20.

## Comercial / Orçamentos

- **Finalidade confirmada:** precificar, montar e enviar proposta, registrar acompanhamento e decisão do cliente.
- **Usuários:** Comercial e aprovadores internos a definir.
- **Entradas:** escopo técnico, serviços, peças, preços, desconto, pagamento, garantia, prazo, frete e observações.
- **Saídas:** PDF da proposta, histórico de envio, aprovação/reprovação.
- **Riscos:** edição sem alçada, destinatário errado, condições inconsistentes e aprovação sem evidência.
- **Fonte:** V01 00:10:20–00:15:51.

## Suprimentos / Estoque

- **Finalidade confirmada:** atender requisições, validar saldo, separar, baixar e entregar materiais.
- **Usuários:** almoxarifado/estoque.
- **Entradas:** requisição originada pela aprovação do orçamento.
- **Saídas:** item reservado/baixado, retirada registrada ou requisição de compra.
- **Riscos:** saldo incorreto, baixa sem entrega, escolha de estoque errado e requisição duplicada.
- **Fonte:** V01 00:15:51–00:17:10 e 00:20:33–00:21:12.

## Suprimentos / Compras

- **Finalidade confirmada:** transformar falta de material em cotação e pedido ligado à OS.
- **Usuários:** Compras/Suprimentos.
- **Entradas:** item, quantidade, fornecedores, prazos, preços e condições.
- **Saídas:** cotação, fornecedor vencedor, pedido de compra e acompanhamento de entrega.
- **Riscos:** compra sem vínculo, comparação incompleta, classificação financeira ou condição errada.
- **Fonte:** V01 00:16:48–00:20:44.

## Serviços / PCP

- **Finalidade confirmada:** planejar serviços/setores e acompanhar execução.
- **Usuários:** PCP, supervisão da oficina e técnicos.
- **Entradas:** OS aprovada e serviços definidos na peritagem.
- **Saídas:** planejamento, apontamentos, status e avanço por setores.
- **Riscos:** etapa omitida, apontamento no técnico errado, avanço automático indevido.
- **Fonte:** V01 00:21:12–00:26:07.

## Serviços / Finalizados

- **Finalidade confirmada:** encerrar o fluxo técnico, gerar laudo final e liberar faturamento/expedição.
- **Usuários prováveis:** supervisão, qualidade e administrativo.
- **Entradas:** PCP concluído.
- **Saídas:** laudo final, liberação financeira e retorno ao estoque de terceiro.
- **Riscos:** encerramento antes de testes/aceite e documento final incompleto.
- **Fonte:** V01 00:26:07–00:27:03.

## Financeiro e Fiscal

- **Finalidade parcialmente confirmada:** receber contas a pagar da entrada de compras e faturar nota de serviço/produto após finalização.
- **Usuários:** Financeiro/Fiscal.
- **Entradas:** nota de compra, pedido, OS finalizada e orçamento aprovado.
- **Saídas:** contas a pagar e documento de faturamento.
- **Riscos:** configuração tributária, duplicidade, divergência de valores e natureza de operação.
- **Limite:** não houve demonstração fiscal completa.

## Cadastros

- **Finalidade parcialmente confirmada:** sustentar clientes, fornecedores, produtos/peças, serviços, setores, fichas e usuários.
- **Relações:** praticamente todos os módulos dependem da qualidade cadastral.
- **Riscos:** duplicidade, descrição não padronizada, tabela desatualizada e permissões excessivas.
- **Fonte:** L01 e menções no V01.

## Agenda, Ativos, Logs e Agentes de IA

- **Confirmado:** existem no menu observado. `[L01]`
- **Pendente:** finalidade exata, escopo contratado, permissões, dados, retenção e integrações.
- Não foram usados para inferir funcionalidades específicas nesta etapa.

## Relatórios e documentos

Documentos confirmados no fluxo: etiqueta da OS, listagem/fila, laudo técnico parcial, laudo técnico da peritagem, proposta comercial, histórico de envio, requisição de estoque, cotação, pedido de compra e laudo final. A emissão fiscal foi mencionada, mas não executada no treinamento.
