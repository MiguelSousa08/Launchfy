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
Estão só no `index.html`, na secção marcada com `PREÇÁRIO`. São dois cartões
e um único botão por baixo.

| O quê          | Quanto | Quando          |
|----------------|--------|-----------------|
| Criação do site| 250€   | uma vez         |
| Manutenção     | 29,99€ | todos os meses  |
| **Paga hoje**  | **279,99€** | criação + 1.º mês |

Se mudares os valores, muda em 3 sítios: os dois cartões e o total de 279,99€
na nota por baixo do botão.

### 4. O link de pagamento
Está `https://buy.stripe.com/SUBSTITUIR_LINK` no `index.html`. É só um.

## Criar o link de pagamento no Stripe

Um único link que cobra as duas coisas de uma vez. Em dashboard.stripe.com:

1. **Produtos → Adicionar produto**
   - Nome: `Manutenção do site`, preço `29,99€`, marca **Recorrente**, mensal
2. **Adicionar produto** outra vez
   - Nome: `Criação do site`, preço `250€`, marca **Único** (one-time)
3. **Links de pagamento → Novo link**
   - Adiciona o produto recorrente (`Manutenção do site`)
   - Clica **Adicionar outro produto** e escolhe a criação (250€)
   - Assim o cliente paga 279,99€ agora e 29,99€/mês a partir do mês seguinte
4. Nas opções do link:
   - **Recolher NIF**: liga (precisas para faturar)
   - **Recolher morada de faturação**: liga
   - **Após o pagamento**: *Redirecionar para uma página* →
     `https://launchfy-zeta.vercel.app/obrigado.html`
5. Copia o link e cola no `index.html`, no sítio do `SUBSTITUIR_LINK`

**MB WAY e Multibanco não servem aqui.** A Stripe não os deixa cobrar a
mensalidade automaticamente, por isso o site diz que aceitas cartão.

## Vercel

O site está no ar em **https://launchfy-zeta.vercel.app**

O `vercel.json` leva os cabeçalhos de segurança. Não mexas.

### Publicar uma alteração

Repete o mesmo: [vercel.com/new](https://vercel.com/new) e arrasta a pasta,
ou liga o projeto a um repositório do GitHub e a partir daí basta fazer
`git push`.

### Quando comprares o domínio

Em **Settings → Domains** ligas o domínio novo. Depois é preciso trocar
`launchfy-zeta.vercel.app` por `launchfy.pt` em 6 sítios:

- `sitemap.xml` (3 linhas)
- `robots.txt` (1 linha)
- `index.html` (canonical e og:url)
- `privacidade.html` (canonical)
- `termos.html` (canonical)

E ainda o redirecionamento no Stripe. Diz-me e eu troco tudo de uma vez.

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
assets/og.png       imagem que aparece ao partilhar o link (WhatsApp, Facebook)
```

## O que ainda falta

- **Rever os textos legais com um jurista ou o teu contabilista.**
  Estão escritos com cuidado e adaptados a Portugal, mas não sou advogado.
- **Medição de visitas.** O banner de cookies está feito e a funcionar, mas
  não está ligado nenhum serviço. Mete o Plausible ou o Fathom dentro da
  função `comecarMedicao()` no `main.js`. Se nunca ligares nada, o mais
  honesto é tirar o banner.
- **Trabalhos reais.** Quando tiveres 3 ou 4 sites feitos, uma secção de
  portefólio com capturas reais é o que mais vai converter.

## Sempre que mudares o style.css ou o main.js

Nos ficheiros HTML, os links para o CSS e o JS terminam em `?v=3`:

```
assets/style.css?v=3
assets/main.js?v=3
```

Quando alterares um desses dois ficheiros, sobe o número em **todos os HTML**
(`?v=4`, depois `?v=5`...). Isso obriga o browser de quem já visitou o site a
ir buscar a versão nova em vez de usar a que tem guardada.

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
