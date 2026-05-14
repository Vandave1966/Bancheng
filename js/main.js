/* ============================================
   伴诚平台 — 交互脚本
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {

  // ---------- 导航栏滚动效果 ----------
  const navbar = document.getElementById("navbar");

  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // 初始检查

  // ---------- 汉堡菜单 ----------
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
    document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
  });

  // 点击导航链接后关闭菜单
  navMenu.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // 点击菜单外区域关闭
  document.addEventListener("click", (e) => {
    if (navMenu.classList.contains("active") &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // ---------- 导航高亮 ----------
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".nav-link:not(.nav-cta)");

  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute("id");

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNav, { passive: true });

  // ---------- FAQ 手风琴 ----------
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // 关闭所有
      faqItems.forEach(other => {
        other.classList.remove("active");
        other.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      });

      // 如果当前不是打开的，则打开它
      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ---------- 滚动渐入动画 ----------
  const fadeElements = document.querySelectorAll(".fade-in");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // 只触发一次
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    fadeElements.forEach(el => observer.observe(el));
  } else {
    // 降级处理：直接显示
    fadeElements.forEach(el => el.classList.add("visible"));
  }

  // ---------- 视频弹窗 ----------
  const videoModal = document.getElementById("videoModal");
  const modalVideo = document.getElementById("modalVideo");
  const videoCloseBtn = document.querySelector(".video-modal-close");
  const videoCards = document.querySelectorAll(".video-card");

  videoCards.forEach(card => {
    card.addEventListener("click", () => {
      const videoSrc = card.getAttribute("data-video");
      if (videoSrc) {
        modalVideo.src = videoSrc;
        videoModal.classList.add("active");
        document.body.style.overflow = "hidden";
        modalVideo.play().catch(() => {});
      }
    });
  });

  function closeVideoModal() {
    videoModal.classList.remove("active");
    modalVideo.pause();
    modalVideo.src = "";
    document.body.style.overflow = "";
  }

  if (videoCloseBtn) {
    videoCloseBtn.addEventListener("click", closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener("click", (e) => {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal.classList.contains("active")) {
      closeVideoModal();
    }
  });

  // ---------- 平滑滚动（兼容性增强） ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPos = target.offsetTop - navHeight - 20;

        window.scrollTo({
          top: targetPos,
          behavior: "smooth",
        });
      }
    });
  });
});
