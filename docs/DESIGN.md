# Jev Palette — command palette semântica com TypeSafe Jev

Data: 2026-09-19 · Status: aprovado em chat

## Objetivo

Demo web (React + Vite) de uma command palette (Ctrl+K) que rankeia comandos
pela *intenção* do usuário — em português ou inglês — usando o primitivo
**Choice** do Jev (TypeSafe AI), que devolve a distribuição de probabilidade
completa sobre até 255 opções em uma única chamada (~70–500ms, saída grátis).
Um painel lado a lado mostra o fuzzy match tradicional falhando nas mesmas
queries, evidenciando o ganho semântico.

## Arquitetura

1. **Proxy Node** (`server/index.mjs`): `POST /api/rank { query }`.
   Guarda `TYPESAFE_API_KEY` (browser nunca vê a chave), chama
   `POST https://api.typesafe.ai/v1/systemone` com
   `state: { query }` + uma pergunta `choice` cujas opções são o catálogo
   (`id → descrição`). Devolve distribuição ordenada, confiança, usage e
   latência. Modo mock (`JEV_MOCK=1`) para desenvolvimento sem chave.
2. **Catálogo** (`src/commands.ts`): ~80 comandos de um app fictício de
   produtividade (id, rótulo, ícone, grupo), com sinônimos que não batem
   textualmente para o fuzzy falhar de forma honesta.
3. **UI React**: paleta com debounce ~200ms, abort de chamadas em voo,
   cache por query, barras de probabilidade, rodapé com latência real e
   custo por chamada (via `usage.input_tokens` × $0.042/M).

## Erros

Falha/timeout do Jev ⇒ paleta degrada para fuzzy com aviso discreto.
A demo nunca trava.

## Testes

Vitest nos módulos puros: montagem da request Jev, parse/ordenação da
distribuição, fuzzy de comparação, cálculo de custo. UI verificada
manualmente no browser.

## Fora de escopo (hoje)

Pacote npm, streaming, telemetria, mobile, persistência.
