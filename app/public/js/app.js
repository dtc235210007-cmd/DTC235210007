document.addEventListener('DOMContentLoaded', () => {
  // 1. Quản lý Modal mở / đóng
  const openModalBtns = document.querySelectorAll('[data-modal-target]');
  const closeModalBtns = document.querySelectorAll('[data-modal-close]');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal-target');
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add('active');
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  // Đóng modal khi click ra vùng nền tối
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.remove('active');
    }
  });

  // 2. Tính toán động cho Form Tạo Hóa đơn (invoice-create)
  const itemsContainer = document.getElementById('invoice-items-container');
  const addItemBtn = document.getElementById('btn-add-item');
  const taxRateInput = document.getElementById('tax_rate');
  const subtotalDisplay = document.getElementById('subtotal-display');
  const taxAmountDisplay = document.getElementById('tax-amount-display');
  const totalAmountDisplay = document.getElementById('total-amount-display');

  function calculateInvoiceTotals() {
    if (!itemsContainer) return;
    let subtotal = 0;
    const rows = itemsContainer.querySelectorAll('.item-row');

    rows.forEach(row => {
      const qtyInput = row.querySelector('.item-qty');
      const priceInput = row.querySelector('.item-price');
      const amountDisplay = row.querySelector('.item-amount');

      const qty = parseFloat(qtyInput ? qtyInput.value : 0) || 0;
      const price = parseFloat(priceInput ? priceInput.value : 0) || 0;
      const rowAmount = qty * price;

      if (amountDisplay) {
        amountDisplay.textContent = new Intl.NumberFormat('vi-VN').format(rowAmount) + ' đ';
      }
      subtotal += rowAmount;
    });

    const taxRate = parseFloat(taxRateInput ? taxRateInput.value : 10) || 0;
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount;

    if (subtotalDisplay) subtotalDisplay.textContent = new Intl.NumberFormat('vi-VN').format(subtotal) + ' đ';
    if (taxAmountDisplay) taxAmountDisplay.textContent = new Intl.NumberFormat('vi-VN').format(taxAmount) + ' đ';
    if (totalAmountDisplay) totalAmountDisplay.textContent = new Intl.NumberFormat('vi-VN').format(grandTotal) + ' đ';
  }

  if (itemsContainer) {
    itemsContainer.addEventListener('input', calculateInvoiceTotals);
    if (taxRateInput) taxRateInput.addEventListener('input', calculateInvoiceTotals);

    if (addItemBtn) {
      addItemBtn.addEventListener('click', () => {
        const rowCount = itemsContainer.querySelectorAll('.item-row').length;
        const newRow = document.createElement('tr');
        newRow.className = 'item-row';
        newRow.innerHTML = `
          <td>
            <input type="text" name="items[${rowCount}][description]" class="form-control" placeholder="Tên hàng hóa / dịch vụ..." required>
          </td>
          <td style="width: 120px;">
            <input type="number" step="0.5" min="1" name="items[${rowCount}][quantity]" class="form-control item-qty" value="1" required>
          </td>
          <td style="width: 180px;">
            <input type="number" step="1000" min="0" name="items[${rowCount}][unit_price]" class="form-control item-price" value="0" required>
          </td>
          <td style="width: 160px; text-align: right; font-weight: 600;" class="item-amount">0 đ</td>
          <td style="width: 60px; text-align: center;">
            <button type="button" class="btn btn-danger btn-sm btn-remove-item">✕</button>
          </td>
        `;
        itemsContainer.appendChild(newRow);
        calculateInvoiceTotals();
      });
    }

    itemsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-remove-item')) {
        const rows = itemsContainer.querySelectorAll('.item-row');
        if (rows.length > 1) {
          e.target.closest('.item-row').remove();
          calculateInvoiceTotals();
        } else {
          alert('Hóa đơn cần ít nhất 1 dòng mặt hàng!');
        }
      }
    });

    calculateInvoiceTotals();
  }

  // 3. Demo Trigger Error cho Loki LogQL
  const btnTriggerError = document.getElementById('btn-trigger-error');
  if (btnTriggerError) {
    btnTriggerError.addEventListener('click', async () => {
      try {
        const res = await fetch('/api/trigger-error');
        alert('Đã gửi request sinh log LỖI HTTP 500 thành công! Hãy vào Grafana Explore (Loki) và chạy câu lệnh LogQL để kiểm tra.');
      } catch (err) {
        console.error('Trigger error request failed', err);
      }
    });
  }
});
