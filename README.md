# Site Gustavo Carvalho | Personal Trainer e Nutricionista

Refeito em 24/11/2026 no layout da referência que o Tiago mandou (site "Marcus Reid"):
- Topo escuro com o nome gigante atrás da foto e os números em cartões.
- Cartões numerados com um em destaque e cartões de conteúdo com foto.

O vermelho da referência virou o verde do Gustavo (`#00c853`). As transições seguem o estilo do site da Laysa (GSAP + Lenis).

- Site atual no ar: https://gustavocarvalhotrainer.com/ (repo GitHub `Tiago-Santos-Vieira/gustavocarvalho`, um `index.html` com Tailwind).
- O conteúdo, as fotos, os antes e depois e os links vieram desse repositório; os originais ficam em `assets/originais/`.

## Seções

1. **Abertura:** logo e barra verde; a cortina sobe em curva (só na primeira visita da sessão).
2. **Topo:** "Método sem achismo", com "GUSTAVO CARVALHO" gigante atrás da foto recortada (`npx hyperframes remove-background`). Os cartões "10+ anos" e "400+ pessoas" contam até o valor.
3. **Faixa verde de formação:** inclina com a velocidade da rolagem.
4. **Método:** os 3 pilares.
5. **Planos:** 4 cartões. Consultoria online, Personal presencial (em destaque, "Mais procurado"), Palestras e Área de Membros.
6. **Resultados:** os 4 antes e depois; a foto do "depois" entra como cortina.
7. **Palestras:** 3 cartões com foto.
8. **Chamada final** e rodapé.

Ver no computador: servidor `gustavo-site`, porta 4600, no `.claude/launch.json` da Área de Trabalho.

## Pendências

- [ ] Número do **CRN** e do **CREF**, se ele quiser mostrar (o site antigo não tinha).
- [ ] Confirmar que os alunos dos antes e depois autorizaram o uso das fotos. O CFN tem regras para imagem de antes e depois em divulgação de nutricionista.
- [ ] Publicar: trocar o `index.html` do repositório `gustavocarvalho` por esta pasta (sem `assets/originais/`) e enviar; guardar o site antigo num ramo `site-antigo`, como foi feito com a Laysa.
