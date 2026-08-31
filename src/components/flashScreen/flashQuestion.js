import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import ReactFlipCard from "reactjs-flip-card";
import ConfirmBlacklistModal from "../shared/confirmBlacklistModal";

const cardStyle = {
  container: { width: "100%", minHeight: "300px" },
  card: { display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #ccc", borderRadius: "8px" },
  cardCss: "p-3 text-center bg-dark"
}

export default function FlashQuestion({ question, onFlip, onNext, cardFlipped }) {
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showModal, setShowModal] = useState(false);

  function cardFlipHandler() {
    setIsCardFlipped(p => !p);
    onFlip();
  }

  function nextButtonHandler() {
    setIsCardFlipped(false);
    setTimeout(() => { onNext(); }, 150);
  }

  return (<>
    <ReactFlipCard 
      frontComponent={<div className="fw-bold fs-5">{question.Answer}</div>}
      backComponent={<div>{question.Question}</div>}
      onClick={cardFlipHandler}
      flipTrigger="disabled"
      flipByProp={isCardFlipped}
      direction="vertical"
      containerStyle={cardStyle.container}
      frontCss={cardStyle.cardCss}
      frontStyle={cardStyle.card}
      backCss={cardStyle.cardCss}
      backStyle={cardStyle.card}
    />
    {cardFlipped && <Row>
      <Col xs={6}>
        <Button onClick={() => setShowModal(true)} variant="outline-warning" className="fw-bold text-center p-3 mt-4 w-100">
          Blacklist & Next
        </Button>
      </Col>
      <Col xs={6}>
        <Button onClick={nextButtonHandler} variant="primary" className="fw-bold text-center p-3 mt-4 w-100">
          Next
        </Button>
      </Col>
    </Row>}
    <ConfirmBlacklistModal
      show={showModal}
      onHide={() => setShowModal(false)}
      onSave={() => { setShowModal(false); nextButtonHandler(); }}
      question={question}
    />
  </>)
}