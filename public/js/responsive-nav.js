document.addEventListener("DOMContentLoaded", () => {
  const navButton = document.getElementById("nav-button");
  const navListMobile = document.getElementById("nav-list-mobile");

  navButton.addEventListener("click", () => {
    navListMobile.classList.toggle("hidden");
  });

  if (screen.width > 768) {
    navListMobile.classList.add("hidden");
  }
});
//   const navList = document.getElementById("nav-list");
//   navButton.addEventListener("click", () => {
//     navList.classList.toggle("hidden");
//     navList.classList.toggle("flex");
//   });
// });
