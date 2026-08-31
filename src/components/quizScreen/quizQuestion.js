import { useEffect, useState } from "react";
import { Button, Col,Row } from "react-bootstrap";
import { shuffleArray } from "../../lib/helperFunctions";
import ConfirmBlacklistModal from "../shared/confirmBlacklistModal";

export default function QuizQuestion({ question, selection, setSelection, nextQuestionHandler }) {
  const isSata = question.Answer.length > 1;
  const parsedQuestion = sataObjMaker(question);
  const [sata, setSata] = useState(parsedQuestion.selectionObj);
  const [optionLetters, setOptionLetters] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setSata(parsedQuestion.selectionObj);
    setOptionLetters(Object.keys(parsedQuestion.answerObj).length > 2 ? shuffleArray(Object.keys(parsedQuestion.answerObj)) : Object.keys(parsedQuestion.answerObj));
    // eslint-disable-next-line
  }, [question])

  function variantHandler(option) {
    const answerObj = parsedQuestion.answerObj;

    if (!selection) return sata[option] ? "warning" : "outline-light";
    
    if (!isSata) {
      if (answerObj[option]) return "success"
      if (!answerObj[option] && sata[option]) return "danger"
      return "outline-light";
    }

    if (answerObj[option] === sata[option])
      return sata[option] ? "success" : "outline-success";
    else
      return sata[option] ? "outline-danger" : "danger";
  }

  function optionHandler(option) {
    if (!isSata) setSelection(option);
    setSata(p => ({ ...p, [option]: !p[option] }));
  }

  function submitHandler() {
    const result = Object.entries(sata).filter(([key, value]) => value).map(([key]) => key).join("|");
    setSelection(result);
  }

  return (<>
    <Row className="justify-content-center p-3 text-center">
      <span>
        {question.Question}
        {isSata && <i> (Select all that apply)</i>}
      </span>
    </Row>
    {optionLetters.map(o => (
      <Row key={o} className="d-flex justify-content-center">
        <Button key={o} onClick={() => optionHandler(o)} disabled={selection != null} variant={variantHandler(o)} className="text-center p-3 m-2 w-100">
          {question["Option" + o]}
        </Button>
      </Row>
    ))}
    {(!selection && question.Answer.length > 1) && <Row className="d-flex justify-content-end">
      <Button onClick={submitHandler} variant="primary" disabled={Object.values(sata).every(o => !o)} className="fw-bold text-center p-3 mt-4 w-50">
        Submit
      </Button>
    </Row>}
    {selection && <Row>
      <Col xs={6}>
        <Button onClick={() => setShowModal(true)} variant="outline-warning" className="fw-bold text-center p-3 mt-4 w-100">
          Blacklist & Next
        </Button>
      </Col>
      <Col xs={6}>
        <Button onClick={nextQuestionHandler} variant="primary" className="fw-bold text-center p-3 mt-4 w-100">
          Next
        </Button>
      </Col>
    </Row>}
    <ConfirmBlacklistModal 
      show={showModal}
      onHide={() => setShowModal(false)}
      onSave={() => { setShowModal(false); nextQuestionHandler(); }}
      question={question}
    />
  </>);
}

function sataObjMaker(question) {
  const result = { selectionObj: {}, answerObj: {} };
  const options = ["A", "B", "C", "D", "E", "F"];

  options.forEach(o => {
    if (question["Option" + o] !== "") {
      result.selectionObj[o] = false;
      result.answerObj[o] = question.Answer.includes(o);
    }
  });

  return result;
}