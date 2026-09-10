/* LaunchFy. Sem dependências. */
(function () {
  "use strict";

  var calmo = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fino = window.matchMedia("(max-width: 52rem)").matches;

  /* ------------------------------------------------------------ arranque */

  var boot = document.querySelector("[data-boot]");
  if (boot) {
    if (calmo) {
      boot.classList.add("done");
    } else {
      setTimeout(function () { boot.classList.add("done"); }, 1600);
    }
  }

  /* ------------------------------------- partir o título em palavras */

  var titulo = document.querySelector("[data-split]");
  if (titulo && !calmo) {
    var palavras = titulo.textContent.trim().split(/\s+/);
    var destaque = 2; /* as duas últimas palavras levam gradiente */
    titulo.textContent = "";

    palavras.forEach(function (palavra, i) {
      var span = document.createElement("span");
      span.className = "w" + (i >= palavras.length - destaque ? " grad" : "");
      span.style.setProperty("--i", i);
      span.textContent = palavra;
      titulo.appendChild(span);
      if (i < palavras.length - 1) titulo.appendChild(document.createTextNode(" "));
    });
  }

  /* ------------------------------- barra de progresso, nav e botão topo */

  var nav = document.querySelector("[data-nav]");
  var barra = document.querySelector("[data-progress]");
  var topo = document.querySelector("[data-top]");
  var pendente = false;

  function aoScroll() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var y = window.scrollY;

    if (barra) barra.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    if (nav) nav.classList.toggle("stuck", y > 20);

    if (topo) {
      var mostrar = y > window.innerHeight * 0.85;
      if (mostrar && topo.hidden) {
        topo.hidden = false;
        requestAnimationFrame(function () { topo.classList.add("show"); });
      } else if (!mostrar && !topo.hidden) {
        topo.classList.remove("show");
        setTimeout(function () { if (window.scrollY <= window.innerHeight * 0.85) topo.hidden = true; }, 300);
      }
    }
    pendente = false;
  }

  window.addEventListener("scroll", function () {
    if (!pendente) { pendente = true; requestAnimationFrame(aoScroll); }
  }, { passive: true });
  window.addEventListener("resize", aoScroll, { passive: true });
  aoScroll();

  if (topo) {
    topo.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: calmo ? "auto" : "smooth" });
    });
  }

  /* -------------------------------------------------- revelar no scroll */

  var reveals = document.querySelectorAll("[data-reveal]");

  if (calmo || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        var atraso = parseInt(e.target.dataset.delay || "0", 10);
        setTimeout(function () { e.target.classList.add("in"); }, atraso);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    reveals.forEach(function (el) { obs.observe(el); });
  }

  /* --------------------------------------------------- números a contar */

  var contadores = document.querySelectorAll("[data-count]");

  function contar(el) {
    var alvo = parseInt(el.dataset.count, 10);
    var sufixo = el.dataset.suffix || "";
    var prefixo = el.dataset.prefix || "";
    var zero = el.dataset.zero;

    var final = prefixo + alvo + sufixo;

    if (zero) { el.textContent = zero; return; }
    if (calmo) { el.textContent = final; return; }

    var inicio = performance.now();
    var dur = 1400;
    var feito = false;

    function terminar() {
      if (feito) return;
      feito = true;
      el.textContent = final;
    }

    /* O requestAnimationFrame suspende com o separador em segundo plano.
       Sem esta rede de segurança o número ficava congelado a meio. */
    setTimeout(terminar, dur + 150);

    (function passo(agora) {
      if (feito) return;
      var t = Math.min((agora - inicio) / dur, 1);
      if (t >= 1) { terminar(); return; }
      var suave = 1 - Math.pow(1 - t, 3);
      el.textContent = prefixo + Math.round(alvo * suave) + sufixo;
      requestAnimationFrame(passo);
    })(inicio);
  }

  if (contadores.length) {
    if (!("IntersectionObserver" in window)) {
      contadores.forEach(contar);
    } else {
      var obsN = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          contar(e.target);
          obsN.unobserve(e.target);
        });
      }, { threshold: 0.6 });
      contadores.forEach(function (el) { obsN.observe(el); });
    }
  }

  /* -------------------------------------------------- marquee sem fim */

  var faixa = document.querySelector("[data-marquee] .track");
  if (faixa) faixa.append.apply(faixa, Array.from(faixa.children).map(function (n) {
    var c = n.cloneNode(true);
    c.setAttribute("aria-hidden", "true");
    return c;
  }));

  /* ------------------------------------------ cartões que seguem o rato */

  document.querySelectorAll("[data-tilt]").forEach(function (card) {
    if (calmo || fino) return;

    card.addEventListener("mousemove", function (e) {
      var r = card.getBoundingClientRect();
      var x = e.clientX - r.left;
      var y = e.clientY - r.top;

      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");

      var rx = ((y / r.height) - 0.5) * -4;
      var ry = ((x / r.width) - 0.5) * 4;
      card.style.transform =
        "perspective(900px) rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg) translateY(-4px)";
    });

    card.addEventListener("mouseleave", function () {
      card.style.transform = "";
    });
  });

  /* ------------------------------------------------------ procurar */

  var caixa = document.querySelector("[data-search]");
  var campo = document.querySelector("[data-search-input]");
  var saida = document.querySelector("[data-search-out]");
  var abrir = document.querySelectorAll("[data-search-open]");
  var indice = [];

  function construirIndice() {
    document.querySelectorAll("main h2, main h3, main summary").forEach(function (no) {
      var titulo = (no.textContent || "").trim();
      if (!titulo) return;

      var corpo = "";
      var cartao = no.closest(".card");

      if (no.tagName === "SUMMARY") {
        var resp = no.parentElement.querySelector(".ans");
        corpo = resp ? (resp.textContent || "").trim() : "";
      } else if (cartao) {
        var para = cartao.querySelector(".card-top p");
        var lista = cartao.querySelector(".feat");
        corpo = (para ? para.textContent.trim() + " " : "") +
                (lista ? lista.textContent.replace(/\s+/g, " ").trim() : "");
      } else {
        var seg = no.nextElementSibling;
        var saltos = 0;
        while (seg && saltos < 4 && corpo.length < 170) {
          if (seg.tagName === "P" || seg.classList.contains("two-body")) {
            corpo += " " + (seg.textContent || "").trim();
          }
          seg = seg.nextElementSibling;
          saltos++;
        }
      }

      /* A eyebrow acima do título costuma ter a palavra que a pessoa procura
         ("Preços", "O processo"), mas não aparece no h2. Entra na pesquisa. */
      var sobrancelha = "";
      var antes = no.previousElementSibling;
      if (antes && antes.classList.contains("eyebrow")) {
        sobrancelha = (antes.textContent || "").trim();
      }

      var sec = no.closest("section[id]");
      indice.push({
        titulo: titulo,
        corpo: corpo.trim(),
        destino: sec ? "#" + sec.id : "",
        no: no,
        palha: sobrancelha + " " + titulo + " " + corpo
      });
    });

    [
      {
        titulo: "Política de privacidade",
        corpo: "Que dados recolhemos, para que servem, quanto tempo ficam guardados, RGPD, cookies, medição de visitas, os seus direitos, CNPD.",
        url: "privacidade.html"
      },
      {
        titulo: "Termos e condições",
        corpo: "Condições do serviço, manutenção, prazos, pagamentos, faturação, IVA, cancelamento, reembolso, propriedade do site, domínio, responsabilidade.",
        url: "termos.html"
      }
    ].forEach(function (pag) {
      indice.push({
        titulo: pag.titulo,
        corpo: pag.corpo,
        destino: pag.url,
        no: null,
        palha: pag.titulo + " " + pag.corpo
      });
    });
  }

  function limpar(s) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  }

  function desenhar(termo) {
    if (!saida) return;
    saida.textContent = "";

    var agulha = limpar(termo.trim());

    if (agulha.length < 2) {
      var dica = document.createElement("p");
      dica.className = "find-none";
      dica.textContent = "Escreva pelo menos duas letras. Por exemplo: preço, cancelar, domínio.";
      saida.appendChild(dica);
      return;
    }

    var achados = indice.filter(function (item) {
      return limpar(item.palha).indexOf(agulha) !== -1;
    }).slice(0, 8);

    if (!achados.length) {
      var nada = document.createElement("p");
      nada.className = "find-none";
      nada.textContent = "Nada encontrado para " + termo.trim() + ". Escreva para miguelcs.tech@gmail.com e respondemos.";
      saida.appendChild(nada);
      return;
    }

    achados.forEach(function (item) {
      var a = document.createElement("a");
      a.className = "find-hit";
      a.href = item.destino || "#conteudo";

      var t = document.createElement("strong");
      t.textContent = item.titulo;
      a.appendChild(t);

      if (item.corpo) {
        var b = document.createElement("span");
        b.textContent = item.corpo.slice(0, 115) + (item.corpo.length > 115 ? "..." : "");
        a.appendChild(b);
      }

      a.addEventListener("click", function () {
        if (!item.no) return; /* outra página: deixa o link seguir */

        if (item.no.tagName === "SUMMARY") item.no.parentElement.open = true;
        caixa.close();
        setTimeout(function () {
          item.no.scrollIntoView({ block: "center", behavior: calmo ? "auto" : "smooth" });
        }, 60);
      });

      saida.appendChild(a);
    });
  }

  if (caixa && campo && saida && abrir.length) {
    construirIndice();

    abrir.forEach(function (btn) {
      btn.addEventListener("click", function () {
        caixa.showModal();
        campo.value = "";
        desenhar("");
        campo.focus();
      });
    });

    campo.addEventListener("input", function () { desenhar(campo.value); });

    document.addEventListener("keydown", function (e) {
      var aEscrever = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if (e.key === "/" && !aEscrever && !caixa.open) {
        e.preventDefault();
        caixa.showModal();
        desenhar("");
        campo.focus();
      }
    });
  }

  /* ------------------------------------------------------------ cookies */

  var CHAVE = "launchfy-medicao";
  var aviso = document.querySelector("[data-cookies]");

  function ler() {
    try { return localStorage.getItem(CHAVE); } catch (e) { return null; }
  }
  function guardar(v) {
    try { localStorage.setItem(CHAVE, v); } catch (e) { /* modo privado */ }
  }
  function comecarMedicao() {
    /* Só corre se a pessoa aceitar.
       Substituir por Plausible, Fathom ou outro que respeite privacidade. */
  }

  if (aviso) {
    var escolha = ler();

    if (escolha === "sim") {
      comecarMedicao();
    } else if (escolha !== "nao") {
      aviso.hidden = false;
    }

    var sim = aviso.querySelector("[data-cookies-yes]");
    var nao = aviso.querySelector("[data-cookies-no]");

    if (sim) sim.addEventListener("click", function () {
      guardar("sim"); aviso.hidden = true; comecarMedicao();
    });
    if (nao) nao.addEventListener("click", function () {
      guardar("nao"); aviso.hidden = true;
    });
  }
})();
