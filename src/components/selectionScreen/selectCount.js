import { useContext, useEffect, useState } from "react";
import QContext from "../../store/question-context";
import { Button, Col, Row } from "react-bootstrap";
import SelectCountModal from "./selectCountModal";


export default function SelectCount() {
  const qCtx = useContext(QContext);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [availableCounts, setAvailableCounts] = useState([]);
  const [specifiedCount, setSpecifiedCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const filteredQuestions = qCtx.questions.filter(q => qCtx.selection.mode === "Multiple Choice" ? q.OptionA !== "" : q.OptionA === "");

    const totalQs = filteredQuestions.filter(q => 
      q.CourseCode === qCtx.selection.courseCode && 
      qCtx.selection.chapters.find(c => c.textbook === q.RelatedTextbook && c.chapter === q.RelatedChapter) &&
      qCtx.selection.origins.includes(q.Origin)).length;

    setTotalQuestions(totalQs);

    setAvailableCounts(totalQs < 51 ? [ totalQs, -1 ] : totalQs < 101 ? [ 50, totalQs, -1 ] : [ 50, 100, totalQs, -1 ]);
    // eslint-disable-next-line
  }, [qCtx.selection.origins])

  function selectCountHandler(count) {
    setSpecifiedCount(0);
    qCtx.setSelection(p => ({ ...p, quantity: count }));
  }

  function buttonVariant(count) {
    return qCtx.selection.quantity === count ? "info" : "secondary";
  }

  return (<>
    <Row className="text-center fw-bold fs-5 px-3 py-2 justify-content-center">Select How Many:</Row>
    <Row className="mb-4">
      {availableCounts.map((count, idx) => (
        <Col key={count+idx} xs={12 / availableCounts.length} className="px-1">
          {(count >= 0 && idx !== availableCounts.length -2) && (
            <Button onClick={() => selectCountHandler(count)} variant={buttonVariant(count)} className="w-100 px-1">{count} Q's</Button>
          )}
          {(count >= 0 && idx === availableCounts.length -2) && (
            <Button onClick={() => selectCountHandler(count)} variant={buttonVariant(count)} className="w-100">All Q's</Button>
          )}
          {count === -1 && (
            <Button onClick={() => setShowModal(true)} variant={buttonVariant(specifiedCount)} className="w-100 fst-italic">
              {specifiedCount === 0 ? "Specify" : specifiedCount + " Q's"}
            </Button>
          )}
        </Col>
      ))}
    </Row>
    <SelectCountModal
      show={showModal}
      onHide={() => setShowModal(false)}
      previous={specifiedCount}
      max={totalQuestions}
      onSave={(num) => { setSpecifiedCount(num); qCtx.setSelection(p => ({ ...p, quantity: num })); }}
    />
  </>)
}