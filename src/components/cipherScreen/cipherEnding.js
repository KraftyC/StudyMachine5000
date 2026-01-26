import { useContext } from "react";
import { Button, Row } from "react-bootstrap";
import QContext from "../../store/question-context";


export default function CipherEnding({ score, wrongQuestions }) {
  const qCtx = useContext(QContext);

  return (<>
    <Row className="fs-4 fw-bold p-3 justify-content-center text-center">
      Cipher Finished!<br />Final Results: {score} / {qCtx.questions.length}
    </Row>
    <Row className="p-3 justify-content-center fw-bold">
      Here's where to focus your studies:
    </Row>
    {wrongQuestions.length === 0 && <Row className="p-3 justify-content-center text-center border-top fs-5">
      You got every question right!<br />Amazing job!
    </Row>}
    {wrongQuestions.length > 0 && wrongQuestions.map(item => (
      <Row key={item.textbook + item.chapter} className="p-3 justify-content-center text-center border-top">
        {item.textbook}: Chapter {item.chapter}<br />{item.amount} question{item.amount > 1 ? "s" : ""} wrong
      </Row>
    ))}
    <Button variant="primary" className="fw-bold text-center p-3 mt-4 w-100" onClick={() => window.location.reload()}>
      Start A New Quiz
    </Button>
  </>);
}