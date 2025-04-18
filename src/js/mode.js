const darkModeToggle = document.getElementById("checkbox");
const html = document.documentElement;

// Check for previously saved theme in localStorage
if (localStorage.getItem("theme") === "dark") {
  html.classList.add("dark"); // Apply dark mode if previously saved
}

// Toggle dark mode on button click
darkModeToggle.addEventListener("click", () => {
  html.classList.toggle("dark"); // Toggle the 'dark' class
  // Save the user's preference
  if (html.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});
