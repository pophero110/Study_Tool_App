document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#form").addEventListener("sumbit", (e) => {
    console.log("form");
    e.preventDefault();
  });
});
