# Implantação do ERP Lizy — Elétrica Visão

Este repositório reúne um relatório web vivo das solicitações enviadas à equipe da Lizy e a documentação de análise da migração do Alterdata para o Lizy. A base pública consolida 16 demandas iniciais de Almoxarifado, Aquisição e Comercial, recebe novas solicitações compartilhadas pelo próprio painel e mantém o histórico da implantação em uma seção separada, marcada para revalidação.

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

- a integração de status compartilhado usa Supabase Realtime e depende das variáveis de ambiente do projeto na Vercel;
- o código compartilhado simplifica o acesso, mas não substitui autenticação individual nem identifica qual pessoa realizou cada alteração;
- prioridades são uma classificação proposta pela Elétrica Visão, não uma definição da Lizy;
- o histórico precisa ser revalidado e não comprova o funcionamento atual do ERP.

## Status compartilhado ao vivo

O painel usa Supabase Realtime. A tabela `task_statuses` permite leitura pública, bloqueia gravações diretas e recebe alterações somente por uma função protegida por código compartilhado. A Vercel precisa das variáveis abaixo:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

O código fica armazenado no banco apenas como hash e é mantido somente na memória do navegador durante a sessão. Visitantes acompanham as atualizações em tempo real. Nunca use chave `service_role` no frontend.

## Abertura de solicitações

O botão **Abrir solicitação** leva ao formulário compartilhado. Cada envio validado recebe um identificador automático `SOL-xxxx`, inicia no estado **Nova** e aparece ao vivo para todos os visitantes. A gravação exige o mesmo código de quatro dígitos usado para alterar estados.

Como o painel é público, o formulário avisa para não registrar senhas, dados pessoais, documentos confidenciais ou informações comerciais sigilosas. O anexo é informado por link `https://`; arquivos não são enviados diretamente ao banco.

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
