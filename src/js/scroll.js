import AOS from 'aos';
import 'aos/dist/aos.css';
const scrollBtn = document.querySelector('[data-scroll-home-body]');
function scrollTo() {
  window.scrollTo({
    top: 0,
    left: 100,
    behavior: 'smooth',
  });
}

scrollBtn.addEventListener('click', scrollTo);

AOS.init();
