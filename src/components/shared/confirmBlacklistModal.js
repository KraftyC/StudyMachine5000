import { Button, Modal } from "react-bootstrap";
import useBlacklist from "../hooks/useBlacklist";

export default function ConfirmBlacklistModal(props) {
  const { Add } = useBlacklist();

  function ConfirmBlacklist() {
    Add(props.question);
    props.onSave();
  }

  return (
    <Modal { ...props } backdrop="static" data-bs-theme="dark">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Blacklist Question</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-center fs-6">Blacklisting removes the question from your quiz and prevents it from appearing in future quizzes.</p>
        <p className="text-center fs-6">Adjustments can be made at any time from the home screen.</p>
        <br/>
        <p className="text-center fs-5 fw-bold">Add this question to the blacklist?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>Close</Button>
        <Button variant="success" onClick={ConfirmBlacklist}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}