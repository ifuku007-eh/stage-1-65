const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f";

document.addEventListener("DOMContentLoaded", () => {
  const id = Number(new URLSearchParams(location.search).get("id"));
  if (!id) return;

  const projects = JSON.parse(localStorage.getItem("projects") || "[]");
  const project = projects.find(p => p.id === id);
  if (!project) return;

  document.getElementById("projectTitle").textContent = project.name;
  document.getElementById("projectDate").textContent =
    `${project.startDate} - ${project.endDate}`;
  document.getElementById("projectDesc").textContent = project.description;
  document.getElementById("projectImage").src =
    project.image || DEFAULT_IMAGE;

  document.getElementById("projectTech").innerHTML =
    project.techs.map(t => `<span class="tech-badge">${t}</span>`).join("");
});
