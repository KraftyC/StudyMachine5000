import { useContext, useEffect, useState } from "react";
import QContext from "../../store/question-context";
import { Col, Row } from "react-bootstrap";
import QuizQuestion from "./quizQuestion";
import QuizEnding from "./quizEnding";


export default function QuizMain() {
  const qCtx = useContext(QContext);
  const [questions, setQuestions] = useState([]);
  const [selection, setSelection] = useState(null);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]); // [{ textbook, chapter, amount }]
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
  qCtx.setIsLoading(true);

  // Step 1: Filter by courseCode
  let filtered = qCtx.questions.filter(q => q.CourseCode === qCtx.selection.courseCode);

  // Step 2: Filter by chapters (textbook & chapter)
  filtered = filtered.filter(q => qCtx.selection.chapters.some(ch => ch.textbook === q.RelatedTextbook && ch.chapter === q.RelatedChapter));

  // Step 3: Filter by origin
  filtered = filtered.filter(q => qCtx.selection.origins.includes(q.Origin));

  // Step 4: Group by textbook & chapter
  const chapterGroups = qCtx.selection.chapters.map(ch => ({ textbook: ch.textbook, chapter: ch.chapter }));

  const grouped = chapterGroups.map(({ textbook, chapter }) => filtered.filter(q => q.RelatedTextbook === textbook && q.RelatedChapter === chapter));

  // Step 5: Distribute questions equally
  const totalQuestions = qCtx.selection.quantity;
  const perGroup = Math.floor(totalQuestions / grouped.length);
  let remainder = totalQuestions % grouped.length;

  let selectedQuestions = [];
  grouped.forEach(group => {
    const shuffled = shuffleArray([...group]);
    let take = perGroup;
    if (remainder > 0) {
      take += 1;
      remainder -= 1;
    }
    selectedQuestions = selectedQuestions.concat(shuffled.slice(0, take));
  });

  // Fill up to totalQuestions if needed, avoiding duplicates
  if (selectedQuestions.length < totalQuestions) {
    // Create a unique key for each question
    const makeKey = q => `${q.CourseCode}|${q.RelatedTextbook}|${q.RelatedChapter}|${q.Question}`;
    const selectedKeys = new Set(selectedQuestions.map(makeKey));
    const remaining = shuffleArray(filtered.filter(q => !selectedKeys.has(makeKey(q))));
    selectedQuestions = selectedQuestions.concat(remaining.slice(0, totalQuestions - selectedQuestions.length));
  }

  // If still not enough, just use all available
  selectedQuestions = selectedQuestions.slice(0, Math.min(totalQuestions, filtered.length));

  // Shuffle final selection
  selectedQuestions = shuffleArray(selectedQuestions);

  qCtx.setQuestions(selectedQuestions);
  setQuestions(selectedQuestions);
  qCtx.setIsLoading(false);
}, [qCtx.selection]);

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
    {(!qCtx.isLoading && questions.length > 0) && (<>
      <Row className="fs-4 fw-bold text-primary p-3 my-3">
        <Col xs="7">{questions[0].CourseName}</Col>
        <Col xs="5" className="text-end">
          {qCtx.questions.length - (questions.length - 1)} / {qCtx.questions.length}
          <br />
          <p className="text-white fst-italic fs-6 fw-normal">{nameOrigin(questions[0].Origin)}</p>
        </Col>
      </Row>
      {!isFinished && <QuizQuestion question={questions[0]} selection={selection} setSelection={setSelection} nextQuestionHandler={nextQuestionHandler} />}
      {isFinished && <QuizEnding score={score} wrongQuestions={wrongQuestions} />}
    </>)}
  </>);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function nameOrigin(origin) {
  switch (origin) {
    case "P":
      return "Professor";
    case "T":
      return "Textbook";
    default:
      return origin;
  }
}