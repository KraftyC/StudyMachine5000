import { useContext, useEffect, useState } from "react";
import QContext from "../../store/question-context";
import GameHeader from "../shared/gameHeader";
import useQuestionPrep from "../hooks/useQuestionPrep";
import FlashQuestion from "./flashQuestion";
import FlashEnding from "./flashEnding";

export default function FlashMain() {
  const qCtx = useContext(QContext);
  const preparedQuestions = useQuestionPrep();
  const [questions, setQuestions] = useState(qCtx.questions);
  const [cardFlipped, setCardFlipped] = useState(false);
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
      setQuestions(p => p.slice(1));
      setCardFlipped(false);
    } else setIsFinished(true);
  }

  return (<>
    {(!qCtx.isLoading && questions.length > 0) && (<>
      <GameHeader question={questions[0]} qLength={questions.length} qTotal={qCtx.questions.length} isFinished={isFinished} />
      {!isFinished && <FlashQuestion question={questions[0].Answer} answer={questions[0].Question} onFlip={() => setCardFlipped(true)} onNext={nextQuestionHandler} cardFlipped={cardFlipped} />}
      {isFinished && <FlashEnding />}
    </>)}
  </>)
}