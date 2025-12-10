const form = document.getElementById("createForm");
const editPopup = document.getElementById("editPopup");
const detailsMenu = document.getElementById("details");
const projectContainer = document.getElementById("projectContainer");
const sideMenu = document.getElementById("sidemenu")
const removalConfirm = document.getElementById("removalConfirm");

const nameInput = document.getElementById("projectName");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const descInput = document.getElementById("desc");
const imageInput = document.getElementById("fileUpload");

const techNode = document.getElementById("tech-node");
const techNext = document.getElementById("tech-next");
const techReact = document.getElementById("tech-react");
const techTS = document.getElementById("tech-ts");

const removeConfirm = document.getElementById("removeConfirm");

let sideExpanded = sideMenu.classList.contains("w-0") ? false : true;

document.getElementById("expand").addEventListener("click", (e) => {
    e.preventDefault();
    sideMenu.classList.remove(sideExpanded ? "w-full" : "w-0");
    sideMenu.classList.add(sideExpanded ? "w-0" : "w-full");
    sideExpanded = sideExpanded ? false : true;
})

let editingId = null;

function getSaved() {
    return JSON.parse(localStorage.getItem("projects") || "[]");
}

function renderProjects() {
    const saved = getSaved();
    projectContainer.innerHTML = saved.map(makeCard).join("");
    lucide.createIcons();
}

function toggleDetails() {
    detailsMenu.classList.toggle("hidden");
}

function toggleEdit() {
    editPopup.classList.toggle("hidden");
    lucide.createIcons();
}

function toggleConfirm() {
    removalConfirm.classList.toggle("hidden");
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

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const techs = [
        techNode.checked && "node",
        techNext.checked && "next",
        techReact.checked && "react",
        techTS.checked && "ts"
    ].filter(Boolean);

    const saved = getSaved();
    saved.push({
        id: Date.now(),
        name: nameInput.value,
        desc: descInput.value,
        start: startInput.value,
        end: endInput.value,
        techs,
        image: imageInput.files?.[0] ? URL.createObjectURL(imageInput.files[0]) : null
    });

    localStorage.setItem("projects", JSON.stringify(saved));
    form.reset();
    renderProjects();
});

let removeId = null;

function removeProjects(id) {

    removeId = id;
    toggleConfirm();
}

removeConfirm.onclick = () => {
    if (removeId !== null) {
        removeFinal(removeId)
        removeId = null;
    }
    toggleConfirm();
}

function removeFinal(id) {
    const updated = getSaved().filter(p => p.id !== id);
    localStorage.setItem("projects", JSON.stringify(updated));
    renderProjects();  
}

function editProjects(id) {
    editingId = id;
    const p = getSaved().find(x => x.id === id);

    document.getElementById("editName").value = p.name;
    document.getElementById("editDesc").value = p.desc;
    document.getElementById("editStart").value = p.start;
    document.getElementById("editEnd").value = p.end;

    toggleEdit();
}

function saveEdit() {
    const saved = getSaved();
    const i = saved.findIndex(x => x.id === editingId);

    saved[i].name = document.getElementById("editName").value;
    saved[i].desc = document.getElementById("editDesc").value;
    saved[i].start = document.getElementById("editStart").value;
    saved[i].end = document.getElementById("editEnd").value;

    localStorage.setItem("projects", JSON.stringify(saved));

    toggleEdit();
    renderProjects();
}

function showDetails(id) {
    const p = getSaved().find(x => x.id === id);

    document.getElementById("detailsName").textContent = p.name;
    document.getElementById("detailsDesc").textContent = p.desc;
    document.getElementById("detailsImage").src = p.image || "";
    document.getElementById("detailsDate").textContent = `Start: ${p.start} | End: ${p.end}`;
    document.getElementById("detailsTech").innerHTML = p.techs.map(drawIcon).join("");

    toggleDetails();
    lucide.createIcons();
}

function makeCard(p) {
    return `
    <div class="bg-white shadow p-3 rounded-xl flex flex-col gap-2 text-sm">

        ${p.image ? `<img src="${p.image}" class="w-full h-40 object-cover rounded-lg">` : ""}

        <p class="text-lg font-bold truncate">${p.name}</p>

        <div class="flex flex-row flex-wrap gap-1">
            ${p.techs.map(drawIcon).join("")}
        </div>

        <p class="text-xs text-gray-600">Start: ${p.start} End: ${p.end}</p>

        <div class="flex flex-row flex-wrap gap-1">
            <button onclick="editProjects(${p.id})" class="flex-1 bg-black rounded-xl text-white p-2">Edit</button>
            <button onclick="removeProjects(${p.id})" class="flex-1 bg-black rounded-xl text-white p-2">Remove</button>
        </div>

        <button onclick="showDetails(${p.id})" class="flex-1 bg-black rounded-xl text-white p-2">Details</button>
    </div>
    `;
}

document.getElementById("clear").onclick = () => {
    localStorage.removeItem("projects");
    renderProjects();
};

renderProjects();
