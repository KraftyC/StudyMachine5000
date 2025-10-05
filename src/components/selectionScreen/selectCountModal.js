import { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";

export default function SelectCountModal(props) {
  const [specifiedValue, setSpecifiedValue] = useState(props.previous > 0 && props.previous);
  const [isError, setIsError] = useState(false);

  function inputChangeHandler(event) {
    setSpecifiedValue(event.target.value);
    setIsError(false);
  }

  function saveHandler() {
    if (specifiedValue >= 1 && specifiedValue <= props.max) {
      props.onSave(specifiedValue);
      props.onHide();
      setIsError(false);
    } else setIsError(true);
  }

  return (
    <Modal { ...props } backdrop="static" data-bs-theme="dark">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Specify Question Count</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup>
          <InputGroup.Text id="QuestionNumber">Number of Questions (1 - {props.max}):</InputGroup.Text>
          <Form.Control
            type="number" 
            min={1} 
            max={props.max} 
            value={specifiedValue} 
            onChange={inputChangeHandler} 
            onKeyDown={e => { if (e.key === "Enter") saveHandler(); }} 
            autoFocus
          />
          {isError && <Form.Text className="text-danger fst-italic">Please enter a valid number between 1 and {props.max}.</Form.Text>}
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={props.onHide}>Close</Button>
        <Button variant="success" onClick={saveHandler}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}