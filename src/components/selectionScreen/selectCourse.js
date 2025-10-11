import { useContext, useEffect, useState } from "react";
import QContext from "../../store/question-context";
import { Button, Row } from "react-bootstrap";


export default function SelectCourse() {
  const qCtx = useContext(QContext);
  const [availableCourses, setAvailableCourses] = useState([]); // [{ code, name }]

  useEffect(() => {
    setAvailableCourses(findAvailableCourses(qCtx.questions));
  }, [qCtx.questions])

  function selectCourseHandler(code) {
    qCtx.setSelection({ courseCode: code, chapters: [], origins: [], quantity: null });
  }

  function buttonVariant(code) {
    return qCtx.selection.courseCode === code ? "info" : "secondary";
  }

  return (<>
    <Row className="text-centre fw-bold fs-5 p-3 justify-content-center">Select a Course:</Row>
    {availableCourses.map(course => (
      <Row key={course.code} className="mb-2">
        <Button onClick={() => selectCourseHandler(course.code)} variant={buttonVariant(course.code)} className="d-flex justify-content-between px-3 py-2">
          <div>{course.code} - {course.name}</div>
        </Button>
      </Row>
    ))}
  </>)
}

function findAvailableCourses(questions) {
  const courses = questions.reduce((acc, curr) => {
    if (!acc.find(item => item.code === curr.CourseCode))
      acc.push({ code: curr.CourseCode, name: curr.CourseName });
    return acc;
  }, []);

  return courses.sort((a, b) => a.code.localeCompare(b.code))
}