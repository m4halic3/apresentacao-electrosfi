/* =========================================================
   Efeitos de onda da apresentação do ElectrosFI
   ---------------------------------------------------------
   Cada <canvas> dos slides ganha uma animação pela classe:
     .ondas-fundo     ondas coloridas da capa e do encerramento
     .sim-guia        onda presa num guia de onda reto (FDTD simplificado)
     .malha-refina    malha ficando cada vez mais fina
     .sim-servidores  onda atravessando três servidores (ideia do MPI)
   Só o slide que está na tela é animado, para não pesar o computador.
   As simulações resolvem a equação da onda em 2D numa grade pequena.
   São ilustrações didáticas, não resultados do ElectrosFI.
   ========================================================= */
(function () {
  "use strict";

  var COR = {
    fundo: [8, 32, 26],
    positivo: [197, 240, 107], // lima
    negativo: [34, 184, 166],  // verde-azulado
    claro: [241, 245, 238]
  };

  // Converte o valor do campo (-1 a 1) numa cor verde
  function pintar(dados, q, v) {
    if (v > 1) v = 1;
    if (v < -1) v = -1;
    var f = COR.fundo, alvo = v > 0 ? COR.positivo : COR.negativo, a = Math.abs(v);
    dados[q] = f[0] + (alvo[0] - f[0]) * a;
    dados[q + 1] = f[1] + (alvo[1] - f[1]) * a;
    dados[q + 2] = f[2] + (alvo[2] - f[2]) * a;
    dados[q + 3] = 255;
  }

  // Grade simples da equação da onda, com bordas que absorvem (lembra a PML)
  function criarGrade(W, H, borda, forca) {
    forca = forca || 0.12;
    var N = W * H, g = {
      W: W, H: H,
      u: new Float32Array(N), p: new Float32Array(N), n: new Float32Array(N),
      k2: new Float32Array(N), amortece: new Float32Array(N)
    };
    for (var y = 0; y < H; y++) {
      for (var x = 0; x < W; x++) {
        var i = y * W + x, d = Math.min(x, y, W - 1 - x, H - 1 - y), s = 1;
        if (d < borda) { var t = (borda - d) / borda; s = 1 - forca * t * t; }
        g.amortece[i] = s;
        g.k2[i] = 0.24;
      }
    }
    g.passo = function () {
      var u = g.u, p = g.p, n = g.n, k2 = g.k2, am = g.amortece;
      for (var yy = 1; yy < H - 1; yy++) {
        for (var xx = 1; xx < W - 1; xx++) {
          var j = yy * W + xx;
          n[j] = (2 * u[j] - p[j] + k2[j] * (u[j - 1] + u[j + 1] + u[j - W] + u[j + W] - 4 * u[j])) * am[j];
        }
      }
      g.p = u; g.u = n; g.n = p;
    };
    return g;
  }

  /* ---------- Ondas de fundo (capa e encerramento) ---------- */
  function ondasFundo(canvas) {
    var ctx = canvas.getContext("2d"), t = 0;
    var linhas = [
      ["#3DDC97", 1.0, 0.95, 6], ["#C5F06B", 1.5, 0.8, 4], ["#22B8A6", 2.3, 0.5, 3],
      ["#A7C4B5", 0.7, 0.35, 3], ["#C5F06B", 3.1, 0.3, 2]
    ];
    return function () {
      var w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      linhas.forEach(function (l, i) {
        ctx.beginPath();
        ctx.strokeStyle = l[0]; ctx.globalAlpha = l[2]; ctx.lineWidth = l[3];
        for (var X = 0; X <= w; X += 5) {
          var env = Math.sin(Math.PI * X / w);
          var Y = h * 0.76 + Math.sin(X / w * Math.PI * 4 * l[1] - t * (1 + i * 0.25)) * h * 0.1 * env * (1 - i * 0.08);
          if (X === 0) ctx.moveTo(X, Y); else ctx.lineTo(X, Y);
        }
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      t += 0.035;
    };
  }

  /* ---------- Guia de onda reto ---------- */
  // O núcleo (faixa clara) é feito de um material "mais lento", que prende a onda,
  // como no tutorial do guia de onda reto do Meep usado para validar o ElectrosFI.
  function simGuia(canvas) {
    var W = canvas.width, H = canvas.height, ctx = canvas.getContext("2d");
    var BORDA = 16, LARGURA = 10, FREQ = 0.22, ESCALA = 0.22;
    var img = ctx.createImageData(W, H), g = criarGrade(W, H, BORDA, 0.3), t = 0;
    var topo = Math.round(H / 2 - LARGURA / 2), base = topo + LARGURA, meio = (topo + base - 1) / 2;
    var nucleo = new Uint8Array(W * H), perfil = [];
    for (var y = topo; y < base; y++) {
      perfil.push(Math.pow(Math.cos((y - meio) / (LARGURA / 2) * Math.PI / 2), 2));
      for (var x = 0; x < W; x++) { nucleo[y * W + x] = 1; g.k2[y * W + x] = 0.12; }
    }
    function avancar() {
      g.passo();
      var rampa = Math.min(1, t / 150);
      for (var yy = topo; yy < base; yy++) {
        g.u[yy * W + BORDA + 2] += 0.35 * rampa * perfil[yy - topo] * Math.sin(t * FREQ);
      }
      t++;
    }
    // Aquece a simulação antes de aparecer, para a onda já estar presa no guia
    for (var aq = 0; aq < 1200; aq++) avancar();
    return function () {
      for (var k = 0; k < 3; k++) avancar();
      var d = img.data;
      for (var i = 0; i < W * H; i++) {
        var q = i * 4;
        pintar(d, q, g.u[i] * ESCALA);
        if (nucleo[i]) {
          d[q] = d[q] * 0.85 + COR.claro[0] * 0.15;
          d[q + 1] = d[q + 1] * 0.85 + COR.claro[1] * 0.15;
          d[q + 2] = d[q + 2] * 0.85 + COR.claro[2] * 0.15;
        }
      }
      ctx.putImageData(img, 0, 0);
    };
  }

  /* ---------- Malha ficando mais fina ---------- */
  function malhaRefina(canvas) {
    var ctx = canvas.getContext("2d"), quadro = 0;
    var niveis = [["Malha grossa", 6], ["Malha média", 12], ["Malha fina", 24], ["Malha bem fina", 48]];
    return function () {
      var w = canvas.width, h = canvas.height;
      var nivel = niveis[Math.floor(quadro / 120) % niveis.length], linhas = nivel[1];
      var lado = h / linhas, colunas = Math.ceil(w / lado);
      var cx = w / 2, cy = h / 2, raio = h * 0.36;
      ctx.fillStyle = "#08201A"; ctx.fillRect(0, 0, w, h);
      for (var r = 0; r < linhas; r++) {
        for (var c = 0; c < colunas; c++) {
          var x = c * lado, y = r * lado;
          var dx = x + lado / 2 - cx, dy = y + lado / 2 - cy;
          if (dx * dx + dy * dy <= raio * raio) { ctx.fillStyle = "#3DDC97"; ctx.fillRect(x, y, lado, lado); }
        }
      }
      ctx.strokeStyle = "rgba(197, 240, 107, 0.35)"; ctx.lineWidth = 1;
      ctx.beginPath();
      for (var i = 0; i <= colunas; i++) { ctx.moveTo(i * lado, 0); ctx.lineTo(i * lado, h); }
      for (var j = 0; j <= linhas; j++) { ctx.moveTo(0, j * lado); ctx.lineTo(w, j * lado); }
      ctx.stroke();
      ctx.strokeStyle = "#F1F5EE"; ctx.setLineDash([10, 8]); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, raio, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#0B2B22"; ctx.fillRect(16, 16, 300, 52);
      ctx.fillStyle = "#C5F06B"; ctx.font = "bold 28px 'DM Sans', Arial, sans-serif";
      ctx.fillText(nivel[0], 32, 52);
      quadro++;
    };
  }

  /* ---------- Onda atravessando três servidores ---------- */
  function simServidores(canvas) {
    var W = 96, H = 54, fora = document.createElement("canvas");
    fora.width = W; fora.height = H;
    var fctx = fora.getContext("2d"), img = fctx.createImageData(W, H);
    var ctx = canvas.getContext("2d"), g = criarGrade(W, H, 6), t = 0;
    var cores = ["#3DDC97", "#C5F06B", "#A7C4B5"];
    function avancar() { g.passo(); g.u[27 * W + 14] = Math.sin(t * 0.3) * 2; t++; }
    for (var aq = 0; aq < 120; aq++) avancar();
    return function () {
      for (var k = 0; k < 2; k++) avancar();
      var d = img.data;
      for (var i = 0; i < W * H; i++) pintar(d, i * 4, g.u[i] * 1.6);
      fctx.putImageData(img, 0, 0);
      var w = canvas.width, h = canvas.height;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(fora, 0, 0, w, h);
      for (var z = 0; z < 3; z++) {
        var x0 = z * w / 3;
        ctx.globalAlpha = 0.12; ctx.fillStyle = cores[z]; ctx.fillRect(x0, 0, w / 3, h); ctx.globalAlpha = 1;
        ctx.fillStyle = "#0B2B22"; ctx.fillRect(x0 + 14, 14, 196, 46);
        ctx.fillStyle = cores[z]; ctx.font = "bold 26px 'DM Sans', Arial, sans-serif";
        ctx.fillText("Servidor " + (z + 1), x0 + 28, 46);
      }
      ctx.setLineDash([12, 10]); ctx.lineWidth = 3; ctx.strokeStyle = "#F1F5EE";
      for (var b = 1; b < 3; b++) { ctx.beginPath(); ctx.moveTo(b * w / 3, 0); ctx.lineTo(b * w / 3, h); ctx.stroke(); }
      ctx.setLineDash([]);
      var alfa = 0.55 + 0.45 * Math.sin(t * 0.08);
      for (var m = 1; m < 3; m++) {
        var X = m * w / 3;
        ctx.globalAlpha = alfa; ctx.fillStyle = "#F1F5EE"; ctx.fillRect(X - 44, h - 62, 88, 40); ctx.globalAlpha = 1;
        ctx.fillStyle = "#0B2B22"; ctx.font = "bold 24px 'DM Sans', Arial, sans-serif"; ctx.fillText("MPI", X - 24, h - 33);
      }
    };
  }

  var FABRICAS = {
    "ondas-fundo": ondasFundo,
    "sim-guia": simGuia,
    "malha-refina": malhaRefina,
    "sim-servidores": simServidores
  };

  window.Ondas = {
    iniciar: function (deck) {
      var animacoes = [];
      Object.keys(FABRICAS).forEach(function (classe) {
        document.querySelectorAll("canvas." + classe).forEach(function (c) {
          animacoes.push({ canvas: c, desenhar: FABRICAS[classe](c) });
        });
      });
      function quadro() {
        var atual = deck.getCurrentSlide();
        animacoes.forEach(function (a) {
          if (atual && atual.contains(a.canvas)) a.desenhar();
        });
        requestAnimationFrame(quadro);
      }
      // Desenha um quadro de cada animação para que nenhum canvas comece vazio
      animacoes.forEach(function (a) { a.desenhar(); });
      requestAnimationFrame(quadro);
    }
  };
})();
