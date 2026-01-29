const form = document.getElementById("projectForm");
const projectList = document.getElementById("projectList");

document.addEventListener("DOMContentLoaded", loadProjects);

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const project = {
    id: Date.now(),
    name: document.getElementById("projectName").value,
    startDate: document.getElementById("startDate").value,
    endDate: document.getElementById("endDate").value,
    description: document.getElementById("description").value,
    techs: getTechnologies(),
  };

  saveProject(project);
  renderProjects();
  form.reset();
});

function getTechnologies() {
  const techs = [];
  document.querySelectorAll(".tech:checked").forEach((item) => {
    techs.push(item.value);
  });
  return techs;
}

function saveProject(project) {
  const projects = getProjects();
  projects.push(project);
  localStorage.setItem("projects", JSON.stringify(projects));
}

function getProjects() {
  return JSON.parse(localStorage.getItem("projects")) || [];
}

function loadProjects() {
  renderProjects();
}

function renderProjects() {
  projectList.innerHTML = "";
  const projects = getProjects();

  projects.forEach((project) => {
    projectList.innerHTML += `
      <div class="col-md-4">
        <div class="card shadow-sm">
          <img src="https://scontent-cgk1-2.xx.fbcdn.net/v/t39.30808-6/414700485_6895025707291402_4078742399443841050_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=0NjRBiLj2RkQ7kNvwH_lbvb&_nc_oc=Adk20k9TCHTe5Avo-nlCFm2sA_IynPyF7qpMYL0_11FmSFHV3c7as5lXyuwPyQ9s2ic&_nc_zt=23&_nc_ht=scontent-cgk1-2.xx&_nc_gid=h0Ks-UT-ZplkuWFU7cDBPA&oh=00_AfpoQunMa4OS9DHaLN0fEcSU6-4OtC_KDGIcP4NRij7qiw&oe=69810EBB" class="card-img-top">
          <div class="card-body">
            <h5 class="card-title">${project.name}</h5>
            <small class="text-muted">
              ${project.startDate} - ${project.endDate}
            </small>
            <p class="card-text mt-2">${project.description}</p>
            <p class="fw-bold mb-1">Technologies:</p>
            <p>${project.techs.join(", ")}</p>

            <div class="d-flex gap-2">
              <button 
                class="btn btn-outline-dark btn-sm"
                onclick="deleteProject(${project.id})">
                delete
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

function deleteProject(id) {
  let projects = getProjects();
  projects = projects.filter((project) => project.id !== id);
  localStorage.setItem("projects", JSON.stringify(projects));
  renderProjects();
}
