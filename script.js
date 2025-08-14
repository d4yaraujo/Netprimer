document.addEventListener("DOMContentLoaded", function() {
  const menuToggle = document.getElementById("menu-toggle");
  const navItens = document.getElementById("nav-itens");
  const links = navItens.querySelectorAll("a");

  // Abrir/fechar menu ao clicar no toggle
  menuToggle.addEventListener("click", function(e) {
    e.stopPropagation(); // evita que o clique no toggle feche o menu imediatamente
    navItens.classList.toggle("active");

    if (navItens.classList.contains("active")) {
      menuToggle.classList.add("hidden");
    } else {
      menuToggle.classList.remove("hidden");
    }
  });

  // Fechar menu ao clicar em qualquer link
  links.forEach(link => {
    link.addEventListener("click", function() {
      navItens.classList.remove("active");
      menuToggle.classList.remove("hidden");
    });
  });

  // Fechar menu ao clicar fora do menu
  document.addEventListener("click", function(e) {
    if (navItens.classList.contains("active")) {
      // Se o clique não for no menu nem no toggle
      if (!navItens.contains(e.target) && !menuToggle.contains(e.target)) {
        navItens.classList.remove("active");
        menuToggle.classList.remove("hidden");
      }
    }
  });
});
const track = document.querySelector('.carousel-track'); // imagens lado a lado
const items = document.querySelectorAll('.carousel-item'); // cada slide
const prev = document.querySelector('.carousel-button.prev'); // botão anterior
const next = document.querySelector('.carousel-button.next'); // botão próximo
const dots = document.querySelectorAll('.carousel-nav input'); // indicadores (radios)

let current = 0; // slide atual
let isDragging = false;
let startX = 0;

// Define duração da transição para deixar a troca mais suave
const transitionDuration = '0.6s';

function updateCarousel(index) {
  if (!track || items.length === 0) return;

  items.forEach((item) => {
    item.querySelectorAll('.animacao-texto').forEach((el) => {
      el.classList.remove('animar');
      void el.offsetWidth; // força reflow para resetar animação
    });
  });

  const newIndex = (index + items.length) % items.length;

  const isJumpingForward = current === items.length - 1 && newIndex === 0;
  const isJumpingBackward = current === 0 && newIndex === items.length - 1;

  if (isJumpingForward || isJumpingBackward) {
    track.style.transition = 'none';
    track.style.transform = `translateX(-${newIndex * 100}%)`;
    void track.offsetWidth;
    setTimeout(() => {
      track.style.transition = `transform ${transitionDuration} ease`;
    }, 20);
  } else {
    track.style.transition = `transform ${transitionDuration} ease`;
    track.style.transform = `translateX(-${newIndex * 100}%)`;
  }

  current = newIndex;
  if (dots && dots.length > 0 && dots[current]) {
    dots[current].checked = true;
  }

  setTimeout(() => {
    items[current].querySelectorAll('.animacao-texto').forEach((el) => {
      el.classList.add('animar');
    });
  }, 20);
}

function start(e) {
  if (!track) return;
  isDragging = true;
  startX = e.touches ? e.touches[0].clientX : e.clientX;
  track.classList.add('dragging');
}

function end(e) {
  if (!isDragging || !track) return;
  isDragging = false;
  track.classList.remove('dragging');
  const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
  const dx = endX - startX;

  if (dx > 50) {
    updateCarousel(current - 1);
  } else if (dx < -50) {
    updateCarousel(current + 1);
  }
}

function cancelDrag() {
  if (!track) return;
  isDragging = false;
  track.classList.remove('dragging');
}

// Somente inicializa o carrossel quando houver mais de um item
if (track && items.length > 1) {
  if (prev) prev.onclick = () => updateCarousel(current - 1);
  if (next) next.onclick = () => updateCarousel(current + 1);
  if (dots && dots.length > 0) {
    dots.forEach((dot) => (dot.onchange = () => updateCarousel(+dot.dataset.index)));
  }

  track.addEventListener('mousedown', start);
  track.addEventListener('touchstart', start);

  track.addEventListener('mouseup', end);
  track.addEventListener('touchend', end);

  track.addEventListener('mouseleave', cancelDrag);
  track.addEventListener('touchcancel', cancelDrag);

  // Inicia o carrossel no slide 0
  updateCarousel(0);

  track.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const moveX = e.touches[0].clientX - startX;
    track.style.transform = `translateX(${moveX}px)`;
  });
}
// Inicia o carrossel no slide 0
updateCarousel(0);

// Troca automática a cada 5 segundos
setInterval(() => {
  updateCarousel(current + 1);
}, 5000);

function animarEntrada(seletor) {
    const elementos = document.querySelectorAll(seletor);

    elementos.forEach((el, index) => {
      // Alterna direção
      if (index % 2 === 0) {
        el.classList.add('slide-esquerda');
      } else {
        el.classList.add('slide-direita');
      }

      // Delay progressivo
      el.style.transitionDelay = `${index * 0.1}s`;
    });

    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visivel');
        }
      });
    }, {
      threshold: 0.2
    });

    elementos.forEach(el => observador.observe(el));
  }

  // Chama para cada tipo de elemento
  animarEntrada('.imag');
  animarEntrada('.card');
  animarEntrada('.cardp');