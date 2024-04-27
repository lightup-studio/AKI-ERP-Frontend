interface DialogProps {
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onClose, children }) => {
  return (
    <>
      {open && (
        <dialog className="modal" open={open}>
          <div className="modal-box w-11/12 max-w-5xl">{children}</div>

          <form method="dialog" className="modal-backdrop">
            <button onClick={onClose}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
};

export default Dialog;
