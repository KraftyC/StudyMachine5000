import { Row, Col } from "react-bootstrap";

export default function GameHeader({ question, qLength, qTotal, isFinished }) {

  return (<>
    <Row className="fs-5 fw-bold text-primary p-3 my-3">
      <Col xs="8">{question.CourseName}
        {!isFinished && (<>
          <br />
          <p className="text-white fst-italic fs-6 fw-normal m-0">{nameOrigin(question.RelatedChapter)}</p>
        </>)}
      </Col>
      <Col xs="4" className="text-end">
        {qTotal - (qLength - 1)} / {qTotal}
        <br />
        <p className="text-white fst-italic fs-6 fw-normal m-0">{nameOrigin(question.Origin)}</p>
      </Col>
    </Row>
  </>);
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