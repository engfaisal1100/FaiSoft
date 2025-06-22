
 async function initPage() {
  // تحميل البيانات بعد إدراج الهيدر
  const resp = await fetch('json/data.json');
  const data = await resp.json();

  const {
    about, features, support, setting, contact,
    services, works, text_hero, advantages
  } = data;

  // ================== روابط التواصل ==================
const socialIconsContainer = document.getElementById('social-icons');

if (socialIconsContainer && Array.isArray(data.contact_links)) {
  socialIconsContainer.innerHTML = '';

  const platformIcons = {
    facebook: 'fab fa-facebook-f',
    twitter: 'fab fa-twitter',
    linkedin: 'fab fa-linkedin-in',
    github: 'fab fa-github',
    instagram: 'fab fa-instagram',
    tiktok: 'fab fa-tiktok',
    youtube: 'fab fa-youtube',
    whatsapp: 'fab fa-whatsapp',
  };

  data.contact_links.forEach(link => {
    const platformKey = link.platform.toLowerCase().trim();
    const iconClass = platformIcons[platformKey] || 'fas fa-globe';

    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.className = 'mx-2';
    a.style.color = 'white';
    a.innerHTML = `<i class="${iconClass} fa-lg"></i>`;
    socialIconsContainer.appendChild(a);
  });
}


    // تحديث معلومات المطور
    const developerInfoContainer = document.getElementById('developer-info');
    if (developerInfoContainer) {
        const developerText = document.createElement('p');
        developerText.innerHTML = `© 2025 جميع الحقوق محفوظة لموقع | ${setting.site_name}`;
        developerInfoContainer.appendChild(developerText);
    }

  // تهيئة بيانات الهيدر
  const logo = document.getElementById('siteLogo');
  if (logo) {
    logo.src = setting.logo;
    logo.alt = setting.site_name;
  }

  const servicesList = document.getElementById('servicesList');
  if (servicesList) {
    services.forEach(service => {
      const li = document.createElement('li');
      li.innerHTML = `<a class="dropdown-item" href="service-details?id=${service.id}">${service.title}</a>`;
      servicesList.appendChild(li);
    });
  }

  // Hero text
  document.getElementById('texthero-title').textContent = text_hero.title;
  document.getElementById('texthero-description').innerHTML = `${text_hero.description}<br>${text_hero.name}`;
  document.getElementById('hero-btn').href = "#contact";

  // Carousel Images from works
  const heroInner = document.getElementById('heroCarouselInner');
  works.forEach((item, index) => {
    if (!item.images || item.images.length === 0) return;

    const firstImg = item.images[0];
    const div = document.createElement('div');
    div.className = 'carousel-item' + (index === 0 ? ' active' : '');
    div.style.height = '300px';
    div.innerHTML = `
      <img src="${firstImg}" style="object-fit: contain; width: 100%; height: 100%;" class="d-block w-100" alt="${item.title}">
    `;
    heroInner.appendChild(div);
  });


  const sc = document.getElementById('servicesContainer');
  services.forEach(service => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="why-card" onclick="this.classList.toggle('animate')">
        <div class="icon-circle">${service.icon}</div>
        <h5>${service.title}</h5>
        <p>${service.description}</p>
        <a href="https://wa.me/${contact.phone_wat}" class="btn btn-outline-primary btn-sm px-4 py-2 rounded-pill custom-more-btn">
          أطلب الآن
        </a>
      </div>
    `;
    sc.appendChild(slide);
  });

    // ✅ قسم المزايا (advantages)
  const advContainer = document.getElementById('advantagesContainer');
  advantages.forEach(item => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `
      <div class="service-card" onclick="this.classList.toggle('animate')">
        <div class="icon-circle">
          ${item.icon}
          <span class="dot dot1"></span>
          <span class="dot dot2"></span>
        </div>
        <h5>${item.title}</h5>
        <p>${item.description}</p>
      </div>
    `;
    advContainer.appendChild(slide);
  });

  // ✅ قسم CTA
  document.getElementById('cta-title').textContent = features.title;
  document.getElementById('cta-description').textContent = features.description;
  document.getElementById('cta-button').href = `https://wa.me/${contact.phone_wat}`;
// إعداد المشاريع (معرض الأعمال)
const projectsContainer = document.getElementById('projectsContainer');
const paginationLinks = document.getElementById('paginationLinks');
const itemsPerPage = 6;
let currentPage = 1;

function showProjectModal(work) {
  // عنوان المشروع
  document.getElementById('projectModalLabel').textContent = work.title;

  // رابط المشروع
  const projectLink = document.getElementById('projectModalLink');
  projectLink.href = work.link || '#';
  projectLink.style.display = work.link ? 'inline-block' : 'none';

  // إعداد الصور داخل الكاروسيل
  const carouselInner = document.getElementById('carouselInner');
  const carouselThumbs = document.getElementById('carouselThumbnails');
  carouselInner.innerHTML = '';
  carouselThumbs.innerHTML = '';

  if (Array.isArray(work.images) && work.images.length > 0) {
    work.images.forEach((imgSrc, index) => {
      const activeClass = index === 0 ? 'active' : '';

      // الصورة الرئيسية
      const carouselItem = document.createElement('div');
      carouselItem.className = `carousel-item ${activeClass}`;
    carouselItem.innerHTML = `
  <div class="modal-img-wrapper">
    <img src="${imgSrc}" class="modal-img" alt="صورة">
  </div>`;
      carouselInner.appendChild(carouselItem);

      // الصورة المصغرة
      const thumb = document.createElement('img');
      thumb.src = imgSrc;
      thumb.className = 'img-thumbnail';
      thumb.style = 'width: 80px; height: 60px; cursor: pointer;';
      thumb.dataset.bsTarget = '#projectCarousel';
      thumb.dataset.bsSlideTo = index;
      thumb.addEventListener('click', () => {
        const carousel = bootstrap.Carousel.getInstance(document.getElementById('projectCarousel'));
        carousel.to(index);
      });
      carouselThumbs.appendChild(thumb);
    });
  } else {
    carouselInner.innerHTML = `<div class="carousel-item active"><p class="text-center text-muted">لا توجد صور متاحة</p></div>`;
  }

  // مشاركة الرابط
  const linkToShare = work.link || window.location.href;

  document.getElementById('shareWhatsApp').onclick = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(linkToShare)}`, '_blank');
  };

  document.getElementById('shareTelegram').onclick = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(linkToShare)}`, '_blank');
  };

  document.getElementById('shareTwitter').onclick = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(linkToShare)}`, '_blank');
  };

  document.getElementById('shareFacebook').onclick = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(linkToShare)}`, '_blank');
  };

  document.getElementById('copyLink').onclick = () => {
    navigator.clipboard.writeText(linkToShare).then(() => {
      const span = document.querySelector('#copyLink .copy-text');
      span.textContent = "تم النسخ!";
      setTimeout(() => (span.textContent = "نسخ الرابط"), 2000);
    });
  };

  // فتح المودال
  const modal = new bootstrap.Modal(document.getElementById('projectModal'));
  modal.show();
}

