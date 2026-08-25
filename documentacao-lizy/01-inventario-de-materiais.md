# 01 — Inventário de materiais e acessos

Data da auditoria: **2026-07-30**. Todas as verificações foram de leitura.

## Resumo

| ID | Material | Resultado | Classificação | Observação |
|---|---|---|---|---|
| S01 | Texto de contexto e requisitos anexado | Lido integralmente | Confirmado | Define empresa, objetivo, etapas, restrições e estrutura documental. |
| L01 | `https://app.lizy.com.br` | Acessível inicialmente; depois redirecionado ao login | Confirmado | O dashboard autenticado foi lido antes da expiração da sessão. Nenhuma ação de gravação foi feita. |
| V01 | Drive `1GU6...Ar7-f` | Metadados, reprodução e arquivo integral acessíveis | Confirmado | Vídeo MP4 de 364.051.636 bytes; 30min24s; analisado por transcrição e quadros. |
| V02 | Drive `1HIf...EZEL` | Não acessível | Não acessível | Conector retornou `404/notFound`; navegador redirecionou para login do Google. |
| V03 | Drive `1YEz...DHwU` | Não acessível | Não acessível | Conector retornou `404/notFound`; navegador redirecionou para login do Google. |
| V04 | Drive `17Gh...GhN4b` | Não acessível | Não acessível | Conector retornou `404/notFound`; navegador redirecionou para login do Google. |
| V05 | Drive `1uMi...1jLW6` | Não acessível | Não acessível | Conector retornou `404/notFound`; navegador redirecionou para login do Google. |
| V06 | Drive `1IRq...ToE1` | Não acessível | Não acessível | Conector retornou `404/notFound`; navegador redirecionou para login do Google. |
| W01 | Site público `https://lizy.com.br/` | Acessível | Confirmado | Visão institucional e módulos integrados. |
| W02 | Página pública `https://lizy.com.br/lizy-erp` | Acessível | Confirmado | Posicionamento do ERP/EIP e método de implantação. |
| W03 | Página pública `https://lizy.com.br/lizy-dataflow` | Acessível | Confirmado | Indica integração de fontes, APIs e bancos no produto DataFlow; não confirma API pública do ERP. |
| W04 | Cases públicos da Lizy | Acessíveis | Confirmado | Usados apenas como contexto institucional, não como prova de configuração da Elétrica Visão. |

## Material V01

- Título no Drive: `nsr-swrr-wot (2026-06-10 08:41 GMT-3)`.
- MIME type: `video/mp4`.
- Tamanho: `364051636` bytes.
- Duração medida: `1823,917` segundos.
- Resolução medida: `1920 × 1080`, 24 fps.
- SHA-256 do arquivo analisado: `851880A7C9BBE1D2B86F2D187BEE15A12ECE53D65484957D388F02C3C166955F`.
- Método: download público direto, transcrição local em português e extração de 122 quadros a cada 15 segundos.
- Transcrição pesquisável: [transcricao-treinamento-01.md](evidencias/transcricao-treinamento-01.md).

## Acesso ao Lizy

No primeiro acesso, a URL efetiva era `/comercial/dashboard`, com `Eletrica Visao` selecionada como empresa ativa. Foram observados Agenda; departamentos Financeiro, Comercial, Suprimentos, Logística, Serviços e Ativos; Cadastros; Logs; e Agentes de IA. Também foram visíveis links para Dashboard e Orçamentos dentro de Comercial.

Durante a análise, a aba foi redirecionada para `/auth/login`. A sessão não foi reautenticada e nenhuma credencial foi solicitada, copiada ou preenchida.

## O que não foi considerado análise

- Título ou miniatura isolados não foram tratados como conteúdo analisado.
- Os cinco links bloqueados não receberam título inferido, módulo presumido ou resumo.
- A observação de módulos no menu não prova cobertura funcional completa nem autorização de acesso do usuário a todas as telas.
- A publicidade institucional não prova que uma função está contratada ou configurada para a Elétrica Visão.

## Ação necessária para os materiais bloqueados

Conceder permissão de leitura à mesma conta Google conectada ao ambiente ou disponibilizar os vídeos em arquivos locais/links públicos. Não é necessário liberar edição.
