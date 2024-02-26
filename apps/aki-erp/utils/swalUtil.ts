import Swal, { SweetAlertOptions } from 'sweetalert2';

const alertSwal = Swal.mixin({
  customClass: {
    popup: '!bg-base-100',
    title: '!text-base-content',
    htmlContainer: '!text-base-content',
  },
});

export const showSuccess = (message: string) => {
  return alertSwal.fire({
    icon: 'success',
    title: message,
    showConfirmButton: false,
    timer: 1500,
  });
};

export const showWarning = (message: string) => {
  return alertSwal.fire({
    icon: 'warning',
    title: message,
    confirmButtonText: '確認',
  });
};

export const showError = (message: string) => {
  return alertSwal.fire({
    icon: 'error',
    title: message,
    confirmButtonText: '確認',
  });
};

export const showConfirm = (options: SweetAlertOptions) => {
  return alertSwal.fire({
    customClass: {
      popup: '!bg-base-100',
      title: '!text-base-content',
      htmlContainer: '!text-base-content',
      confirmButton: 'btn !btn-success',
      cancelButton: 'btn !btn-danger',
      denyButton: 'btn !btn-error',
    },
    showCancelButton: true,
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    ...options,
  });
};
