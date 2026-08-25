# 11 — Fontes, método e rastreabilidade

## Catálogo de fontes

| ID | Fonte | Tipo | Uso permitido nesta documentação |
|---|---|---|---|
| S01 | Texto anexado pelo usuário | Requisito e contexto | Verdade declarada sobre empresa, migração e regras de segurança. |
| V01 | Vídeo Drive `1GU6DHWfB4Rrv3pq15I7DweYYLZFAr7-f` | Treinamento gravado | Evidência principal do workflow, campos, regras e dúvidas. |
| V02–V06 | Cinco links Drive restantes | Vídeos não acessíveis | Apenas registro de indisponibilidade. |
| L01 | `https://app.lizy.com.br/comercial/dashboard` | Interface autenticada | Confirmação do menu/departamentos e empresa ativa no instante observado. |
| L02 | OS 79 e proposta comercial 79, observadas em `https://app.lizy.com.br` em 2026-07-30 | Teste funcional autenticado | Evidência da ficha de motor, validações, salvamento, rastreio, encaminhamento ao Comercial, valores, PDF e falhas de relatório. Detalhes em `testes/teste-os-079-2026-07-30.md`. |
| L03 | OS 83, proposta direta da OS e orçamento comercial `1234568971`, observados em `https://app.lizy.com.br` em 2026-07-30 | Teste funcional autenticado | Evidência da criação desde o início, peritagem completa, avaliação inicial, cadastros de produtos, serviços, serviço externo, condições, PDFs e divergências do vínculo OS–Comercial. Detalhes em `testes/teste-os-083-2026-07-30.md`. |
| W01 | `https://lizy.com.br/` | Site oficial público | Contexto institucional e famílias de módulos. |
| W02 | `https://lizy.com.br/lizy-erp` | Site oficial público | Posicionamento do ERP/EIP e implantação. |
| W03 | `https://lizy.com.br/lizy-dataflow` | Site oficial público | Possibilidade institucional de integração de fontes; não equivale a API do ERP. |
| W04 | `https://lizy.com.br/cases` e cases relacionados | Site oficial público | Contexto comparável; não prova configuração da Elétrica Visão. |

## Hierarquia de evidência

1. Operação visível no vídeo ou na interface, com marca de tempo/tela.
2. Declaração verbal explícita no treinamento.
3. Requisito ou contexto fornecido pelo usuário.
4. Página pública oficial da Lizy.
5. Inferência técnica, sempre marcada como **Provável** ou **Sugestão**.

## Convenção de citação

- `[V01 00:15:20–00:15:51]`: trecho do vídeo com intervalo.
- `[L01]`: dashboard autenticado observado em 2026-07-30.
- `[S01]`: contexto/requisito fornecido pelo usuário.
- `[W01]`, `[W02]`, etc.: página pública oficial.

## Limitações do método

- A transcrição foi produzida automaticamente e pode errar nomes e termos. Ela serve como índice; decisões operacionais devem considerar também a tela e o áudio.
- Quadros a cada 15 segundos podem não capturar modais muito breves. Trechos críticos foram avaliados junto com a transcrição.
- A análise da interface autenticada foi interrompida por expiração/redirecionamento de sessão.
- Nenhuma chamada interna, endpoint, token, armazenamento local, cookie ou dado sensível foi inspecionado.

## Regra para futuras atualizações

Toda nova informação deve incluir fonte, data, classificação e, quando for vídeo, marca de tempo. Mudanças confirmadas em treinamento posterior devem apontar explicitamente quais trechos anteriores ficaram obsoletos.
