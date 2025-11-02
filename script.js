document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pickupForm");
  const loading = document.getElementById("loading");
  const success = document.getElementById("successMsg");
  const contactScroll = document.getElementById("contactScroll");
  const waBtn = document.getElementById("waBtn");
  const pickupBtn = document.getElementById("pickupBtn");

  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw8c4fjzl-rteNlO8z1V03T91EixcSUZ_E4xGlZE3yzx-xYIaL0yN7J-sMfntw3Jcfy/exec";

  contactScroll.addEventListener("click", () => {
    document.getElementById("contactUs").scrollIntoView({ behavior: "smooth" });
  });

  pickupBtn.addEventListener("click", () => {
    document.getElementById("pickup").scrollIntoView({ behavior: "smooth" });
  });

  waBtn.addEventListener("click", () => {
    window.open("https://wa.me/919821266799?text=Hi!%20I'd%20like%20to%20inquire%20about%20your%20dry%20cleaning%20pickup%20service.", "_blank");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    loading.style.display = "block";
    success.style.display = "none";

    const data = new FormData(form);

    fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: data
    }).then(() => {
      loading.style.display = "none";
      success.style.display = "block";
      form.reset();
      setTimeout(() => (success.style.display = "none"), 3000);
    }).catch(() => {
      loading.style.display = "none";
      alert("⚠️ Something went wrong. Please try again later.");
    });
  });
});
