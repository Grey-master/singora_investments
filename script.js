/* ===========================
   SUNGORA INVESTMENTS - JAVASCRIPT
   Minimal JS for mobile menu & form handling
   =========================== */

document.addEventListener('DOMContentLoaded', function() {
    
    // =============================
    // MOBILE MENU TOGGLE
    // =============================
    
    const headerContent = document.querySelector('.header-content');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const header = document.querySelector('.header');

    function openMenu() {
        headerContent.classList.add('menu-open');
        menuToggle.textContent = '✕';
    }

    function closeMenu() {
        headerContent.classList.remove('menu-open');
        menuToggle.textContent = '☰';
    }

    function toggleMenu() {
        headerContent.classList.contains('menu-open') ? closeMenu() : openMenu();
    }

    menuToggle.addEventListener('click', toggleMenu);

    // Закрытие при клике по ссылке
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Закрытие при клике вне header
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target)) {
            closeMenu();
        }
    });

    // Закрытие при потере фокуса
    document.addEventListener('focusin', (e) => {
        if (!header.contains(e.target)) {
            closeMenu();
        }
    });
    
    // =============================
    // CONTACT FORM HANDLER
    // =============================
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                alert('Пожалуйста, заполните все поля');
                return;
            }
            
            // Check email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Пожалуйста, введите корректный email');
                return;
            }
            
            // In a real application, you would send this data to a server
            // For now, we'll show a success message
            alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
            
            // Reset form
            contactForm.reset();
            
            // Optional: You can send the form data to a backend using fetch:
            // sendFormData(name, email, message);
        });
    }
    
    // =============================
    // SMOOTH SCROLL FOR OLD BROWSERS
    // =============================
    
    document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function(e) {

    const href = this.getAttribute("href");
    if (!href || href === "#") return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    // скролл с учётом хедера
    const yOffset = -80;
    const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });

    // 🔥 подсветка
    setTimeout(() => {
      target.classList.add("highlight");
    }, 500);

    setTimeout(() => {
      target.classList.remove("highlight");
    }, 3000);

  });
});


  
    
    // =============================
    // OPTIONAL: Send form data to backend
    // =============================
    
    // Uncomment and modify this function if you have a backend API
   
    function sendFormData(name, email, message) {
        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                message: message
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Сообщение успешно отправлено!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке сообщения');
        });
    }

    // Слайдер на типы домов  

    document.querySelectorAll('.property-image').forEach(container => {
    const preview = container.querySelector('.preview-img');
    
    let images = [];
      try {
        images = JSON.parse(container.dataset.images);
      } catch(e) {
        console.error('Ошибка JSON в data-images', container);
        return;
      }

    let slider, current = 0, startX = 0, isDown = false;

    container.addEventListener('click', () => {
      if (slider) return;

      // создаем слайдер
      slider = document.createElement('div');
      slider.className = 'slider';

      images.forEach(src => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `<img src="${src}">`;
        slider.appendChild(slide);
      });

      container.appendChild(slider);

      // UI
      const ui = document.createElement('div');
      ui.className = 'slider-ui';

      ui.innerHTML = `
        <div class="arrow prev">&#10094;</div>
        <div class="arrow next">&#10095;</div>
        <div class="close-btn">✕</div>
        <div class="pagination"></div>
      `;

      container.appendChild(ui);

      const dotsContainer = ui.querySelector('.pagination');

      images.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        if (i === 0) dot.classList.add('active');
        dotsContainer.appendChild(dot);
      });

      const update = () => {
        slider.style.transform = `translateX(-${current * 100}%)`;

        dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
          d.classList.toggle('active', i === current);
        });
      };

      // стрелки
      ui.querySelector('.next').onclick = () => {
        current = (current + 1) % images.length;
        update();
      };

      ui.querySelector('.prev').onclick = () => {
        current = (current - 1 + images.length) % images.length;
        update();
      };

      // close
      ui.querySelector('.close-btn').onclick = (e) => {
        e.stopPropagation();
        slider.remove();
        ui.remove();
        slider = null;
        current = 0;
      };

      // свайп
      slider.addEventListener('pointerdown', e => {
        isDown = true;
        startX = e.clientX;
      });

      slider.addEventListener('pointerup', e => {
        if (!isDown) return;
        isDown = false;

        const diff = e.clientX - startX;

        if (diff > 50) current--;
        if (diff < -50) current++;

        current = (current + images.length) % images.length;
        update();
      });

    });
  });
    
});

// =============================
// INTERSECTION OBSERVER FOR ANIMATIONS
// =============================

if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections for fade-in effect
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}




// ==============================
// Отладка координат кликов на изображении.
// !!! Включать только на время определения новых координат!!! Ломает код!!!
//  Временно удаляем HTML-блок c polygon и определяем новые координаты, потом возвращаем HTML-блок c polygon

