/* ============================================
   UNIFL Estimate Calculator
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const state = { step: 0, selections: {}, quantities: {} };
  const steps = document.querySelectorAll('.calc-panel');
  const indicators = document.querySelectorAll('.calc-step-indicator');

  // ── Card Select (radio) ──
  document.querySelectorAll('.calc-cards').forEach(group => {
    group.querySelectorAll('.calc-card').forEach(card => {
      card.addEventListener('click', () => {
        group.querySelectorAll('.calc-card').forEach(c => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        updateSummary();
      });
    });
  });

  // ── Checkbox Toggle ──
  document.querySelectorAll('.calc-check').forEach(check => {
    check.addEventListener('click', () => {
      check.classList.toggle('is-selected');
      updateSummary();
    });
  });

  // ── Quantity Controls ──
  document.querySelectorAll('.calc-qty__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qty = btn.closest('.calc-qty');
      const valueEl = qty.querySelector('.calc-qty__value');
      const priceEl = qty.querySelector('.calc-qty__price');
      const unitPrice = parseInt(qty.dataset.unitPrice) || 0;
      const min = parseInt(qty.dataset.min) || 0;
      const max = parseInt(qty.dataset.max) || 99;
      let val = parseInt(valueEl.textContent) || 0;

      if (btn.dataset.dir === '+') val = Math.min(val + 1, max);
      else val = Math.max(val - 1, min);

      valueEl.textContent = val;
      priceEl.textContent = formatPrice(val * unitPrice);
      updateSummary();
    });
  });

  // ── Step Navigation ──
  indicators.forEach((ind, i) => {
    ind.addEventListener('click', () => goToStep(i));
  });
  document.querySelectorAll('[data-calc-next]').forEach(btn => {
    btn.addEventListener('click', () => goToStep(state.step + 1));
  });
  document.querySelectorAll('[data-calc-prev]').forEach(btn => {
    btn.addEventListener('click', () => goToStep(state.step - 1));
  });

  function goToStep(n) {
    if (n < 0 || n >= steps.length) return;
    state.step = n;
    steps.forEach((s, i) => s.classList.toggle('is-active', i === n));
    indicators.forEach((ind, i) => {
      ind.classList.remove('is-active', 'is-done');
      if (i === n) ind.classList.add('is-active');
      else if (i < n) ind.classList.add('is-done');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Update Summary ──
  function updateSummary() {
    const itemsEl = document.getElementById('summaryItems');
    const totalEl = document.getElementById('summaryTotal');
    const countEl = document.getElementById('summaryCount');
    let items = [];
    let total = 0;

    // Collect selected cards
    document.querySelectorAll('.calc-card.is-selected').forEach(card => {
      const name = card.querySelector('.calc-card__name').textContent;
      const price = parseInt(card.dataset.price) || 0;
      items.push({ name, price });
      total += price;
    });

    // Collect checked options
    document.querySelectorAll('.calc-check.is-selected').forEach(check => {
      const name = check.querySelector('.calc-check__name').textContent;
      const price = parseInt(check.dataset.price) || 0;
      items.push({ name, price });
      total += price;
    });

    // Collect quantities > 0
    document.querySelectorAll('.calc-qty').forEach(qty => {
      const val = parseInt(qty.querySelector('.calc-qty__value').textContent) || 0;
      if (val > 0) {
        const name = qty.querySelector('.calc-qty__name').textContent;
        const unitPrice = parseInt(qty.dataset.unitPrice) || 0;
        const price = val * unitPrice;
        items.push({ name: `${name} ×${val}`, price });
        total += price;
      }
    });

    // Render
    if (items.length === 0) {
      itemsEl.innerHTML = '<div class="calc-summary__empty">옵션을 선택하시면 여기에 표시됩니다.</div>';
    } else {
      itemsEl.innerHTML = items.map(item => `
        <div class="calc-summary__item">
          <span class="calc-summary__item-name">${item.name}</span>
          <span class="calc-summary__item-price">${formatPrice(item.price)}</span>
        </div>
      `).join('');
    }

    totalEl.textContent = formatPrice(total);
    if (countEl) countEl.textContent = items.length;
  }

  // ── Submit Estimate ──
  document.querySelectorAll('a[href="contact.html"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const items = [];
      let total = 0;

      // 현재 선택된 항목 수집
      document.querySelectorAll('.calc-card.is-selected').forEach(card => {
        items.push(`${card.querySelector('.calc-card__name').textContent} (${card.querySelector('.calc-card__price').textContent})`);
      });
      document.querySelectorAll('.calc-check.is-selected').forEach(check => {
        items.push(`${check.querySelector('.calc-check__name').textContent} (${check.querySelector('.calc-check__price').textContent})`);
      });
      document.querySelectorAll('.calc-qty').forEach(qty => {
        const val = parseInt(qty.querySelector('.calc-qty__value').textContent) || 0;
        if (val > 0) {
          const name = qty.querySelector('.calc-qty__name').textContent;
          const price = formatPrice(val * (parseInt(qty.dataset.unitPrice) || 0));
          items.push(`${name} ×${val} (${price})`);
        }
      });

      const totalStr = document.getElementById('summaryTotal').textContent;
      
      if (items.length > 0) {
        e.preventDefault();
        const estimateData = {
          items: items,
          total: totalStr,
          date: new Date().toLocaleString('ko-KR')
        };
        localStorage.setItem('unifl_estimate', JSON.stringify(estimateData));
        location.href = 'contact.html';
      }
    });
  });

  function formatPrice(n) {
    if (n === 0) return '0원';
    return n.toLocaleString('ko-KR') + '원';
  }

  // Init
  goToStep(0);
  updateSummary();
});
