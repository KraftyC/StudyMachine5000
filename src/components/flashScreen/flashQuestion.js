import { Button } from "react-bootstrap";
import ReactFlipCard from "reactjs-flip-card";

const cardStyle = {
  container: { width: "100%", minHeight: "300px" },
  card: { display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid #ccc", borderRadius: "8px" },
  cardCss: "p-3 text-center"
}

export default function FlashQuestion({ question, answer, onFlip, onNext, cardFlipped }) {
  return (<>
    <ReactFlipCard 
        frontComponent={<div>{question}</div>}
        backComponent={<div>{answer}</div>}
        onClick={onFlip}
        flipTrigger="onClick"
        direction="vertical"
        containerStyle={cardStyle.container}
        frontCss={cardStyle.cardCss}
        frontStyle={cardStyle.card}
        backCss={cardStyle.cardCss}
        backStyle={cardStyle.card}
      />
      {cardFlipped && <div className="d-flex justify-content-end">
        <Button onClick={onNext} variant="primary" className="fw-bold text-center p-3 mt-4 w-50">
          Next
        </Button>
      </div>}
  </>)
}