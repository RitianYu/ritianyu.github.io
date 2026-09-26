/* Progressive enhancement: all academic content works without JavaScript. */
(() => {
  'use strict';

  const year = document.querySelector('#copyright-year');
  if (year) year.textContent = new Date().getFullYear();
  const navLinks = Array.from(document.querySelectorAll('.main-nav a'));
  const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  let scrollScheduled = false;

  function updateNavigation() {
    const headerHeight = document.querySelector('.site-header').getBoundingClientRect().height;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= headerHeight + 80) current = section;
    }
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 12) current = sections[sections.length - 1];
    for (const link of navLinks) {
      if (link.getAttribute('href') === `#${current.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    scrollScheduled = false;
  }
  function scheduleNavigation() {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(updateNavigation);
  }
  window.addEventListener('scroll', scheduleNavigation, { passive: true });
  window.addEventListener('resize', scheduleNavigation, { passive: true });
  window.addEventListener('pageshow', scheduleNavigation);
  updateNavigation();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection?.saveData);
  const previews = [];
  document.querySelectorAll('[data-preview]').forEach(frame => {
    const video = frame.querySelector('video');
    const button = frame.querySelector('button');
    const label = button.querySelector('.preview-label');
    const name = video.getAttribute('aria-label').replace(' research preview', '');
    const state = { frame, video, visible: false, pausedByUser: false, pending: false };
    previews.push(state);
    video.controls = false;
    button.hidden = false;
    const updateButton = playing => {
      button.setAttribute('aria-pressed', String(playing));
      button.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${name} preview`);
      label.textContent = playing ? 'Pause preview' : 'Play preview';
    };
    state.play = async () => {
      if (state.pending) return;
      state.pending = true;
      try {
        await video.play();
        if (document.hidden || !state.visible || state.pausedByUser) video.pause();
      } catch {
        // A declined autoplay leaves the poster and manual play control available.
        updateButton(false);
      } finally {
        state.pending = false;
      }
    };
    video.addEventListener('playing', () => updateButton(true));
    video.addEventListener('pause', () => updateButton(false));
    const fail = () => { video.controls = true; button.hidden = true; };
    video.addEventListener('error', fail);
    video.querySelectorAll('source').forEach(source => source.addEventListener('error', fail));
    button.addEventListener('click', () => {
      if (video.paused) { state.pausedByUser = false; state.visible = true; state.play(); }
      else { state.pausedByUser = true; video.pause(); }
    });
  });
  const autoPlayAllowed = () => !reducedMotion.matches && !saveData && !document.hidden;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const state = previews.find(item => item.frame === entry.target);
        state.visible = entry.isIntersecting && entry.intersectionRatio >= .3;
        if (state.visible && autoPlayAllowed() && !state.pausedByUser) state.play();
        else if (!state.visible) state.video.pause();
      }
    }, { threshold: [0, .3] });
    previews.forEach(state => observer.observe(state.frame));
  }
  function updatePlayback() {
    for (const state of previews) {
      if (!autoPlayAllowed()) state.video.pause();
      else if (state.visible && !state.pausedByUser) state.play();
    }
  }
  document.addEventListener('visibilitychange', updatePlayback);
  reducedMotion.addEventListener('change', updatePlayback);
})();
