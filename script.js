const menuToggle = document.getElementById('menu-toggle');
const navItens = document.getElementById('nav-itens');

menuToggle.addEventListener('click', () => {
  navItens.classList.toggle('active');
});

const track = document.querySelector('.carousel-track');  // imagens lado a lado
const items = document.querySelectorAll('.carousel-item');  // cada slide
const prev = document.querySelector('.carousel-button.prev'); // botão anterior
const next = document.querySelector('.carousel-button.next'); // botão próximo
const dots = document.querySelectorAll('.carousel-nav input'); // indicadores (radios)

let current = 0; // slide atual
let isDragging = false;
let startX = 0;

// Define duração da transição para deixar a troca mais suave
const transitionDuration = '0.6s';

function updateCarousel(index) {
  items.forEach(item => {
    item.querySelectorAll('.animacao-texto').forEach(el => {
      el.classList.remove('animar');
      void el.offsetWidth; // força reflow para resetar animação
    });
  });

  let newIndex = (index + items.length) % items.length;

  const isJumpingForward = (current === items.length - 1 && newIndex === 0);
  const isJumpingBackward = (current === 0 && newIndex === items.length - 1);

  if (isJumpingForward || isJumpingBackward) {
    // Remove transição para salto instantâneo
    track.style.transition = 'none';
    track.style.transform = `translateX(-${newIndex * 100}%)`;

    // Força reflow para aplicar a mudança sem transição
    void track.offsetWidth;

    // Reativa transição suave para próximos movimentos
    setTimeout(() => {
      track.style.transition = `transform ${transitionDuration} ease`;
    }, 20);
  } else {
    // Transição normal para slides adjacentes com duração maior para suavidade
    track.style.transition = `transform ${transitionDuration} ease`;
    track.style.transform = `translateX(-${newIndex * 100}%)`;
  }

  current = newIndex;
  dots[current].checked = true;

  setTimeout(() => {
    items[current].querySelectorAll('.animacao-texto').forEach(el => {
      el.classList.add('animar');
    });
  }, 20);
}

function start(e) {
  isDragging = true;
  startX = e.touches ? e.touches[0].clientX : e.clientX;
  track.classList.add('dragging'); // muda cursor para mão fechada
}

function end(e) {
  if (!isDragging) return;
  isDragging = false;
  track.classList.remove('dragging'); // volta cursor para padrão
  const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
  const dx = endX - startX;

  if (dx > 50) {
    updateCarousel(current - 1);
  } else if (dx < -50) {
    updateCarousel(current + 1);
  }
}

function cancelDrag() {
  isDragging = false;
  track.classList.remove('dragging'); // volta cursor para padrão
}

// Eventos do carrossel
prev.onclick = () => updateCarousel(current - 1);
next.onclick = () => updateCarousel(current + 1);
dots.forEach(dot => dot.onchange = () => updateCarousel(+dot.dataset.index));

// Eventos para drag com mouse e touch
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
  const moveX = (e.touches[0].clientX - startX);
  track.style.transform = `translateX(${moveX}px)`; // Atualiza a posição ao arrastar
});
