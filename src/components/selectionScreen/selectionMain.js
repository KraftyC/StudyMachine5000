import { useContext } from "react";
import { Button, Row } from "react-bootstrap";
import QContext from "../../store/question-context";


export default function SelectionMain() {
  const qCtx = useContext(QContext);

  function selectCourseHandler(code) {
    qCtx.setCourseCode(code);
  }

  return (<>
    <Row className="fs-4 fw-bold text-primary p-3">
      Study Machine 5000
    </Row>
    {qCtx.availableCourses.map(course => (
      <Row key={course.code}>
        <Button onClick={selectCourseHandler} variant="secondary" className="d-flex justify-content-between p-3">
          <div>{course.code} - {course.name}</div>
          <div className="d-flex gap-3">
            {course.origins.map(origin => (
              <div key={origin}>{origin}</div>
            ))}
          </div>
        </Button>
      </Row>
    ))}
  </>);
}