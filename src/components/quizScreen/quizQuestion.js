import { Button, Row } from "react-bootstrap";

export default function QuizQuestion({ question, selection, setSelection, nextQuestionHandler }) {

  function variantHandler(option) {
    if (!selection) return "outline-light";
    if (option === question.Answer) return "success";
    if (option === selection) return "danger";
    return "outline-light";
  }

  return (<>
    <Row className="justify-content-center p-3 text-center">
      {question.Question}
    </Row>
    <Button onClick={() => setSelection("A")} disabled={selection != null} variant={variantHandler("A")} className="text-center p-3 m-2 w-100">
      A. {question.OptionA}
    </Button>
    <Button onClick={() => setSelection("B")} disabled={selection != null} variant={variantHandler("B")} className="text-center p-3 m-2 w-100">
      B. {question.OptionB}
    </Button>
    <Button onClick={() => setSelection("C")} disabled={selection != null} variant={variantHandler("C")} className="text-center p-3 m-2 w-100">
      C. {question.OptionC}
    </Button>
    <Button onClick={() => setSelection("D")} disabled={selection != null} variant={variantHandler("D")} className="text-center p-3 m-2 w-100">
      D. {question.OptionD}
    </Button>
    {selection && <div className="d-flex justify-content-end">
      <Button onClick={nextQuestionHandler} variant="primary" className="fw-bold text-center p-3 mt-4 w-50">
        Next
      </Button>
    </div>}
  </>);
}