import { useContext, useEffect, useState } from "react";
import QContext from "../../store/question-context";
import { Button, Col, Row } from "react-bootstrap";


export default function SelectOrigin() {
  const qCtx = useContext(QContext);
  const [availableOrigins, setAvailableOrigins] = useState([]);

  useEffect(() => {
    setAvailableOrigins([ ...new Set(qCtx.selection.chapters.flatMap(ch => ch.origins)) ].sort((a, b) => a.localeCompare(b)));
  }, [qCtx.selection.chapters])

  function selectOriginHandler(origin) {
    if (!qCtx.selection.origins.includes(origin))
      qCtx.setSelection(p => ({ ...p, origins: [ ...p.origins, origin ], quantity: null }));
    else 
      qCtx.setSelection(p => ({ ...p, origins: p.origins.filter(o => o !== origin), quantity: null }));
  }

  function buttonVariant(origin) {
    return qCtx.selection.origins.includes(origin) ? "info" : "secondary";
  }

  function questionCount(origin) {
    return qCtx.questions.filter(q => 
      q.CourseCode === qCtx.selection.courseCode && 
      qCtx.selection.chapters.find(c => c.textbook === q.RelatedTextbook && c.chapter === q.RelatedChapter) &&
      q.Origin === origin).length;
  }

  return (<>
    <Row className="text-center fw-bold fs-5 px-3 py-2 justify-content-center">Select Sources:</Row>
    <Row className="mb-2">
      {availableOrigins.map(origin => (
        <Col key={origin} xs={12 / availableOrigins.length} className="px-1">
          <Button onClick={() => selectOriginHandler(origin)} variant={buttonVariant(origin)} className="w-100">
            {fullNameConverter(origin)}
            <br />
            {questionCount(origin)} Q's
          </Button>
        </Col>
      ))}
    </Row>
  </>)
}

function fullNameConverter(abbr) {
  if (abbr === "P") return "Professor";
  if (abbr === "T") return "Textbook";
  return abbr;
}