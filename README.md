# Implantação do ERP Lizy — Elétrica Visão

Este repositório reúne um relatório web vivo das solicitações enviadas à equipe da Lizy e a documentação de análise da migração do Alterdata para o Lizy. A base pública consolida 13 demandas atuais de Almoxarifado e Aquisição e mantém o histórico da implantação em uma seção separada, marcada para revalidação.

## Painel web

Pré-requisito: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Validação e versão de produção:

```bash
npm run lint
npm test
npm run build
```

O conteúdo gerado em `dist/` pode ser publicado como site estático. Na Vercel, use o framework **Vite**, comando de build `npm run build` e diretório de saída `dist`.

### Limitações do MVP

- não há backend, autenticação ou banco de dados;
- alterações de estado são gravadas no `localStorage` e ficam somente no dispositivo atual;
- o link público sempre carrega os estados iniciais consolidados no código;
- prioridades são uma classificação proposta pela Elétrica Visão, não uma definição da Lizy;
- o histórico precisa ser revalidado e não comprova o funcionamento atual do ERP.

## Documentação histórica

A primeira etapa começou estritamente em leitura. Em 2026-07-30, o usuário autorizou um teste funcional real e delimitado de OS, peritagem e proposta; essa autorização não incluiu envio ao cliente, faturamento, produção, expedição, emissão fiscal real, exclusões ou mudanças de configuração. A continuação autorizada em homologação incluiu aprovação fictícia, estoque, compras e cotação, conforme registrado na documentação.

Comece por:

- [Visão geral](documentacao-lizy/00-visao-geral.md)
- [Inventário e situação dos acessos](documentacao-lizy/01-inventario-de-materiais.md)
- [Treinamento 01 — workflow completo](documentacao-lizy/treinamentos/treinamento-01.md)
- [Teste T01 — OS 79, peritagem e proposta](documentacao-lizy/testes/teste-os-079-2026-07-30.md)
- [Dúvidas pendentes](documentacao-lizy/06-duvidas-pendentes.md)
- [Fontes e método](documentacao-lizy/11-fontes-e-metodologia.md)

## Regra de leitura

Cada afirmação relevante recebe uma classificação:

- **Confirmado:** demonstrado ou declarado diretamente em uma fonte identificada.
- **Provável:** interpretação sustentada por evidências, ainda não validada operacionalmente.
- **Pendente:** precisa de confirmação.
- **Não acessível:** a fonte não pôde ser aberta ou analisada.
- **Sugestão:** proposta de melhoria; não é funcionalidade confirmada do Lizy.

## Segurança

Esta documentação não deve conter senhas, tokens, chaves fiscais, dados pessoais desnecessários ou credenciais. Qualquer teste futuro que grave dados exige autorização prévia, plano de reversão e definição do ambiente de teste.