function renderProjects(page = 1) {
  projectsContainer.innerHTML = "";
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedWorks = works.slice(start, end);

  paginatedWorks.forEach(work => {
    const image = work.images?.[0] || '';
    const col = document.createElement('div');
    col.className = 'col-md-4';

    const card = document.createElement('div');
    card.className = 'card shadow-sm h-100 project-card';
    card.style.cursor = 'pointer';
   card.innerHTML = `
  <div class="project-img-wrapper">
    <img src="${image}" class="card-img-top project-img" alt="${work.title}">
  </div>
  <div class="card-body d-flex flex-column">
    <h5 class="card-title">${work.title}</h5>
    <p class="card-text">${work.description || ''}</p>
  </div>
`;


    card.addEventListener('click', () => showProjectModal(work));

    col.appendChild(card);
    projectsContainer.appendChild(col);
  });
}

function renderPagination() {
  const totalPages = Math.ceil(works.length / itemsPerPage);
  paginationLinks.innerHTML = '';

  const createPageItem = (pageNum, label = null, isActive = false, isDisabled = false) => {
    const li = document.createElement('li');
    li.className = `page-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`;
    li.innerHTML = `<a class="page-link" href="#" data-page="${pageNum}">${label || pageNum}</a>`;
    return li;
  };

  paginationLinks.appendChild(createPageItem(currentPage - 1, 'السابق', false, currentPage === 1));

  for (let i = 1; i <= totalPages; i++) {
    paginationLinks.appendChild(createPageItem(i, null, i === currentPage));
  }

  paginationLinks.appendChild(createPageItem(currentPage + 1, 'التالي', false, currentPage === totalPages));

  paginationLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const page = parseInt(link.dataset.page);
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        currentPage = page;
        renderProjects(currentPage);
        renderPagination();

        const target = document.getElementById('projects');
        if (target) {
          window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
        }
      }
    });
  });
}

renderProjects(currentPage);
renderPagination();

// من نحن
document.getElementById('about-image').src = about.image;
document.getElementById('about-title').textContent = about.title;
document.getElementById('about-description').textContent = about.description;

// الدعم الفني
document.getElementById('support-image').src = support.image;
document.getElementById('support-title').textContent = support.title;
document.getElementById('support-description').textContent = support.description;
document.getElementById('support-btn').href = `https://wa.me/${contact.phone_wat}`;


// قسم الاتصال
document.getElementById('contact-location').textContent = contact.location;
document.getElementById('contact-phone').textContent = contact.phone_one;
document.getElementById('contact-hours').textContent = contact.working_hours;

  // بعد تحميل الشرائح، فعل سوايبر
  if (typeof Swiper !== 'undefined') {
    new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 20,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        }
      }
    });
  }
// ✅ زر الصعود لأعلى والنزول لأسفل
const scrollTopBtn = document.getElementById("scrollTop");
const scrollDownBtn = document.getElementById("scrollDown");

window.addEventListener("scroll", () => {
  const scrollPos = window.scrollY;
  const pageHeight = document.body.scrollHeight - window.innerHeight;

  scrollTopBtn.style.display = scrollPos > 100 ? "block" : "none";
  scrollDownBtn.style.display = scrollPos < pageHeight - 200 ? "block" : "none";
});
};

// ===================== WhatsApp Function =====================
function gotowhatsapp() {
  const name = document.getElementsByName("name")[0]?.value.trim() || '';
  const surname = document.getElementsByName("surname")[0]?.value.trim() || '';
  const message = document.getElementsByName("message")[0]?.value.trim() || '';
  const errorBox = document.getElementById("form-error");

  if (!name || !surname || !message) {
    if (errorBox) {
      errorBox.innerHTML = "يرجى ملء جميع الحقول قبل الإرسال!";
      errorBox.style.display = "block";
    }
    return;
  }

  if (errorBox) errorBox.style.display = "none";

  const whatsappMessage = encodeURIComponent(
    `الاسم الأول: ${name}\nاللقب: ${surname}\nالرسالة: ${message}`
  );

  const phoneNumber = "967779289621";
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
  window.open(whatsappURL, "_blank");
}

// ===================== Loader and AOS =====================
setTimeout(() => {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none';

  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      duration: 1000
    });
  }
}, 3000);

  document.addEventListener("DOMContentLoaded", initPage);

