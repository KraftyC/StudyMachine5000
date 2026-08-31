import { Button, Modal } from "react-bootstrap";

export default function EditBlacklistModal(props) {
  return (
    <Modal { ...props } backdrop="static" data-bs-theme="dark">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Blacklist Removal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center fs-6">Confirm the return of the following:</p>
        <p className="text-center fs-5 fw-bold">{props.editType}<br/>{props.criteria}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>Close</Button>
        <Button variant="success" onClick={props.onConfirm}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}