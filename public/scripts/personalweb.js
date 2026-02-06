const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f";

const form = document.getElementById("projectForm");
const projectList = document.getElementById("projectList");
const filterTech = document.getElementById("filterTech");

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const projects = getProjects();
  const newId = projects.length ? projects.at(-1).id + 1 : 1;

  const project = {
    id: newId,
    name: document.getElementById("projectName").value,
    startDate: document.getElementById("startDate").value,
    endDate: document.getElementById("endDate").value,
    description: document.getElementById("description").value,
    techs: getCheckedTech(),
    image: DEFAULT_IMAGE,
  };

  projects.push(project);
  saveProjects(projects);
  renderProjects(projects);
  form.reset();
});

filterTech.addEventListener("change", () => {
  const tech = filterTech.value;
  const projects = getProjects();

  const filtered =
    tech === "all" ? projects : projects.filter((p) => p.techs.includes(tech));

  renderProjects(filtered);
});

function createProjectCard(p) {
  return `
    <div class="col-md-4">
      <div class="card shadow-sm">
        <img src="${p.image}" class="card-img-top" style="height:150px; object-fit:cover;">
        <div class="card-body">
          <h5>${p.name}</h5>
          <small>${p.startDate} - ${p.endDate}</small>
          <p class="mt-2">${p.description}</p>
          <p><strong>Technologies:</strong> ${p.techs.join(", ")}</p>
          <div class="d-flex gap-2">
            <a href="detail.html?id=${p.id}" class="btn btn-outline-primary btn-sm">Detail</a>
            <button data-id="${p.id}" class="btn btn-outline-dark btn-sm delete-btn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderProjects(projects = getProjects()) {
  projectList.innerHTML = projects.map(createProjectCard).join("");
  attachDeleteCallbacks();
}

function attachDeleteCallbacks() {
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      deleteProject(Number(btn.dataset.id));
    });
  });
}

function deleteProject(id) {
  const projects = getProjects().filter((p) => p.id !== id);
  saveProjects(projects);
  renderProjects(projects);
}

function getProjects() {
  return JSON.parse(localStorage.getItem("projects")) || [];
}

function saveProjects(data) {
  localStorage.setItem("projects", JSON.stringify(data));
}

function getCheckedTech() {
  return [...document.querySelectorAll(".tech:checked")].map((t) => t.value);
}
