import { useContext, useState } from "react";
import QContext from "../../store/question-context";
import { Col, Row } from "react-bootstrap";
import QuizQuestion from "./quizQuestion";
import QuizEnding from "./quizEnding";


export default function QuizMain() {
  const qCtx = useContext(QContext);
  const [questions, setQuestions] = useState(() => shuffleArray(qCtx.questions));
  const [selection, setSelection] = useState(null);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]); // [{ textbook, chapter, amount }]
  const [isFinished, setIsFinished] = useState(false);

  function nextQuestionHandler() {
    if (questions.length > 1) {
      answerHandler();
      setQuestions(p => p.slice(1));
      setSelection(null);
    } else {
      answerHandler();
      setWrongQuestions(p => p.sort((a, b) => b.amount - a.amount));
      setIsFinished(true);
    }
  }

  function answerHandler() {
    if (selection === questions[0].Answer)
      setScore(p => p + 1);
    if (selection !== questions[0].Answer) {
      const existing = wrongQuestions.find(item => item.textbook === questions[0].RelatedTextbook && item.chapter === questions[0].RelatedChapter);
      if (existing) setWrongQuestions(p => p.map(item => item === existing ? { ...item, amount: item.amount + 1 } : item));
      else setWrongQuestions(p => [...p, { textbook: questions[0].RelatedTextbook, chapter: questions[0].RelatedChapter, amount: 1 }]);
    }
  }

  return (<>
    <Row className="fs-4 fw-bold text-primary p-3">
      <Col xs="8">{questions[0].CourseName}</Col>
      <Col xs="4" className="text-end">{qCtx.questions.length - (questions.length - 1)} / {qCtx.questions.length}</Col>
    </Row>
    {!isFinished && <QuizQuestion question={questions[0]} selection={selection} setSelection={setSelection} nextQuestionHandler={nextQuestionHandler} />}
    {isFinished && <QuizEnding score={score} wrongQuestions={wrongQuestions} />}
  </>);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}