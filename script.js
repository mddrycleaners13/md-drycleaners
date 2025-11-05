document.addEventListener("DOMContentLoaded", () => {
  // Google Form URL (formResponse)
  const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSd0xZrjiwUZOj1tEwQuul4-zcZ0Xxr90sByNk1ex4peaWco4Q/formResponse";

  const waBtn = document.getElementById("waBtn");
  const summaryCard = document.getElementById("summaryCard");
  const summaryBody = document.querySelector("#summaryTable tbody");
  const grandTotal = document.getElementById("grandTotal");
  const pickupBtn = document.getElementById("pickupBtn");
  const contactScroll = document.getElementById("contactScroll");
  const form = document.getElementById("pickupForm");
  const loading = document.getElementById("loading");
  const success = document.getElementById("successMsg");

  // create popup element
  const popup = document.createElement("div");
  popup.className = "confirmation-popup";
  popup.style.display = "none";
  document.body.appendChild(popup);

  let cart = {};

  /* ---------- Quantity Controls ---------- */
  document.querySelectorAll(".qty-control").forEach((control) => {
    const li = control.closest("li");
    const name = li.dataset.name;
    const price = parseInt(li.dataset.price, 10) || 0;
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

  /* ---------- Update summary ---------- */
  function updateSummary() {
    summaryBody.innerHTML = "";
    let total = 0;

    Object.entries(cart).forEach(([item, { qty, price }]) => {
      const subtotal = qty * price;
      total += subtotal;
      summaryBody.insertAdjacentHTML(
        "beforeend",
        `<tr><td>${item}</td><td>${qty}</td><td>₹${subtotal}</td></tr>`
      );
    });

    grandTotal.textContent = total;

    const totalEl = document.querySelector(".total");
    if (totalEl) {
      totalEl.classList.add("glow");
      setTimeout(() => totalEl.classList.remove("glow"), 550);
    }

    summaryCard.classList.toggle("hidden", Object.keys(cart).length === 0);
  }

  /* ---------- WhatsApp ---------- */
  if (waBtn) {
    waBtn.addEventListener("click", () => {
      window.open(
        "https://wa.me/919821266799?text=Hi!%20I'd%20like%20to%20book%20a%20pickup.",
        "_blank"
      );
    });
  }

  /* ---------- Smooth scroll ---------- */
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

  /* ---------- popup helper ---------- */
  function showPopup(message) {
    popup.textContent = message;
    popup.style.display = "block";
    popup.classList.add("show");
    setTimeout(() => {
      popup.classList.remove("show");
      setTimeout(() => (popup.style.display = "none"), 400);
    }, 2500);
  }

  /* ---------- Submit to Google Form (no-cors) ---------- */
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      loading.style.display = "block";
      success.style.display = "none";

      // Build FormData mapping to your prefilled entry IDs
      const payload = new FormData();
      payload.append("entry.184168943", form.name.value.trim());     // Name
      payload.append("entry.112996281", form.phone.value.trim());    // Phone
      payload.append("entry.1023556561", form.address.value.trim()); // Address
      payload.append("entry.1545633040", form.date.value.trim());    // Date
      payload.append("entry.852038308", form.slot.value.trim());     // Slot
      payload.append("entry.1044400644", form.notes.value.trim());   // Notes
      payload.append("entry.802843789", JSON.stringify(cart));       // Cart (JSON)
      payload.append("entry.77931248", grandTotal.textContent);      // Total

      try {
        // no-cors ensures browser will send data to Google Forms endpoint
        await fetch(FORM_URL, { method: "POST", body: payload, mode: "no-cors" });

        // small delay so popup is visible (no-cors doesn't return a readable response)
        setTimeout(() => {
          loading.style.display = "none";
          showPopup("✅ Request sent successfully!");
          form.reset();
          cart = {};
          updateSummary();
          document.querySelectorAll(".qty").forEach((q) => (q.textContent = "0"));
        }, 900);
      } catch (err) {
        loading.style.display = "none";
        console.error("Form submit error:", err);
        alert("⚠️ Could not send request. Please try again later.");
      }
    });
  }
});
