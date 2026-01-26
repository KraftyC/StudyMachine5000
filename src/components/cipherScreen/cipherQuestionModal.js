import { Button, Modal } from "react-bootstrap";

export default function CipherQuestionModal(props) {
  return (
    <Modal { ...props } backdrop="static" data-bs-theme="dark" centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 fs-5 fw-bold">Give Up...</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you <i>absolutely</i> sure?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>No, Go Back!</Button>
        <Button variant="success" onClick={props.onConfirm}>Yes</Button>
      </Modal.Footer>
    </Modal>
  );
}