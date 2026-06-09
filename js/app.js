/* ============================================================
   Databricks Demo Showcase — app logic
   - Loads data/demos.json (single source of truth)
   - Renders hero, featured, filters, and the demo grid
   - Handles category filtering and the click-to-play modal
   No frameworks, no build step.
   ============================================================ */

(function () {
  'use strict';

  const PLAY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  const ARROW = '<span class="arrow" aria-hidden="true">&rarr;</span>';

  const state = { demos: [], categories: [], activeCategory: 'all' };
  const els = {};

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', init);

  async function init() {
    cacheEls();
    bindModal();
    try {
      // Cache-bust so updated content shows without a hard refresh during editing.
      const res = await fetch('data/demos.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      state.demos = data.demos || [];
      state.categories = data.categories || [];
      renderHero(data.site || {});
      renderFeatured();
      renderFilters();
      renderGrid();
    } catch (err) {
      console.error('Failed to load demos.json', err);
      els.cardGrid.innerHTML =
        '<p class="empty-state">Could not load demo data. If you opened this file directly, run a local server (see README) — browsers block fetch() on file://.</p>';
    }
  }

  function cacheEls() {
    els.heroEyebrow = byId('hero-eyebrow');
    els.heroHeadline = byId('hero-headline');
    els.heroSubhead = byId('hero-subhead');
    els.heroPrimary = byId('hero-primary-cta');
    els.heroSecondary = byId('hero-secondary-cta');
    els.featuredGrid = byId('featured-grid');
    els.filters = byId('filters');
    els.cardGrid = byId('card-grid');
    els.emptyState = byId('empty-state');
    els.modal = byId('modal');
    els.modalMedia = byId('modal-media');
    els.modalCategory = byId('modal-category');
    els.modalTitle = byId('modal-title');
    els.modalSummary = byId('modal-summary');
    els.modalWhy = byId('modal-why');
    els.modalProblem = byId('modal-problem');
    els.modalAudience = byId('modal-audience');
  }

  /* ---------- Hero ---------- */
  function renderHero(site) {
    setText(els.heroEyebrow, site.eyebrow);
    setText(els.heroHeadline, site.headline);
    setText(els.heroSubhead, site.subhead);
    if (site.primaryCta) { els.heroPrimary.textContent = site.primaryCta.label; els.heroPrimary.href = site.primaryCta.href; }
    if (site.secondaryCta) { els.heroSecondary.textContent = site.secondaryCta.label; els.heroSecondary.href = site.secondaryCta.href; }
  }

  /* ---------- Featured ---------- */
  function renderFeatured() {
    const featured = state.demos.filter((d) => d.featured);
    els.featuredGrid.innerHTML = '';
    featured.forEach((d) => els.featuredGrid.appendChild(buildCard(d)));
  }

  /* ---------- Filters ---------- */
  function renderFilters() {
    els.filters.innerHTML = '';
    state.categories.forEach((cat) => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (cat.id === state.activeCategory ? ' active' : '');
      btn.textContent = cat.label;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', String(cat.id === state.activeCategory));
      btn.addEventListener('click', () => {
        state.activeCategory = cat.id;
        renderFilters();
        renderGrid();
      });
      els.filters.appendChild(btn);
    });
  }

  /* ---------- Grid ---------- */
  function renderGrid() {
    const list =
      state.activeCategory === 'all'
        ? state.demos
        : state.demos.filter((d) => d.category === state.activeCategory);

    els.cardGrid.innerHTML = '';
    list.forEach((d) => els.cardGrid.appendChild(buildCard(d)));
    els.emptyState.hidden = list.length > 0;
  }

  /* ---------- Card factory ---------- */
  function buildCard(d) {
    const card = document.createElement('button');
    card.className = 'card';
    card.type = 'button';
    card.setAttribute('aria-label', 'Play demo: ' + d.title);

    const preview = d.thumbnail
      ? `<img src="${esc(d.thumbnail)}" alt="${esc(d.title)} preview" loading="lazy" />`
      : `<div class="preview-gradient cat-${esc(d.category)}"><span class="preview-tag">${esc(d.categoryLabel || '')}</span></div>`;

    const duration = d.duration ? `<span class="duration-chip">${esc(d.duration)}</span>` : '';

    card.innerHTML = `
      <div class="card-preview">
        ${preview}
        <span class="play-badge">${PLAY_SVG}</span>
        ${duration}
      </div>
      <div class="card-body">
        <span class="card-cat">${esc(d.categoryLabel || '')}</span>
        <span class="card-title">${esc(d.title)}</span>
        <span class="card-summary">${esc(d.summary || '')}</span>
        <span class="card-foot">Watch demo ${ARROW}</span>
      </div>`;

    card.addEventListener('click', () => openModal(d));
    return card;
  }

  /* ---------- Modal ---------- */
  function bindModal() {
    els.modal.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-close')) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !els.modal.hidden) closeModal();
    });
  }

  function openModal(d) {
    setText(els.modalCategory, d.categoryLabel);
    setText(els.modalTitle, d.title);
    setText(els.modalSummary, d.summary);
    setText(els.modalWhy, d.whyItMatters);
    setText(els.modalProblem, d.businessProblem);
    setText(els.modalAudience, d.audience);
    els.modalMedia.innerHTML = buildMedia(d);

    els.modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    els.modal.hidden = true;
    els.modalMedia.innerHTML = ''; // stops video playback
    document.body.style.overflow = '';
  }

  function buildMedia(d) {
    if (!d.src) {
      // Graceful placeholder until a real asset is dropped in.
      return `
        <div class="media-placeholder cat-${esc(d.category)}" style="background:#0f1b21">
          <svg class="ph-icon" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          <strong>Demo video coming soon</strong>
          <small>Drop the file in <code>assets/videos/</code> or <code>assets/gifs/</code> and set <code>"src"</code> for "${esc(d.id)}" in <code>data/demos.json</code>.</small>
        </div>`;
    }
    if (d.type === 'gif') {
      return `<img src="${esc(d.src)}" alt="${esc(d.title)}" />`;
    }
    return `<video src="${esc(d.src)}" controls autoplay playsinline ${d.thumbnail ? `poster="${esc(d.thumbnail)}"` : ''}></video>`;
  }

  /* ---------- Helpers ---------- */
  function byId(id) { return document.getElementById(id); }
  function setText(el, txt) { if (el) el.textContent = txt || ''; }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
})();
