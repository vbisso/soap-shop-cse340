const reviewForms = document.querySelectorAll(".review-form");
const addReviewButton = document.querySelectorAll(".add-review-button");

addReviewButton.forEach((button) => {
  button.addEventListener("click", () => {
    const form = button.closest("li").querySelector(".review-form");
    form.classList.remove("hidden");

    const cancelButton = form.querySelector(".cancel-button");
    cancelButton.addEventListener("click", () => {
      form.classList.add("hidden");
    });
  });
});
