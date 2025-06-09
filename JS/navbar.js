document.addEventListener("scroll", () => {
  const header = document.querySelector(".navbar-bg");
  const burger = document.querySelector(".nav-burger");
  if (window.scrollY > 300) {
    header.classList.add("scrolled");
    burger.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
    burger.classList.remove("scrolled");
  }
});

document.querySelector(".nav-burger").addEventListener("click", () => {
  const sidebar = document.querySelector(".navbar-sm");
  if (sidebar.style.display === "flex") {
    sidebar.classList.remove("animate__slideInRight");
    sidebar.classList.add("animate__animated", "animate__slideOutRight");

    sidebar.addEventListener("animationend", function handler() {
      sidebar.style.display = "none";
      sidebar.classList.remove("animate__animated", "animate__slideOutRight");

      sidebar.removeEventListener("animationend", handler);
    });
  } else {
    sidebar.style.display = "flex";
    sidebar.classList.remove("animate__slideOutRight");
    sidebar.classList.add("animate__animated", "animate__slideInRight");
    sidebar.addEventListener("animationend", function handler() {
      sidebar.classList.remove("animate__animated", "animate__slideInRight");
      sidebar.removeEventListener("animationend", handler);
    });
  }
});

const logo = document.getElementById("logo");

logo.addEventListener("click", function () {
  document.getElementById("parallax-scroll").scrollIntoView({
    behavior: "smooth",
  });
});
