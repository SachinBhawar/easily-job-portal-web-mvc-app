function openModal(button) {
  var modal = button.closest(".card").nextElementSibling;
  modal.classList.add("open-profile-popup");
  var overlay = document.getElementsByClassName("overlay");
  overlay[0].classList.remove("hidden");
}

function closeModal(button) {
  var modal = button.closest(".profile-popup");
  modal.classList.remove("open-profile-popup");
  var overlay = document.getElementsByClassName("overlay");
  overlay[0].classList.add("hidden");
}

function openApplyModal(button) {
  var modal = button.nextElementSibling;
  modal.classList.add("open-profile-popup");
  var overlay = document.getElementsByClassName("overlay");
  overlay[0].classList.remove("hidden");
}

function closeApplyModal(button) {
  var modal = button.closest(".profile-popup");
  modal.classList.remove("open-profile-popup");
  var overlay = document.getElementsByClassName("overlay");
  overlay[0].classList.add("hidden");
}

window.onclick = function (event) {
  if (event.target == modal) {
    modal.classList.remove("open-profile-popup");
    var overlay = document.getElementsByClassName("overlay");
    overlay[0].classList.add("hidden");
  }
};

function confirmDelete() {
  const confirmed = confirm("Are you sure you want to delete this job?");
  if (confirmed) {
    return true;
  } else {
    return false;
  }
}

function confirmApply() {
  const confirmed = confirm("Are you sure you want to Apply to this job?");
  if (confirmed) {
    return true;
  } else {
    return false;
  }
}
