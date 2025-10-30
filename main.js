// Mobile menu toggle
const mobileToggle = document.getElementById('mobileToggle');
const mobilePanel = document.getElementById('mobilePanel');

if (mobileToggle && mobilePanel) {
  mobileToggle.addEventListener('click', () => {
    mobilePanel.classList.toggle('open');
  });

  // close menu when clicking a link
  mobilePanel.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobilePanel.classList.remove('open');
    });
  });
}

// Scroll reveal animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal-up').forEach((el) => {
  observer.observe(el);
});

// Hire form: optimistic UX
const hireForm = document.getElementById('hireForm');
const formStatus = document.getElementById('formStatus');

if (hireForm && formStatus) {
  hireForm.addEventListener('submit', async (e) => {
    // If you keep Formspree 'action', the browser will POST normally.
    // This JS intercept just gives a nicer "sent" message without leaving page.
    e.preventDefault();

    const data = new FormData(hireForm);

    // IMPORTANT:
    // Replace "YOUR_FORMSPREE_ID" in index.html action with your actual Formspree endpoint.
    // Or remove this JS block and let the native form submit.
    const endpoint = hireForm.getAttribute('action');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        formStatus.textContent = "✅ Message sent. I'll reach out.";
        hireForm.reset();
      } else {
        formStatus.textContent = "⚠️ Could not send. You can email harshavguntreddi@gmail.com directly.";
      }
    } catch (err) {
      formStatus.textContent = "⚠️ Network error. Please email harshavguntreddi@gmail.com.";
    }
  });
}
