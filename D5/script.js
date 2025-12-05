const form = document.querySelector("form");
const projectContainer = document.getElementById("projectContainer");

const nameInput = document.getElementById("projectName");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");

const techNode = document.getElementById("tech-node");
const techNext = document.getElementById("tech-next");
const techReact = document.getElementById("tech-react");
const techTS = document.getElementById("tech-ts");

const imageInput = document.getElementById("fileUpload");
const clearBtn = document.getElementById("clear");
const detailsMenu = document.getElementById("details")
const descInput = document.getElementById("desc");

let editingId = null;

function getSaved() {
    return JSON.parse(localStorage.getItem("projects") || "[]");
}

let saved = getSaved();

clearBtn.onclick = (e) => {
    e.preventDefault();
    localStorage.removeItem("projects");
    renderProjects();
};


form.addEventListener("submit", (e) => {
    e.preventDefault();

    saved = getSaved();

    const pickedTechs = [];
    if (techNode.checked) pickedTechs.push("node");
    if (techNext.checked) pickedTechs.push("next");
    if (techReact.checked) pickedTechs.push("react");
    if (techTS.checked) pickedTechs.push("ts");

    const imageFile = imageInput.files?.[0];

    if (editingId) {
        const edit = saved.findIndex(p => p.id === editingId);
        saved[edit] = {
            ...saved[edit],
            name: nameInput.value,
            desc: descInput.value,
            start: startInput.value,
            end: endInput.value,
            techs: pickedTechs,
            image: imageFile ? URL.createObjectURL(imageFile) : saved[edit].image
        };
        editingId = null;

    }else {
        saved.push({
            id: Date.now(),
            name: nameInput.value,
            desc: descInput.value,
            start: startInput.value,
            end: endInput.value,
            techs: pickedTechs,
            image: imageFile ? URL.createObjectURL(imageFile) : null
        });    
    }

    localStorage.setItem("projects", JSON.stringify(saved));
    renderProjects();
});

function toggleDetails() {
    detailsMenu.classList.toggle("hidden");
}

function renderProjects() {
    const saved = getSaved();
    projectContainer.innerHTML = saved.map(project => makeCard(project)).join("");
    lucide.createIcons();
}

function removeProjects(id) {
    const saved = getSaved();
    const updated = saved.filter(p => p.id !== id);
    localStorage.setItem("projects", JSON.stringify(updated));
    renderProjects();
}

function editProjects(id) {
    
    const saved = getSaved();
    const project = saved.find(p => p.id === id);
    if (!project) return;

    editingId = id;
    nameInput.value = project.name;
    descInput.value = project.desc || "";
    startInput.value = project.start;
    endInput.value = project.end;

    techNode.checked = project.techs.includes("node");
    techNext.checked = project.techs.includes("next");
    techReact.checked = project.techs.includes("react");
    techTS.checked = project.techs.includes("ts");
}

function showDetails(id) {
    const saved = getSaved();
    const project = saved.find(p => p.id === id);
    if (!project) return;

    document.getElementById("detailsName").textContent = project.name;
    document.getElementById("detailsImage").src = project.image || "";
    document.getElementById("detailsDate").textContent = `Start: ${project.start}  End: ${project.end}`;
    
    document.getElementById("detailsTech").innerHTML =
        project.techs.map(drawIcon).join("");

    document.getElementById("detailsDesc").textContent =
        project.desc || "No description provided.";

    drawIcon();
    
    toggleDetails();
}


function makeCard(project) {
    return `
        <div class="bg-white shadow p-3 rounded-xl flex flex-col gap-2 text-sm">

            ${project.image ? `<img src="${project.image}" class="w-full h-40 object-cover rounded-lg">` : ""}

            <p class="text-lg font-bold truncate">${project.name}</p>

            <div class="flex flex-row flex-wrap gap-1">
                ${project.techs.map(drawIcon).join("")}
            </div>

            <p class="text-xs text-gray-600">Start: ${project.start} End: ${project.end}</p>

            <div class="flex flex-row flex-wrap gap-1">
                <button onclick="editProjects(${project.id})" class="flex-1 bg-black rounded-xl text-white p-2">Edit</button>
                <button onclick="removeProjects(${project.id})" class="flex-1 bg-black rounded-xl text-white p-2">Remove</button>
            </div>
            <button onclick="showDetails(${project.id})" class="flex-1 bg-black rounded-xl text-white p-2">Details</button>
        </div>
    `;
}

function drawIcon(name) {
    const icons = {
        node: `<i data-lucide="server"></i>`,
        next: `<i data-lucide="circle"></i>`,
        react: `<i data-lucide="atom"></i>`,
        ts: `<i data-lucide="code"></i>`
    };

    return `<div class="p-2 bg-gray-200 rounded">${icons[name] || ""}</div>`;
}

renderProjects();
