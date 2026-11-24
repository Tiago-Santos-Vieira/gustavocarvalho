/* Gustavo Carvalho: movimento e interações.
   Sem GSAP ou com "menos movimento" ligado, tudo aparece parado e funcionando. */
(function () {
  'use strict';
  var doc = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduz = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var movimento = !!(window.gsap && window.ScrollTrigger && window.SplitText && window.Lenis) && !reduz;
  if (!movimento) doc.classList.add('sem-movimento');
  var lenis = null;

  /* Menu fica sólido depois do topo */
  var nav = $('[data-nav]');
  function navSolido() { nav.classList.toggle('solido', scrollY > 60); }
  addEventListener('scroll', navSolido, { passive: true }); navSolido();

  /* Âncoras com rolagem suave, descontando o menu */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return;
    var id = a.getAttribute('href'); if (id.length < 2) return;
    var alvo = document.getElementById(id.slice(1)); if (!alvo) return;
    e.preventDefault();
    var foca = function () { alvo.setAttribute('tabindex', '-1'); alvo.focus({ preventScroll: true }); };
    if (lenis) lenis.scrollTo(alvo, { offset: id === '#inicio' ? 0 : -66, duration: 1.4, onComplete: foca });
    else { alvo.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' }); foca(); }
  });

  if (!movimento) return;

  /* ================= Só com movimento ================= */
  gsap.registerPlugin(ScrollTrigger, SplitText);
  lenis = new Lenis({ lerp: .1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
  gsap.ticker.lagSmoothing(0);

  /* Títulos: divididos em linhas que sobem de dentro de uma máscara */
  var linhas = {};
  $$('[data-linhas]').forEach(function (t, i) {
    linhas[i] = SplitText.create(t, { type: 'lines', mask: 'lines', linesClass: 'linha' });
    t.dataset.idx = i;
  });

  /* Números contam até o valor */
  function conta(el) {
    var alvo = +el.dataset.conta, o = { v: 0 };
    gsap.to(o, { v: alvo, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v); } });
  }

  /* Entrada do topo */
  var h1 = $('.topo_titulo');
  var entrada = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' }, onComplete: function () { doc.classList.add('entrou'); } })
    .fromTo('.topo_nome span', { opacity: 0, yPercent: 40 }, { opacity: 1, yPercent: 0, duration: 1.6, stagger: .12 }, 0)
    .fromTo('.topo_foto', { opacity: 0, y: 80, scale: 1.05 }, { opacity: 1, y: 0, scale: 1, duration: 1.6, transformOrigin: '50% 100%' }, .2)
    .fromTo(linhas[h1.dataset.idx].lines, { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: .1 }, .45)
    .fromTo('.topo [data-entra]', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 1.1, stagger: .08 }, .65)
    .add(function () { $$('[data-conta]').forEach(conta); }, 1);

  /* Abertura: barra verde enche, cortina sobe em curva */
  var abertura = $('.abertura');
  if (doc.classList.contains('sem-abertura') || !abertura) entrada.play();
  else {
    try { sessionStorage.setItem('gc-abertura', '1'); } catch (e) {}
    lenis.stop();
    gsap.timeline()
      .from('.abertura_logo', { opacity: 0, y: 16, duration: .6, ease: 'power2.out' })
      .to('.abertura_barra i', { scaleX: 1, duration: .9, ease: 'power2.inOut' }, .2)
      .to(['.abertura_logo', '.abertura_barra'], { opacity: 0, y: -12, duration: .35, ease: 'power2.in' }, 1.15)
      .to(abertura, { yPercent: -100, borderBottomLeftRadius: '50% 18vh', borderBottomRightRadius: '50% 18vh', duration: 1.05, ease: 'expo.inOut' }, 1.25)
      .add(function () { entrada.play(); }, 1.6)
      .add(function () { abertura.style.display = 'none'; lenis.start(); });
  }

  /* Topo: o nome gigante sobe mais devagar que a foto (profundidade) */
  gsap.to('.topo_nome', { yPercent: 30, ease: 'none', scrollTrigger: { trigger: '.topo', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.topo_foto', { y: -60, ease: 'none', scrollTrigger: { trigger: '.topo', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.numeros', { y: -110, ease: 'none', scrollTrigger: { trigger: '.topo', start: 'top top', end: 'bottom top', scrub: true } });

  /* A faixa verde acelera e inclina com a velocidade da rolagem */
  var faixa = $('.faixa_trilho');
  if (faixa) {
    var skew = gsap.quickTo(faixa, 'skewX', { duration: .5, ease: 'power3.out' });
    lenis.on('scroll', function (l) { skew(gsap.utils.clamp(-8, 8, l.velocity * -.25)); });
  }

  /* Títulos das seções */
  $$('[data-linhas]').forEach(function (t) {
    if (t === h1) return;
    gsap.fromTo(linhas[t.dataset.idx].lines, { yPercent: 110 }, { yPercent: 0, duration: 1.2, stagger: .1, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 85%', once: true } });
  });
  $$('.secao .rotulo, .cabeca_txt, .cabeca_lado .btn, .final .rotulo, .final_txt, .final_acoes').forEach(function (el) {
    gsap.from(el, { opacity: 0, y: 24, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
  });

  /* Cartões entram em sequência */
  ['.pilares', '.planos', '.resultados', '.temas'].forEach(function (s) {
    var g = $(s); if (!g) return;
    gsap.from(g.children, { opacity: 0, y: 60, duration: 1.1, stagger: .09, ease: 'expo.out', scrollTrigger: { trigger: g, start: 'top 82%', once: true } });
  });

  /* Resultados: a foto do "depois" passa como uma cortina */
  $$('.resultado').forEach(function (r, i) {
    gsap.fromTo($('.depois', r), { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.2, delay: .35 + i * .09, ease: 'power3.inOut', scrollTrigger: { trigger: r, start: 'top 80%', once: true } });
  });

  /* Palestras: a foto se abre de baixo para cima */
  $$('.tema_foto').forEach(function (f, i) {
    gsap.fromTo(f, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.2, delay: i * .1, ease: 'expo.inOut', scrollTrigger: { trigger: f, start: 'top 85%', once: true } });
    gsap.fromTo($('img', f), { scale: 1.25 }, { scale: 1, duration: 1.6, delay: i * .1, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 85%', once: true } });
  });

  /* Chamada final: o brilho verde cresce com a rolagem */
  gsap.fromTo('.final_fundo', { scale: .7, opacity: .4 }, { scale: 1.15, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.final', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
  addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
