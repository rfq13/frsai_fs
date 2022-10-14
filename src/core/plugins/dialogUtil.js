import Swal from "sweetalert2";
const toast = (options) => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: options.timer || 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  Toast.fire({
    icon: options.type,
    title: options.message,
    text: options.text,
  });
};
const toastResponse = (response) => {
  let messages = response.message.split(" on fetch");
  toast({
    type: response.success ? "success" : "error",
    message: response.message,
  });
};
const toastErrors = (errors) => {
  try {
    let html = Object.keys(errors).reduce((acc, key) => {
      let errs = errors[key].reduce((acc2, err) => `${acc2} ${err} <br>`, "");
      return acc + `Please check your ${key}, <br>${errs}`;
    }, "");
    Swal.fire({
      icon: "error",
      title: "Something went wrong!",
      html,
    });
  } catch (err) {
    console.log(err);
  }
};
const showMessage = (options = {}) => {
  options.type = options.type || "info";
  options.positiveLabel = "OK";
  options.showCancelButton = false;
  options.title = "Message";
  confirm(options);
};
const showError = (message) => {
  toast({
    type: "error",
    message: message || "Something went wrong!",
  });
};
const confirm = (options) => {
  let swalOptions = {
    title: options.title || "Confirmation",
    text: options.message,
    showCancelButton: options.showCancelButton || false,
    showCloseButton: true,
    confirmButtonText: options.positiveLabel || "Yes",
    cancelButtonText: options.negativeLabel || "Cancel",
    reverseButtons: false,
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  };
  if (options.imageUrl) {
    swalOptions.imageUrl = options.imageUrl;
  } else {
    swalOptions.icon = options.type || "question"; // "success", "error", "warning", "info" or "question"
  }
  if (options.imageWidth) {
    swalOptions.imageWidth = options.imageWidth;
  }
  if (options.imageHeight) {
    swalOptions.imageHeight = options.imageHeight;
  }
  Swal.fire(swalOptions).then((result) => {
    if (result.value) {
      if (typeof options.onYes === "function") {
        options.onYes();
      }
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      if (typeof options.onCancel === "function") {
        options.onCancel();
      }
    } else if (result.dismiss === Swal.DismissReason.close) {
      if (typeof options.onClose === "function") {
        options.onClose();
      }
    } else if (result.dismiss === Swal.DismissReason.backdrop) {
      if (typeof options.onClickOutside === "function") {
        options.onClickOutside();
      }
    }
  });
};
const saveConfirm = (onYes) => {
  confirm({
    type: "question",
    message: "Save data?",
    onYes: onYes,
  });
};
const deleteConfirm = (onYes) => {
  confirm({
    type: "question",
    message: "Apakah Anda Yakin?",
    onYes: onYes,
    showCancelButton: true,
    positiveLabel: "Ya",
    negativeLabel: "Tidak",
  });
};
export {
  toast,
  toastResponse,
  toastErrors,
  showMessage,
  showError,
  confirm,
  saveConfirm,
  deleteConfirm,
};
