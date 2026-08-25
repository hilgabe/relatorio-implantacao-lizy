# 03 — Mapa inicial dos processos da Elétrica Visão

Este mapa descreve o processo apresentado no Treinamento 01, não necessariamente o processo definitivo da empresa. Responsáveis marcados como **Provável** devem ser confirmados com os gestores.

| Etapa | Responsável | Ação e dados necessários | Registro/documento no Lizy | Próxima etapa | Falhas possíveis |
|---|---|---|---|---|---|
| 1. Entrada do equipamento | **Provável:** Logística/Recebimento | Receber equipamento e nota/remessa; conferir quantidade de equipamentos | Estoque de Terceiro; dados da nota/chave | Abrir uma OS por equipamento | Equipamento sem nota, quantidade divergente, vínculo com cliente errado |
| 2. Identificação | **Provável:** Recebimento | Escolher ficha, fabricante, equipamento, modelo, defeito e série | Cadastro da OS e fotos de chegada | Salvar OS | Ficha errada, série ilegível, fotos insuficientes |
| 3. Abertura da OS | **Provável:** Logística | Completar campos obrigatórios e data prevista | Número sequencial e etiqueta | Peritagem | OS duplicada ou etiqueta no equipamento errado |
| 4. Peritagem | Técnico | Iniciar atividade, preencher relatório inicial, dados técnicos, checkboxes e observações | Status “analisando”; técnico; ficha técnica | Definir escopo | Campo técnico incompleto ou não padronizado |
| 5. Evidências técnicas | Técnico | Anexar fotos, PDFs, testes e legendas; selecionar o que sai no laudo | Anexos e laudo parcial | Definir serviços/peças | Omissão/exposição indevida no laudo |
| 6. Escopo do serviço | Técnico/peritagem | Selecionar serviços, setor executor, peças e serviços externos | Itens da OS | Finalizar peritagem | Serviço ou peça ausente; fornecedor incorreto |
| 7. Laudo técnico | Técnico/peritagem | Conferir o documento gerado | PDF/laudo técnico da peritagem | Comercial | Laudo inconsistente com ficha/fotos |
| 8. Orçamento | Comercial | Revisar preços, desconto, prazo, garantia, frete, pagamento, pedido e observações | Proposta comercial em PDF | Enviar ao cliente | Preço alterado sem alçada, condição incorreta |
| 9. Envio | Comercial | Confirmar destinatários e enviar pela plataforma | Histórico de envio e status | Aguardar aprovação | E-mail errado, falha não tratada, versão divergente |
| 10. Decisão do cliente | Comercial | Registrar aprovação ou reprovação | Aprovados ou Não aprovados | PCP/Suprimentos ou encerramento | Decisão registrada sem evidência/autorização |
| 11. Separação de material | Estoque/Suprimentos | Validar saldo, dar baixa e registrar retirada | Requisição de estoque | Entregar à oficina ou comprar | Saldo incorreto, baixa sem entrega, dupla movimentação |
| 12. Compras | Compras/Suprimentos | Cotar, comparar, escolher fornecedor e gerar pedido ligado à OS | Requisição, cotação e pedido de compra | Recebimento fiscal | Compra sem vínculo, condição/preço incorretos |
| 13. Entrada de material | **Provável:** Fiscal/Estoque | Vincular nota ao pedido e concluir entrada | Estoque e contas a pagar | Liberar material | Nota/pedido divergentes; entrada parcial não tratada |
| 14. Planejamento | PCP | Planejar serviços independentes e setores necessários | Ordem nos setores planejados | Execução | Etapa esquecida ou setor errado |
| 15. Execução | Técnicos/oficina | Iniciar e finalizar cada atividade, identificando técnico | Apontamentos e status | Próximo setor | Uso de credencial compartilhada; encerramento prematuro |
| 16. Etapas obrigatórias | Oficina/qualidade | Após montagem, realizar testes finais, pintura e acabamento | Avanço automático entre setores | Finalização | Automação propaga erro de finalização |
| 17. Finalização | Serviços/qualidade | Conferir execução e gerar laudo final | Finalizados e laudo final | Faturamento/expedição | Concluir sem aceite técnico ou documento completo |
| 18. Faturamento | Financeiro/fiscal | Emitir nota de serviço e/ou produto | Documento fiscal/financeiro | Entrega | Tributação, valores e natureza não validados |
| 19. Expedição/devolução | Logística | Liberar equipamento de terceiro e entregar ao cliente | Saída do estoque de terceiro | Pós-venda | Entrega sem documento, destinatário ou aceite |
| 20. Garantia e pós-venda | **Pendente** | Não demonstrado | Não mapeado | — | Processo e rastreabilidade desconhecidos |

## Regras de transição confirmadas

- Uma OS é aberta por equipamento, mesmo quando a nota contém vários itens.
- Salvar a OS gera etiqueta e a envia à fila de peritagem.
- Finalizar a peritagem envia a OS ao Comercial.
- Aprovação envia a OS simultaneamente ao PCP e a Suprimentos.
- Falta de material permite gerar requisição de compra vinculada.
- A OS só aparece nos setores independentes planejados.
- Setores obrigatórios avançam automaticamente após a conclusão da etapa anterior.
- Finalizar o PCP libera o fluxo para laudo final, faturamento e devolução.

## Processos ausentes ou incompletos

- Entrada sem nota, urgência, retorno de garantia e retrabalho.
- Cancelamento/reabertura em cada etapa.
- Aprovação parcial ou revisão de orçamento.
- Compras/entregas parciais e substituição de item.
- Controle de qualidade e aceite antes da finalização.
- Expedição, comprovante de entrega e assinatura do cliente.
- Garantia, pós-venda e retorno do equipamento.
- Regras específicas WEG e documentos exigidos pela autorizada.
