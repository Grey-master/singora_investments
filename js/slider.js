
  
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
