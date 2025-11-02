document.addEventListener("DOMContentLoaded", () => {
  // Google Apps Script endpoint (confirmed)
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw8c4fjzl-rteNlO8z1V03T91EixcSUZ_E4xGlZE3yzx-xYIaL0yN7J-sMfntw3Jcfy/exec";

  const waBtn = document.getElementById("waBtn");
  const summaryCard = document.getElementById("summaryCard");
  const summaryBody = document.querySelector("#summaryTable tbody");
  const grandTotal = document.getElementById("grandTotal");
  const pickupBtn = document.getElementById("pickupBtn");
  const contactScroll = document.getElementById("contactScroll");
  const form = document.getElementById("pickupForm");
  const loading = document.getElementById("loading");
  const success = document.getElementById("successMsg");

  let cart = {};

  // Attach quantity listeners
  document.querySelectorAll(".qty-control").forEach((control) => {
    const li = control.closest("li");
    const name = li.dataset.name;
    const price = parseInt(li.dataset.price, 10);
    const minus = control.querySelector(".minus");
    const plus = control.querySelector(".plus");
    const qtySpan = control.querySelector(".qty");

    minus.addEventListener("click", () => {
      if (!cart[name]) return;
      cart[name].qty--;
      if (cart[name].qty <= 0) delete cart[name];
      qtySpan.textContent = cart[name]?.qty || 0;
      updateSummary();
    });

    plus.addEventListener("click", () => {
      if (!cart[name]) cart[name] = { qty: 0, price };
      cart[name].qty++;
      qtySpan.textContent = cart[name].qty;
      updateSummary();
    });
  });

  // Update summary and total + glow animation
  function updateSummary() {
    summaryBody.innerHTML = "";
    let total = 0;
    Object.entries(cart).forEach(([item, { qty, price }]) => {
      const subtotal = qty * price;
      total += subtotal;
      const row = `<tr><td>${item}</td><td>${qty}</td><td>₹${subtotal}</td></tr>`;
      summaryBody.insertAdjacentHTML("beforeend", row);
    });

    grandTotal.textContent = total;

    // add glow animation to total
    const totalEl = document.querySelector(".total");
    if (totalEl) {
      totalEl.classList.add("glow");
      setTimeout(() => totalEl.classList.remove("glow"), 550);
    }

    summaryCard.classList.toggle("hidden", Object.keys(cart).length === 0);
  }

  // WhatsApp quick chat
  if (waBtn) {
    waBtn.addEventListener("click", () => {
      window.open("https://wa.me/919821266799?text=Hi!%20I'd%20like%20to%20book%20a%20pickup.", "_blank");
    });
  }

  // Smooth scroll
  if (contactScroll) {
    contactScroll.addEventListener("click", () => {
      document.getElementById("contactUs").scrollIntoView({ behavior: "smooth" });
    });
  }
  if (pickupBtn) {
    pickupBtn.addEventListener("click", () => {
      document.getElementById("pickup").scrollIntoView({ behavior: "smooth" });
    });
  }

  // Form submit -> Google Apps Script
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      loading.style.display = "block";
      success.style.display = "none";

      const data = new FormData(form);
      data.append("cart", JSON.stringify(cart));
      data.append("total", grandTotal.textContent);

      // Use no-cors mode since GAS is often set that way
      fetch(SCRIPT_URL, { method: "POST", mode: "no-cors", body: data })
        .then(() => {
          loading.style.display = "none";
          success.style.display = "block";
          form.reset();
          cart = {};
          updateSummary();
          document.querySelectorAll(".qty").forEach((q) => (q.textContent = "0"));
          setTimeout(() => (success.style.display = "none"), 3000);
        })
        .catch((err) => {
          loading.style.display = "none";
          console.error(err);
          alert("⚠️ Something went wrong. Please try again later.");
        });
    });
  }
});
