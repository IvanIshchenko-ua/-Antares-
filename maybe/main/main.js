const modal = document.getElementById("modal");
  const thanksModal = document.getElementById("thanksModal");
  const openBtn = document.querySelector(".promo-button");
  const closeBtns = document.querySelectorAll(".close");
  const form = document.getElementById("requestForm");

  openBtn.onclick = () => modal.style.display = "block";
  closeBtns.forEach(btn => btn.onclick = () => {
    modal.style.display = "none";
    thanksModal.style.display = "none";
  });

  form.onsubmit = e => {
    e.preventDefault();
    modal.style.display = "none";
    thanksModal.style.display = "block";
  };

  window.onclick = e => {
    if (e.target == modal) modal.style.display = "none";
    if (e.target == thanksModal) thanksModal.style.display = "none";
  };