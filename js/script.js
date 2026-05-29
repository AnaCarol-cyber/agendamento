
let imagens = [];
let imagemAtual = 0;

document.addEventListener("DOMContentLoaded", () => {
  imagens = document.querySelectorAll(".carousel-track img");

  // animação ao rolar
  const elementos = document.querySelectorAll(".animar");

  function animarScroll() {
    const alturaTela = window.innerHeight * 0.85;

    elementos.forEach(el => {
      const topo = el.getBoundingClientRect().top;
      if (topo < alturaTela) {
        el.classList.add("ativo");
      }
    });
  }

  window.addEventListener("scroll", animarScroll);
  animarScroll();
});

/* ===== MODAL ===== */
function abrirImagem(img) {
  const modal = document.getElementById("modalImagem");
  const modalImg = document.getElementById("imagemModal");

  imagemAtual = Array.from(imagens).indexOf(img);
  modal.style.display = "flex";
  modalImg.src = img.src;

  document.querySelector(".carousel-track").style.animationPlayState = "paused";
}

function fecharImagem() {
  document.getElementById("modalImagem").style.display = "none";
  document.querySelector(".carousel-track").style.animationPlayState = "running";
}

function proximaImagem() {
  imagemAtual = (imagemAtual + 1) % imagens.length;
  document.getElementById("imagemModal").src = imagens[imagemAtual].src;
}

function imagemAnterior() {
  imagemAtual = (imagemAtual - 1 + imagens.length) % imagens.length;
  document.getElementById("imagemModal").src = imagens[imagemAtual].src;
}

/* ===== TECLADO (PC) ===== */
document.addEventListener("keydown", e => {
  const modal = document.getElementById("modalImagem");
  if (modal.style.display !== "flex") return;

  if (e.key === "ArrowRight") proximaImagem();
  if (e.key === "ArrowLeft") imagemAnterior();
  if (e.key === "Escape") fecharImagem();
});