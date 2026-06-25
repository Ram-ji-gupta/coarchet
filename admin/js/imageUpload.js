// Image preview for file input
const imageFileInput = document.getElementById("imageFile");
if (imageFileInput) {
  imageFileInput.addEventListener("change", function () {
    const preview = document.getElementById("preview");
    const file = this.files[0];
    if (file && preview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.src = e.target.result;
        preview.style.display = "block";
      };
      reader.readAsDataURL(file);
    }
  });
}
