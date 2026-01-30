const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f";
const form = document.getElementById("projectForm");
const projectList = document.getElementById("projectList");


document.addEventListener("DOMContentLoaded", renderProjects);

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
  image: DEFAULT_IMAGE
};


  projects.push(project);
  saveProjects(projects);

  renderProjects();
  form.reset();
});

function renderProjects() {
  const projects = getProjects();

  projectList.innerHTML = projects
    .map(
      (p) => `
      <div class="col-md-4">
        <div class="card shadow-sm">
          <img 
            src="${p.image || DEFAULT_IMAGE}"
            class="card-img-top"
            style="height:150px; object-fit:cover;"
          />

          <div class="card-body">
            <h5>${p.name}</h5>
            <small>${p.startDate} - ${p.endDate}</small>
            <p class="mt-2">${p.description}</p>
            <p><strong>Technologies:</strong> ${p.techs.join(", ")}</p>
            <div class="d-flex gap-2">
              <a href="detail.html?id=${p.id}" class="btn btn-outline-primary btn-sm">Detail</a>
              <button onclick="deleteProject(${p.id})" class="btn btn-outline-dark btn-sm">Delete</button>
            </div>
          </div>
        </div>
      </div>
    `
    )
    .join("");
}

function deleteProject(id) {
  const projects = getProjects().filter((p) => p.id !== id);
  saveProjects(projects);
  renderProjects();
}

function getProjects() {
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  return projects.map(p => ({
    ...p,
    image: p.image || DEFAULT_IMAGE
  }));
}

function saveProjects(data) {
  localStorage.setItem("projects", JSON.stringify(data));
}

function getCheckedTech() {
  return [...document.querySelectorAll(".tech:checked")].map(
    (t) => t.value
  );
}
