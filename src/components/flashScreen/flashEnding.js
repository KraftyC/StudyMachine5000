import { useContext } from "react";
import { Button, Row } from "react-bootstrap";
import QContext from "../../store/question-context";
import { sortChapters } from "../../lib/helperFunctions";

export default function FlashEnding() {
  const qCtx = useContext(QContext);
  const reducedQuestions = QuestionReducer(qCtx.questions);

  return (<>
    <Row className="fs-4 fw-bold py-3 justify-content-center text-center">
      You've completed all flashcards!
    </Row>
    <Row className="pb-3 justify-content-center fw-bold">
      Here's what you reviewed:
    </Row>
    {Object.keys(reducedQuestions).sort((a, b) => a.localeCompare(b)).map(textbook => (
      <Row key={textbook} className="p-3 fst-italic">
        {textbook}
        {Object.keys(reducedQuestions[textbook]).sort((a, b) => sortChapters(a, b)).map(chapter => (
          <Row key={chapter} className="p-2 justify-content-center text-center fst-normal">
            Chapter {chapter}: {reducedQuestions[textbook][chapter]} question{reducedQuestions[textbook][chapter] > 1 ? "s" : ""}
          </Row>
        ))}
      </Row>
    ))}
    <Button variant="primary" className="fw-bold text-center p-3 mt-4 w-100" onClick={() => window.location.reload()}>
      Start A New Quiz
    </Button>
  </>);
}

function QuestionReducer(questions) { // { textbook: { chapter: amount } }
  return questions.reduce((acc, curr) => {
    if (!Object.keys(acc).find(key => key === curr.RelatedTextbook))
      acc[curr.RelatedTextbook] = { [curr.RelatedChapter]: 1 };
    else if (!Object.keys(acc[curr.RelatedTextbook]).includes(curr.RelatedChapter))
      acc[curr.RelatedTextbook][curr.RelatedChapter] = 1;
    else acc[curr.RelatedTextbook][curr.RelatedChapter] += 1;
    return acc;
  }, {});
}