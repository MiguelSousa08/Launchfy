# LaunchFy

Site estático. Sem dependências, sem build, sem npm. São só ficheiros.

## Ver no teu computador

Abre o `index.html` com dois cliques. Funciona tudo menos a página 404
(essa só funciona depois de publicado).

## O que tens de mudar antes de publicar

São 4 coisas. Procura por `SUBSTITUIR` e `PREENCHER` nos ficheiros e
encontras todas.

### 1. Email — FEITO
Está `miguelcs.tech@gmail.com` em todo o site.

Uma sugestão para quando tiveres o domínio: um endereço tipo
`ola@launchfy.pt` passa melhor imagem a um cliente do que um Gmail. Na Vercel
configuras o reencaminhamento e continuas a receber tudo na mesma caixa.

### 2. Os teus dados fiscais — FALTA
Nas páginas `privacidade.html` e `termos.html`, e no rodapé do `index.html`,
diz "LaunchFy, Braga, Portugal". Falta o **NIF** e a **morada completa**
(rua e código postal).

Não são opcionais: a lei portuguesa e o RGPD obrigam a identificar quem presta
o serviço e quem é responsável pelos dados. Só "Braga" não chega. Procura pelos
comentários `<!-- PREENCHER` e mete-os antes de publicar.

### 3. Os preços
Estão só no `index.html`, na secção marcada com `PREÇÁRIO`.

| Plano     | Arranque | Mensal | Paga no início |
|-----------|----------|--------|----------------|
| Essencial | 490€     | 29€    | 519€           |
| Completo  | 890€     | 49€    | 939€           |

Se mudares, muda também o texto "Paga hoje X€" logo por baixo do botão.

### 4. Os links de pagamento
Estão `https://buy.stripe.com/SUBSTITUIR_ESSENCIAL` e `..._COMPLETO`.

## Criar os links de pagamento no Stripe

Faz isto uma vez por plano, em dashboard.stripe.com.

1. **Produtos → Adicionar produto**
   - Nome: `Manutenção Essencial`, preço `29€`, marca **Recorrente**, mensal
2. **Adicionar produto** outra vez
   - Nome: `Arranque Essencial`, preço `490€`, marca **Único** (one-time)
3. **Links de pagamento → Novo link**
   - Adiciona o produto recorrente
   - Clica **Adicionar outro produto** e escolhe o de arranque
   - Assim paga 519€ agora e 29€/mês a partir do mês seguinte
4. Nas opções do link:
   - **Recolher NIF**: liga (precisas para faturar)
   - **Recolher morada de faturação**: liga
   - **Após o pagamento**: *Redirecionar para uma página* →
     `https://launchfy.pt/obrigado.html`
5. Copia o link e cola no `index.html`
6. Repete para o Completo (890€ + 49€)

**MB WAY:** ativa em Definições → Métodos de pagamento.

## Publicar na Vercel

1. [vercel.com/new](https://vercel.com/new)
2. Arrasta a pasta `site` para lá
3. Dá ao projeto o nome **launchfy** (é isso que decide o endereço)
4. **Deploy**

O `vercel.json` já leva os cabeçalhos de segurança. Não mexas.

### Confirma o endereço que a Vercel te deu

O site está todo configurado para `https://launchfy.vercel.app`.

**Se a Vercel te der outro endereço** (acontece se o nome "launchfy" já
estiver ocupado por outra pessoa, e aí sai algo tipo `launchfy-a1b2.vercel.app`),
tens de o trocar em 6 sítios:

- `sitemap.xml` (3 linhas)
- `robots.txt` (1 linha)
- `index.html` (canonical e og:url)
- `privacidade.html` (canonical)
- `termos.html` (canonical)

Diz-me o endereço e eu troco tudo de uma vez.

### No Stripe

O redirecionamento depois do pagamento tem de apontar para
`https://launchfy.vercel.app/obrigado.html` (ou o endereço que te calhar).

### Quando comprares o domínio

Em **Settings → Domains** ligas o domínio novo, e depois trocamos os mesmos
6 sítios de `launchfy.vercel.app` para `launchfy.pt`.

## Animações que o site tem

| Onde | O quê |
|---|---|
| Ao abrir | Ecrã de arranque com logo e barra a encher |
| Hero | Grelha subtil que desvanece nas bordas |
| Título | Palavras que sobem uma a uma, últimas duas em gradiente |
| Badge | Ponto que pulsa |
| Números | Contam de 0 até ao valor quando entram no ecrã |
| Setores | Faixa infinita que pára quando passas o rato |
| Secções | Aparecem ao fazer scroll, em cascata |
| Cartões de preço | Inclinam e acendem para o lado do rato |
| Botões | Brilho que atravessa da esquerda para a direita |
| Passos | Caixa do número sobe e acende ao passar o rato |
| Monograma MS | Flutua devagar |
| FAQ | Cruz que roda e resposta que desliza |
| Topo | Barra de progresso do scroll com brilho |
| Botão topo | Aparece e desaparece com escala |

Tudo desliga automaticamente se a pessoa tiver "reduzir movimento" ligado
no telemóvel ou no computador.

## Ficheiros

```
index.html          página principal
obrigado.html       para onde o Stripe manda depois de pagar
404.html            página de erro
privacidade.html    política de privacidade
termos.html         termos e condições
sitemap.xml         mapa do site para o Google
robots.txt          instruções para o Google
vercel.json         cabeçalhos de segurança
assets/style.css    todo o aspeto e as animações
assets/main.js      pesquisa, contadores, scroll, cookies
assets/favicon.svg  ícone do separador
```

## O que ainda falta

- **Rever os textos legais com um jurista ou o teu contabilista.**
  Estão escritos com cuidado e adaptados a Portugal, mas não sou advogado.
- **Medição de visitas.** O banner de cookies está feito e a funcionar, mas
  não está ligado nenhum serviço. Mete o Plausible ou o Fathom dentro da
  função `comecarMedicao()` no `main.js`. Se nunca ligares nada, o mais
  honesto é tirar o banner.
- **Imagem de partilha (OG image).** Faz uma de 1200x630 e mete
  `<meta property="og:image" content="...">` no `index.html`.
- **Fotografia tua** na secção "Quem está do outro lado". Agora tem só o
  monograma MS. Uma foto real vende mais confiança.
- **Trabalhos reais.** Quando tiveres 3 ou 4 sites feitos, uma secção de
  portefólio com capturas reais é o que mais vai converter.

## Cores e tipos de letra

O fundo é um gradiente branco a passar para bege, fixo, que atravessa
todas as páginas.

| | |
|---|---|
| Branco (topo) | `#FFFFFF` |
| Areia clara | `#FBF6EE` |
| Areia | `#F4EADB` |
| Areia escura (rodapé) | `#EFE3D0` |
| Laranja queimado | `#AE4A15` |
| Vinho | `#8B2F4A` |
| Texto | `#221C15` |
| Texto suave | `#62574B` |
| Linhas | `#E6DAC8` |
| Títulos | Space Grotesk |
| Texto | Plus Jakarta Sans |

Estão todas no topo do `style.css`, em `:root`. Mudas lá e muda no site todo.
O gradiente do fundo está na regra `html { background: ... }`, logo a seguir.
