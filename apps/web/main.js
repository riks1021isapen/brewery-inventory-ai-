const STORAGE_KEY = "brewery-kegs";

const form = document.getElementById("keg-form");
const tableBody = document.getElementById("keg-table-body");

const defaultData = [
  {
    id: "KEG-1001",
    beerName: "Pale Ale",
    capacityL: 20,
    status: "IN_STOCK",
    dueDate: "2026-05-10"
  },
  {
    id: "KEG-1002",
    beerName: "Stout",
    capacityL: 30,
    status: "IN_USE",
    dueDate: "2026-05-05"
  }
];

const loadKegs = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(raw);
};

const saveKegs = (kegs) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(kegs));
};

const render = () => {
  const kegs = loadKegs();
  tableBody.innerHTML = "";

  kegs.forEach((keg, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${keg.id}</td>
      <td>${keg.beerName}</td>
      <td>${keg.capacityL}L</td>
      <td><span class="tag ${keg.status}">${keg.status}</span></td>
      <td>${keg.dueDate}</td>
      <td><button data-index="${index}">削除</button></td>
    `;
    tableBody.appendChild(tr);
  });
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const kegs = loadKegs();

  const next = {
    id: document.getElementById("keg-id").value.trim(),
    beerName: document.getElementById("beer-name").value.trim(),
    capacityL: Number(document.getElementById("capacity").value),
    status: document.getElementById("status").value,
    dueDate: document.getElementById("due-date").value
  };

  kegs.push(next);
  saveKegs(kegs);
  form.reset();
  render();
});

tableBody.addEventListener("click", (event) => {
  if (!(event.target instanceof HTMLButtonElement)) return;

  const index = Number(event.target.dataset.index);
  const kegs = loadKegs();
  kegs.splice(index, 1);
  saveKegs(kegs);
  render();
});

render();
