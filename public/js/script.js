const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const errorMessageDiv = document.getElementById('errorMessage');

let selectedFiles = [];

dropZone.addEventListener("click", () => fileInput.click())

fileInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragleave", () => {
  dropZone.classList.remove("drag-over");
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("drag-over");
  handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
  for(let file of files) {
    if(file.type === "application/pdf"){
      selectedFiles.push(file);
    }
  }
  renderFileList();
}

function renderFileList() {
  fileList.innerHTML = "";
  selectedFiles.forEach((file, index) => {
    let li = document.createElement("li");
    li.textContent = file.name;
    fileList.appendChild(li);
  });
}

function showError(message) {
  errorMessageDiv.textContent = message;
}

function clearError() {
  errorMessageDiv.textContent = "";
}

document.getElementById("mergeForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  clearError();

  let formData = new FormData();
  selectedFiles.forEach((file) => formData.append("pdfs", file));

  let response = await fetch("/merge", { method: "POST", body: formData });

  if (!response.ok) {
    let errorMsg = await response.text();
    showError(errorMsg);
    return;
  }

  let data = await response.json();

  let newTab = window.open(data.file, "_blank");

  let link = document.createElement("a");
  link.href = data.file;
  link.download = "merged.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
});