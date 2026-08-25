# Treinamento 01 — Workflow completo do Lizy

## Identificação

- Fonte: `[V01]` — [Google Drive](https://drive.google.com/file/d/1GU6DHWfB4Rrv3pq15I7DweYYLZFAr7-f/view)
- Título: `nsr-swrr-wot (2026-06-10 08:41 GMT-3)`
- Duração: 30min24s
- Situação: **analisado integralmente** por áudio, transcrição e amostragem visual.
- Assunto: demonstração ponta a ponta do fluxo de manutenção no Lizy, usando uma ficha de transformador.
- Observação: os registros usados no vídeo aparentam ser de demonstração/teste. Esta documentação não presume que representem dados produtivos atuais.

## Mapa temporal

| Tempo | Bloco | Evidência principal |
|---|---|---|
| 00:00–03:58 | Recebimento, estoque de terceiro e abertura da OS | Nota/remessa, tipo de ficha, dados do equipamento, fotos, número de série, etiqueta e fila de peritagem. |
| 03:58–10:20 | Peritagem e laudo técnico | Início por técnico, ficha técnica, serviços, peças, terceiros, PDFs, fotos e impressão do laudo. |
| 10:20–15:13 | Comercial e orçamento | Valores, desconto, condições, garantia, frete, apresentação de peças, PDF, envio e histórico. |
| 15:13–21:12 | Aprovação, estoque e compras | Requisição de estoque, falta de material, cotação, pedido, entrada e contas a pagar. |
| 21:12–26:07 | PCP e execução | Planejamento por serviço/setor, apontamentos, setores independentes e obrigatórios. |
| 26:07–27:03 | Finalização | Laudo final, liberação para faturamento e devolução do equipamento. |
| 27:03–30:16 | Dúvidas e próximos passos | PDF do workflow, ficha de motor e modelo de acesso da oficina. |

## 1. Recebimento e abertura da OS

### Fluxo demonstrado

1. O equipamento recebido pode entrar automaticamente no **Estoque de Terceiro** por uma integração mencionada, mas não detalhada. `[V01 00:00:05–00:00:19]`
2. A abertura da OS parte de informações da nota do cliente e da chave de acesso. Uma nota com vários equipamentos permite abrir uma ordem por equipamento. `[V01 00:00:19–00:00:47]`
3. O usuário escolhe o tipo de ficha/ordem. Foram citados motor e bomba; a demonstração usou transformador. `[V01 00:00:47–00:01:08]`
4. O sistema traz o sequencial da ordem e, segundo o treinamento, cliente e número da nota a partir da nota de remessa. `[V01 00:01:08–00:01:28]`
5. São preenchidos fabricante, equipamento, modelo, defeito e fotos. No tablet, a câmera pode ser usada diretamente; no vídeo, as imagens vieram da galeria. `[V01 00:01:28–00:02:23]`
6. Fotos podem receber legenda e indicação para aparecer ou não no relatório/laudo. A mesma gestão também pode ser feita mais tarde na etapa de orçamento. `[V01 00:02:15–00:03:02]`
7. O número de série foi exigido antes de salvar. Ao salvar, o sistema gerou uma etiqueta com o cliente e encaminhou a OS para Serviços/Peritagem com status de espera por inspeção. `[V01 00:03:02–00:03:58]`

### Campos confirmados

- Tipo de ordem/ficha.
- Sequencial da OS.
- Data prevista.
- Cliente e número da nota.
- Fabricante, equipamento, modelo e defeito.
- Número de série — obrigatório no cenário demonstrado.
- Fotos, legendas e seleção de exibição no relatório.

### Cuidados

- **Confirmado:** uma nota pode conter mais de um equipamento; a abertura é separada por equipamento.
- **Confirmado:** salvar sem número de série não foi permitido no exemplo.
- **Pendente:** confirmar se a obrigatoriedade do número de série vale para todas as fichas e como tratar equipamento sem placa/numeração legível.
- **Pendente:** identificar qual integração realiza o recebimento automático e quais validações existem antes de criar o estoque de terceiro.

## 2. Peritagem e laudo técnico

### Fluxo demonstrado

1. A fila de Serviços reúne as ordens abertas. Para a Elétrica Visão, a etapa chamada “Análise” em outras empresas foi tratada como **Peritagem**. `[V01 00:03:34–00:04:15]`
2. O técnico inicia o status informando usuário/senha; a OS passa a “analisando” e registra o técnico responsável. `[V01 00:04:15–00:04:28]`
3. A ficha técnica varia conforme o tipo de equipamento. A ficha de transformador continha relatório inicial, peritagem, dados elétricos, caixas de seleção e campos livres. `[V01 00:04:28–00:05:18]`
4. O laudo pode ser impresso parcialmente sem finalizar toda a peritagem; somente as etapas preenchidas são apresentadas. `[V01 00:05:18–00:05:48]`
5. Serviços são escolhidos de uma tabela da empresa e associados ao setor executor. Foi afirmado que o usuário técnico não terá acesso aos valores; eles só apareciam porque o instrutor estava em outro perfil. `[V01 00:05:48–00:06:15]`
6. Peças são escolhidas do cadastro de produtos. Serviços externos recebem fornecedor, descrição/prazo e refletem posteriormente no PCP. `[V01 00:06:38–00:07:18]`
7. PDFs e outros arquivos podem ser anexados e marcados para aparecer ou não no laudo. Também são anexadas fotos do equipamento desmontado. `[V01 00:07:18–00:08:36]`
8. O laudo técnico reúne fotos, legendas, avaliações, testes, observações, mão de obra, serviços externos, peças e PDFs selecionados. `[V01 00:08:36–00:10:20]`

### Regras confirmadas

- A ficha muda conforme o tipo de equipamento.
- O laudo é composto dinamicamente pelos dados preenchidos e itens marcados para exibição.
- É possível imprimir um laudo técnico antes da conclusão total.
- Valores devem ficar ocultos do perfil técnico, conforme declaração do instrutor.
- Finalizar a inspeção/peritagem encaminha a OS ao Comercial.

### Riscos de uso

- Ficha errada gera campos técnicos inadequados e um laudo possivelmente inválido.
- Fotos sem legenda ou com seleção de exibição incorreta podem omitir evidência ou expor material indesejado ao cliente.
- Serviço, peça ou fornecedor incorretos contaminam orçamento, estoque, compra e PCP.
- Campos livres favorecem variação de terminologia; convém padronizar textos técnicos.

## 3. Comercial e orçamento

### Fluxo demonstrado

1. Após finalizar a inspeção, a OS aparece no Comercial em **Aguardando envio**. `[V01 00:10:20–00:10:41]`
2. O Comercial vê dados iniciais, fotos, peritagem, peças, serviços e valores. Valores vindos da tabela podem ser editados no orçamento. `[V01 00:10:41–00:11:26]`
3. Foram demonstrados desconto, condição, garantia, prazo de entrega, pedido de compra do cliente, tipo de pedido (misto, produto ou serviço), observações e frete. `[V01 00:11:26–00:12:16]`
4. Há controles para mostrar ou ocultar peças e seus valores na proposta. O PDF muda conforme essa seleção. `[V01 00:12:16–00:13:13]`
5. A proposta inclui condições gerais, pagamento, prazo, garantia, frete e observações. Termos gerais e de garantia ainda precisavam ser adicionados/configurados. `[V01 00:13:13–00:13:39]`
6. Ao marcar o orçamento como enviado, o status muda de **Aguardando envio** para **Aguardando aprovação**. `[V01 00:13:39–00:13:54]`
7. O orçamento pode ser enviado pela plataforma para o e-mail cadastrado do cliente ou para endereço adicional informado. Há histórico com data e resultado do envio. `[V01 00:14:06–00:14:56]`

### Regras e cuidados

- **Confirmado:** valores podem ser alterados no Comercial, mesmo quando originados de tabela.
- **Confirmado:** a apresentação de peças e valores é configurável por orçamento.
- **Confirmado:** envio por e-mail mantém histórico.
- **Pendente:** definir alçadas para edição de preço/desconto e aprovações internas.
- **Pendente:** validar modelo, remetente, domínio, cópias, anexos e política de reenvio dos e-mails.
- **Pendente:** confirmar a terminologia e o padrão de frete da empresa (`CIF`/`FOB`) e seus efeitos fiscais/financeiros.

## 4. Aprovação, estoque e compras

### Aprovação

- Se o cliente não aprova, a OS vai para **Não aprovados** e o fluxo comercial é encerrado. `[V01 00:15:07–00:15:20]`
- Se aprova, a OS vai para **Aprovados**, gera requisição de estoque para as peças e segue simultaneamente para PCP e Suprimentos. `[V01 00:15:20–00:15:51]`

### Estoque

1. Suprimentos pode baixar/imprimir a requisição e separar materiais. `[V01 00:15:51–00:16:15]`
2. A primeira validação confirma existência do item; a segunda registra a retirada/entrega do estoque. Quando disponível, o item fica aguardando retirada. `[V01 00:16:15–00:16:48]`
3. Se não houver saldo, a requisição pode originar uma requisição de compra vinculada à necessidade. `[V01 00:16:48–00:17:10]`

### Compras

1. A requisição de compra origina cotação com um ou vários fornecedores. `[V01 00:17:10–00:17:35]`
2. A cotação pode ser baixada e enviada aos fornecedores. Depois registram-se prazo, condição de pagamento e valor unitário. `[V01 00:17:28–00:18:22]`
3. Seleciona-se o fornecedor vencedor; cliente/equipamento/fornecedor são vinculados, e registram-se pagamento, classificação da compra, conta e observações. `[V01 00:18:22–00:19:03]`
4. O pedido de compra fica **Aguardando entrega** e permanece ligado à requisição e ao número/status da OS. `[V01 00:19:03–00:19:27]`
5. Na entrada da nota, o pedido pode ser vinculado. O cenário real não foi concluído por falta da nota; a demonstração deixou o registro em protocolo. Segundo o instrutor, a entrada completa alimenta estoque e contas a pagar. `[V01 00:19:27–00:20:44]`
6. Após a compra, a requisição muda de estado e o material pode ser entregue à oficina. Se já existisse saldo, seria feita apenas a entrega/retirada. `[V01 00:20:33–00:21:12]`

### Ponto de evidência importante

A integração entrada de nota → estoque → contas a pagar foi **declarada e parcialmente demonstrada**, mas a nota não foi concluída no vídeo. Deve ser validada em teste controlado antes de ser tratada como prova de ponta a ponta.

## 5. PCP e execução

### Planejamento

- O PCP recebe tudo que foi aprovado e planeja a OS a partir dos serviços definidos na peritagem. `[V01 00:21:12–00:21:56]`
- Não é obrigatório planejar todos os serviços de uma vez; cada etapa independente pode ser planejada quando necessário. `[V01 00:21:56–00:22:11]`
- A OS só aparece nos setores em que foi planejada. `[V01 00:22:11–00:23:14]`

### Apontamento

- O técnico inicia e finaliza o serviço; o status no PCP muda para refletir o andamento. `[V01 00:23:14–00:24:13]`
- O mesmo formato é usado nos setores independentes demonstrados.

### Setores independentes e obrigatórios

- **Independentes:** variam conforme o equipamento e precisam de planejamento. No exemplo foram citados rebobinamento e rejuvenescimento. `[V01 00:21:42–00:24:40]`
- **Obrigatórios:** após a montagem, a sequência demonstrada foi testes finais → pintura → acabamento. Essas etapas avançam automaticamente ao finalizar a anterior e não exigem planejamento manual. `[V01 00:24:35–00:25:59]`

### Riscos

- Serviço ausente na peritagem pode não chegar ao planejamento.
- Ordem planejada no setor errado deixa de aparecer onde deveria.
- Finalização indevida faz o fluxo avançar automaticamente.
- O modelo comum de acesso da oficina reduz a atribuição do login; a seleção do técnico precisa ser auditável e obrigatória.

## 6. Finalização, faturamento e saída

Ao finalizar o PCP:

1. A OS vai para **Finalizados**.
2. O laudo final pode ser gerado, separado do laudo técnico da peritagem.
3. O Financeiro recebe a liberação para emitir nota de serviço ou de produto.
4. O equipamento volta ao Estoque de Terceiro para expedição/devolução ao cliente.

Fonte: `[V01 00:26:07–00:27:03]`.

## 7. Dúvidas finais e pendências do treinamento

- O PDF do workflow seria enviado pelo instrutor; não foi recebido nesta entrega. `[V01 00:27:34–00:27:52]`
- A ficha de motor foi solicitada porque é o equipamento mais frequente no dia a dia; ela ainda estava sendo personalizada/priorizada. `[V01 00:27:52–00:28:23]`
- Foi orientado um usuário/e-mail comum para a oficina, possivelmente mantido logado no tablet, enquanto cada início/fim de atividade identifica o técnico. `[V01 00:28:23–00:29:39]`
- As fichas e o cronograma ainda seriam revisados pelo fornecedor. `[V01 00:29:46–00:30:12]`

## Avaliação final do treinamento

O vídeo fornece evidência forte do desenho do workflow de serviços, mas não substitui homologação. Os pontos mais críticos para teste são ficha de motor, segregação de permissões, edição comercial, entrada fiscal real, baixa/retirada de estoque, avanço automático do PCP, geração dos dois laudos e liberação final para faturamento/expedição.

Transcrição completa: [transcricao-treinamento-01.md](../evidencias/transcricao-treinamento-01.md).
