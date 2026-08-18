const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.main-nav');

menuButton?.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('is-open', !isOpen);
});

navigation?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  menuButton?.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
});

document.querySelectorAll('.category').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.category').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
  });
});

document.querySelectorAll('.project-item').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.project-item').forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
  });
});

const header = document.querySelector('.site-header');
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });
