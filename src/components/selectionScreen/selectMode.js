import { useContext } from "react";
import QContext from "../../store/question-context";
import { Button, Col, Row } from "react-bootstrap";


export default function SelectMode() {
  const qCtx = useContext(QContext);
  const modes = availableModes(qCtx.selection, qCtx.questions);

  function selectModeHandler(mode) {
    qCtx.setSelection(p => ({ ...p, mode, origins: [], quantity: 0 }));
  }

  function buttonVariant(mode) {
    return qCtx.selection.mode === mode ? "info" : "secondary";
  }

  return (<>
    <Row className="text-center fw-bold fs-5 px-3 py-2 justify-content-center">Select Mode:</Row>
    <Row className="mb-2">
      {modes.map(mode => (
        <Col key={mode} xs={12 / modes.length} className="px-1" style={{ minHeight: "62px"}}>
          <Button onClick={() => selectModeHandler(mode)} variant={buttonVariant(mode)} className="w-100 h-100">
            {mode}
          </Button>
        </Col>
      ))}
    </Row>
  </>)
}

function availableModes(currentSelections, questions) {
  const filteredQuestions = questions.filter(q => q.CourseCode === currentSelections.courseCode &&
    currentSelections.chapters.find(c => c.textbook === q.RelatedTextbook && c.chapter === q.RelatedChapter));

  const modes = [];

  if (filteredQuestions.some(q => q.OptionA === "")) modes.push("Cipher", "Flashcards");
  if (filteredQuestions.some(q => q.OptionA !== "")) modes.push("Multiple Choice");
  
  return modes;
}