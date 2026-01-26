import { useContext, useEffect, useState } from "react";
import QContext from "../../store/question-context";
import GameHeader from "../shared/gameHeader";
import useQuestionPrep from "../hooks/useQuestionPrep";
import CipherQuestion from "./cipherQuestion";
import CipherEnding from "./cipherEnding";

export default function CipherMain() {
  const qCtx = useContext(QContext);
  const preparedQuestions = useQuestionPrep();
  const [questions, setQuestions] = useState(qCtx.questions);
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

  function nextQuestionHandler(isCorrect) {
    if (questions.length > 1) {
      isCorrect ? setScore(p => p + 1) : wrongAnswerHandler();
      setQuestions(p => p.slice(1));
    } else {
      isCorrect ? setScore(p => p + 1) : wrongAnswerHandler();
      setWrongQuestions(p => p.sort((a, b) => b.amount - a.amount));
      setIsFinished(true);
    }
  }

  function wrongAnswerHandler() {
    const existing = wrongQuestions.find(item => item.textbook === questions[0].RelatedTextbook && item.chapter === questions[0].RelatedChapter);
    if (existing) setWrongQuestions(p => p.map(item => item === existing ? { ...item, amount: item.amount + 1 } : item));
    else setWrongQuestions(p => [...p, { textbook: questions[0].RelatedTextbook, chapter: questions[0].RelatedChapter, amount: 1 }])
  }

  return (<>
    {(!qCtx.isLoading && questions.length > 0) && (<>
      <GameHeader courseName={questions[0].CourseName} qLength={questions.length} qTotal={qCtx.questions.length} origin={questions[0].Origin} />
      {!isFinished && <CipherQuestion question={questions[0]} onNext={nextQuestionHandler} />}
      {isFinished && <CipherEnding score={score} wrongQuestions={wrongQuestions} />}
    </>)}
  </>)
}