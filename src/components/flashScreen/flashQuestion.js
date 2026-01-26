import { useState } from "react";
import { Button } from "react-bootstrap";
import ReactFlipCard from "reactjs-flip-card";

const cardStyle = {
  container: { width: "100%", minHeight: "300px" },
  card: { display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #ccc", borderRadius: "8px" },
  cardCss: "p-3 text-center"
}

export default function FlashQuestion({ question, answer, onFlip, onNext, cardFlipped }) {
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  function cardFlipHandler() {
    setIsCardFlipped(p => !p);
    onFlip();
  }

  function nextButtonHandler() {
    setIsCardFlipped(false);
    setTimeout(() => {
      onNext();
    }, 150);
  }

  return (<>
    <ReactFlipCard 
        frontComponent={<div className="fw-bold fs-5">{question}</div>}
        backComponent={<div>{answer}</div>}
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
      {cardFlipped && <div className="d-flex justify-content-end">
        <Button onClick={nextButtonHandler} variant="primary" className="fw-bold text-center p-3 mt-4 w-50">
          Next
        </Button>
      </div>}
  </>)
}