// imagemap.onclick = function(e){console.log(e.offsetX + "," + e.offsetY)}

// ==============================

// =================================
// Интерактивная карта
// =================================

// данные (можно вынести в JSON)
const data = {
  edelveys: {
    title: "Едельвейс",
    area: "200 м²",
    areaEarth: "844,4 м²",
    price: "$510 000",
    img: "https://www.dl.dropboxusercontent.com/scl/fi/gcbt8gtahgnnm4lmbyksl/edelveys1.jpg?rlkey=yv4ox8q2ej2s8pnrqiby3a98a&st=tizcmmhs&dl=0",
    scrollTo: "edelveys"
  },
  chervona_ruta: {
    title: "Червона Рута",
    area: "50 м²",
    areaEarth: "500 м²",
    price: "$87 000",
    img: "https://www.dl.dropboxusercontent.com/scl/fi/ksntt8vgz4cf5oo27t4hn/chervona_ruta01.jpg?rlkey=6d9c7ybs1366kenx9r6fjfsjr&st=plbxq3zi&dl=0",
    scrollTo: "chervona_ruta"
    
  },
  dilyanka_04: {
    title: "Ділянка 04",
    area: "-/- м²",
    areaEarth: "681,3 м²",
    price: "$38 800",
    img: "https://www.dl.dropboxusercontent.com/scl/fi/fekywycnc8hya3ji3utrs/dilyanka_04.jpg?rlkey=f8ofa6n4o9oau8vv7tnbj4qpu&st=67a1svoz&dl=0",
    scrollTo: "model1"
  },
  dilyanka_05: {
    title: "Ділянка 05",
    area: "-/- м²",
    areaEarth: "502,3 м²",
    price: "$28 600",
    img: "https://www.dl.dropboxusercontent.com/scl/fi/pf666hpy16d0zfk6bfha5/dilyanka_05.jpg?rlkey=up711knpmqwgshnexvx7o0epb&st=bv3rep9s&dl=0",
    scrollTo: "model1"
  },
  dilyanka_spa: {
    title: "Ділянка_SPA",
    area: "-/- м²",
    areaEarth: "3100 м²",
    price: "$177 000",
    img: "https://www.dl.dropboxusercontent.com/scl/fi/nyokbbhx1pj0y45vsyax4/dilyanka_spa1.jpg?rlkey=fvrpu2xrsn9oa2c69gaxp5igq&st=6jgfvg2c&dl=0",
    scrollTo: "dilyanka_spa"
  }
};

// элементы
const polygons = document.querySelectorAll(".viewbox");
const modal = document.getElementById("modal");

const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalArea = document.getElementById("modal-area");
const modalAreaEarth = document.getElementById("modal-area-earth");
const modalPrice = document.getElementById("modal-price");
const modalLink = document.getElementById("modal-link");

const closeBtn = document.querySelector(".close");

// открытие

let currentTargetId = null;

if (modal && modalImg && modalTitle && modalArea && modalAreaEarth && modalPrice) {
  polygons.forEach(polygon => {
    polygon.addEventListener("click", () => {

      const id = polygon.dataset.id;
      const item = data[id];
      

    // currentId = id;  сохраняем

      if (!item) return;

      // берём scrollTo (или fallback)
      currentTargetId = item.scrollTo || id;

      modalImg.src = item.img;
      modalTitle.textContent = item.title;
      modalAreaEarth.textContent = "Площа ділянки: " + item.areaEarth;
      modalArea.textContent = "Площа будинку: " + item.area;
      modalPrice.textContent = "Ціна: " + item.price;
      modalLink.href = item.link;

      modal.classList.add("active");
    });
  });
};



// закрытие
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });
};

if (modal) {
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});
};

// ESC закрытие (production must-have)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.remove("active");
  }
});


// ================================
// Замена обычного перехода на переход с подсветкой
// ================================
if (modalLink) {
modalLink.addEventListener("click", (e) => {
  e.preventDefault();
  
  if (!currentTargetId) return; // “Если currentTargetId не существует — прекратить выполнение функции”

  const target = document.getElementById(currentTargetId);
  if (!target) {
    console.warn("Не найден блок:", currentTargetId);
    return;
  }

  // закрываем модалку
  modal.classList.remove("active");

  // плавный скролл
  const yOffset = -80; // высота хедера
  const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({
  top: y,
  behavior: "smooth"
});

  // подсветка
  setTimeout(() => {
  target.classList.add("highlight");
}, 500);

  // убрать подсветку через время
  setTimeout(() => {
    target.classList.remove("highlight");
  }, 3000);
});
};



// ===================== 
// кнопка Наверх
// ========================

// Получить кнопку
var mybutton = document.getElementById("btnTop");

// Показывать кнопку при прокрутке вниз на 20px
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// Плавная прокрутка наверх при клике
function topFunction() {
  window.scrollTo({top: 0, behavior: 'smooth'});
}






