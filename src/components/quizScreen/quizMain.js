import { useContext, useEffect, useState } from "react";
import QContext from "../../store/question-context";
import GameHeader from "../shared/gameHeader";
import QuizQuestion from "./quizQuestion";
import QuizEnding from "./quizEnding";
import useQuestionPrep from "../hooks/useQuestionPrep";

export default function QuizMain() {
  const qCtx = useContext(QContext);
  const preparedQuestions = useQuestionPrep();
  const [questions, setQuestions] = useState([]);
  const [selection, setSelection] = useState(null);
  const [score, setScore] = useState(0);
  const [wrongQuestions, setWrongQuestions] = useState([]); // [{ textbook, chapter, amount }]
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    qCtx.setIsLoading(true);
    qCtx.setQuestions(preparedQuestions);
    setQuestions(preparedQuestions);
    qCtx.setIsLoading(false);
    // eslint-disable-next-line
  }, [preparedQuestions]);

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
      <GameHeader question={questions[0]} qLength={questions.length} qTotal={qCtx.questions.length} isFinished={isFinished} />
      {!isFinished && <QuizQuestion question={questions[0]} selection={selection} setSelection={setSelection} nextQuestionHandler={nextQuestionHandler} />}
      {isFinished && <QuizEnding score={score} wrongQuestions={wrongQuestions} />}
    </>)}
  </>);
}