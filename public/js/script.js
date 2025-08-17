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

    let nameSpan = document.createElement("span");
    nameSpan.textContent = file.name + " ";

    // File size (formatted in KB/MB)
    let sizeSpan = document.createElement("span");
    let fileSizeKB = (file.size / 1024).toFixed(2); // in KB
    sizeSpan.textContent = `(${fileSizeKB < 1024 ? fileSizeKB + " KB" : (fileSizeKB / 1024).toFixed(2) + " MB"}) `;

    // Remove button
    let removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.style.marginLeft = "10px";
    removeBtn.onclick = () => {
      selectedFiles.splice(index, 1); // remove file
      renderFileList(); // refresh list
    };

    // Append everything
    li.appendChild(nameSpan);
    li.appendChild(sizeSpan);
    li.appendChild(removeBtn);
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

  if (selectedFiles.length < 2) {
    showError("Please select at least 2 PDFs to merge.");
    return;
  }

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