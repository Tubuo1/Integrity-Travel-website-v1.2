(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const config = window.INTEGRITY_CONFIG || {};
  const isFrench = document.documentElement.lang?.toLowerCase().startsWith('fr');
  const isGithubPages = location.hostname.endsWith('github.io');

  // Mobile navigation
  const menuBtn = $('.menu-btn');
  const mobilePanel = $('.mobile-panel');
  const closeMenu = () => {
    if (!menuBtn || !mobilePanel) return;
    mobilePanel.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = '☰';
  };
  if (menuBtn && mobilePanel) {
    menuBtn.addEventListener('click', () => {
      const open = mobilePanel.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? '✕' : '☰';
    });
    $$('.mobile-panel a').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }

  // FAQs
  $$('.faq-q').forEach(btn => btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const open = item.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  }));

  const faqSearch = $('#faq-search');
  if (faqSearch) {
    faqSearch.addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      let shown = 0;
      $$('.faq-item').forEach(item => {
        const ok = item.textContent.toLowerCase().includes(q);
        item.style.display = ok ? '' : 'none';
        if (ok) shown++;
      });
      const empty = $('.faq-empty');
      if (empty) empty.style.display = shown ? 'none' : 'block';
    });
  }

  // Back to top
  const backtop = $('.backtop');
  if (backtop) {
    const toggle = () => backtop.classList.toggle('show', scrollY > 650);
    addEventListener('scroll', toggle, { passive: true });
    toggle();
    backtop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Cookie preference banner (essential local storage only)
  const cookie = $('.cookie');
  try {
    if (cookie && !localStorage.getItem('integrity_cookie_choice')) cookie.classList.add('show');
  } catch (_) {}
  $$('.cookie-choice').forEach(btn => btn.addEventListener('click', () => {
    try { localStorage.setItem('integrity_cookie_choice', btn.dataset.choice || 'essential'); } catch (_) {}
    cookie?.classList.remove('show');
  }));

  // Central configuration binding
  $$('[data-config]').forEach(el => {
    const path = el.dataset.config.split('.');
    let val = config;
    path.forEach(k => { val = val && val[k]; });
    if (val) {
      el.textContent = val;
      if (el.dataset.hrefPrefix) el.href = el.dataset.hrefPrefix + val;
      el.closest('[data-hide-if-empty]')?.classList.remove('config-empty');
    }
  });
  $$('[data-hide-if-empty].config-empty').forEach(el => { el.style.display = 'none'; });

  // Pre-launch safeguards. Testimonial previews remain visible only during pre-launch,
  // unless they are explicitly marked verified. Same principle applies to founder and
  // representative preview sections where data attributes are used.
  if (!config.prelaunchMode && !config.testimonialsVerified) {
    $('#testimonial-preview')?.remove();
  }
  $$('[data-requires-verified-rep]').forEach(el => {
    if (!config.prelaunchMode && !config.authorizedRepresentative?.verified) el.remove();
  });
  $$('[data-requires-verified-founder]').forEach(el => {
    if (!config.prelaunchMode && !config.founderVerified) el.remove();
  });

  if (config.prelaunchMode) {
    const banner = document.createElement('div');
    banner.className = 'prelaunch-banner';
    banner.innerHTML = isFrench
      ? '<strong>VERSION PRÉ-LANCEMENT :</strong> certains témoignages, éléments du profil du fondateur et renseignements professionnels doivent encore être vérifiés avant le lancement commercial.'
      : '<strong>PRE-LAUNCH BUILD:</strong> testimonial previews, founder details and professional credentials still require verification before commercial launch.';
    document.body.insertBefore(banner, document.body.firstChild);
  }

  // Human-readable WhatsApp numbers with safe wa.me links
  $$('[data-href-prefix="https://wa.me/"]').forEach(el => {
    const path = (el.dataset.config || '').split('.');
    let val = config;
    path.forEach(k => { val = val && val[k]; });
    if (val) el.href = 'https://wa.me/' + String(val).replace(/\D/g, '');
  });

  // Persistent WhatsApp conversion button
  if (config.whatsapp) {
    const wa = document.createElement('a');
    wa.className = 'whatsapp-float';
    wa.href = 'https://wa.me/' + String(config.whatsapp).replace(/\D/g, '');
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.setAttribute('aria-label', isFrench ? 'Discuter sur WhatsApp' : 'Chat on WhatsApp');
    wa.innerHTML = `<b>WA</b><span>WhatsApp</span>`;
    document.body.appendChild(wa);
  }

  // Generic site forms. GitHub Pages cannot process POST forms, so trial deployments
  // show a clear message rather than failing. Netlify deployments can capture them.
  $$('form[data-demo-form]').forEach(form => {
    form.addEventListener('submit', e => {
      const status = $('.form-status', form);
      if (location.protocol === 'file:' || isGithubPages) {
        e.preventDefault();
        if (status) {
          status.className = 'form-status show success';
          status.textContent = isFrench
            ? 'Le formulaire est prêt. Pour l’envoi réel, utilisez la version de production sur Netlify ou contactez-nous directement par e-mail/WhatsApp.'
            : 'The form is ready. For live submissions, use the production Netlify deployment or contact us directly by email/WhatsApp.';
        }
      }
    });
  });

  // Preliminary assessment feedback
  const assessmentForm = $('#assessment-form');
  if (assessmentForm) {
    assessmentForm.addEventListener('submit', e => {
      if (location.protocol === 'file:' || isGithubPages) e.preventDefault();
      const objective = $('#objective', assessmentForm)?.value || '';
      const language = $('#preferred-language', assessmentForm)?.value || '';
      const result = $('#assessment-result');
      if (result) {
        const title = isFrench ? 'Votre prochaine étape' : 'Your next step';
        const body = isFrench
          ? `Merci. D’après l’objectif « ${objective || 'non précisé'} », la prochaine étape raisonnable est une conversation structurée pour clarifier votre situation, vos priorités et les informations à vérifier. Ce questionnaire ne détermine pas votre admissibilité officielle.`
          : `Thank you. Based on the goal “${objective || 'not specified'},” the sensible next step is a structured conversation to clarify your circumstances, priorities and the information that needs to be verified. This questionnaire does not determine official eligibility.`;
        result.textContent = '';
        const strong = document.createElement('strong');
        strong.textContent = title;
        result.append(strong, document.createElement('br'), document.createTextNode(body));
        if (language) {
          result.append(document.createTextNode(' '));
          const span = document.createElement('span');
          span.className = 'small';
          span.textContent = `(${language})`;
          result.appendChild(span);
        }
        result.className = 'notice good';
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Travel intake email request. On Netlify, a serverless function sends the DOCX.
  // GitHub Pages is static, so it gracefully offers the direct download instead.
  $$('form[data-travel-intake-request]').forEach(form => {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const status = $('.intake-status', form);
      const submit = $('button[type="submit"]', form);
      const data = Object.fromEntries(new FormData(form).entries());
      const wantsFrench = String(data.language || (isFrench ? 'French' : 'English')).toLowerCase().startsWith('fr');
      const intakeFile = wantsFrench
        ? 'Integrity-Travel-Consulting-Formulaire-Evaluation-Initiale-FR.docx'
        : 'Integrity-Travel-Consulting-Intake-Evaluation-Form.docx';
      const dl = `${isFrench ? '../' : ''}downloads/${intakeFile}`;

      if (status) {
        status.className = 'intake-status show loading';
        status.textContent = isFrench ? 'Envoi de votre formulaire…' : 'Sending your form…';
      }
      if (submit) submit.disabled = true;

      if (location.protocol === 'file:' || isGithubPages) {
        if (status) {
          status.className = 'intake-status show success';
          status.innerHTML = isFrench
            ? `L’envoi automatique sera actif sur le site de production. <a href="${dl}"><strong>Télécharger le formulaire maintenant.</strong></a>`
            : `Automatic email delivery will be active on the production site. <a href="${dl}"><strong>Download the form now.</strong></a>`;
        }
        if (submit) submit.disabled = false;
        return;
      }

      try {
        const res = await fetch('/.netlify/functions/send-travel-intake', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.error || 'Request failed');
        if (status) {
          status.className = 'intake-status show success';
          status.innerHTML = isFrench
            ? `C’est envoyé. Vérifiez votre boîte de réception et vos courriers indésirables. <a href="${dl}"><strong>Vous pouvez aussi télécharger le formulaire ici.</strong></a>`
            : `Sent. Please check your inbox and spam folder. <a href="${dl}"><strong>You can also download the form here.</strong></a>`;
        }
        form.reset();
      } catch (_) {
        if (status) {
          status.className = 'intake-status show error';
          status.innerHTML = isFrench
            ? `Nous n’avons pas pu envoyer l’e-mail pour le moment. <a href="${dl}"><strong>Téléchargez le formulaire ici</strong></a> ou contactez-nous directement.`
            : `We could not send the email right now. <a href="${dl}"><strong>Download the form here</strong></a> or contact us directly.`;
        }
      } finally {
        if (submit) submit.disabled = false;
      }
    });
  });
})();
