function toggleSection(sectionId, btn) {
  const section = document.getElementById(sectionId);
  section.classList.toggle("hidden");

  const icon = btn.querySelector(".collapsible-toggle");
  if (icon) {
    icon.textContent = section.classList.contains("hidden") ? "▼" : "▲";
  }
}
