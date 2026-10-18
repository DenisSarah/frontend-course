import { useEffect, useRef } from 'react';

export function Modal({ title, onClose, busy = false, children }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog.open) dialog.showModal();
    return () => dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="modal"
      aria-labelledby="modal-heading"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
    >
      <div className="modal-header">
        <h2 id="modal-heading">{title}</h2>
        <button className="close-button" type="button" onClick={onClose} disabled={busy} aria-label="Закрыть">
          ×
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </dialog>
  );
}
