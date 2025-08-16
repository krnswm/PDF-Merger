document.getElementById('mergeForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  let formData = new FormData(this);

  let response = await fetch('/merge', { method: 'POST', body: formData });
  let data = await response.json();

  let newTab = window.open(data.file, '_blank');

  let link = document.createElement('a');
  link.href = data.file;
  link.download = "merged.pdf";
  document.body.appendChild(link);
  link.click();
  link.remove();
});
