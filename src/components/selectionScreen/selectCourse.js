import { useContext, useEffect, useState } from "react";
import QContext from "../../store/question-context";
import { Button, Col, Row } from "react-bootstrap";
import useBlacklist from "../hooks/useBlacklist";
import EditBlacklistModal from "../shared/editBlacklistModal";
import DeleteBlacklistButton from "../shared/deleteBlacklistButton";

export default function SelectCourse({ isEditBlacklist }) {
  const qCtx = useContext(QContext);
  const { RemoveCourse } = useBlacklist();
  const [availableCourses, setAvailableCourses] = useState([]); // [{ code, name }]
  const [editModal, setEditModal] = useState(null);

  useEffect(() => {
    const findAvailableCourses = () => {
      let courses = [];

      if (isEditBlacklist) {
        courses = qCtx.blacklist.reduce((acc, curr) => {
          if (!acc.find(item => item.code === curr.CourseCode))
            acc.push({ code: curr.CourseCode, name: curr.CourseName });
          return acc;
        }, []);
      } else {
        courses = qCtx.questions.reduce((acc, curr) => {
          if (!acc.find(item => item.code === curr.CourseCode))
            acc.push({ code: curr.CourseCode, name: curr.CourseName });
          return acc;
        }, []);
      }

      return courses.sort((a, b) => a.code.localeCompare(b.code));
    }

    setAvailableCourses(findAvailableCourses());
  }, [isEditBlacklist, qCtx.questions, qCtx.blacklist]);

  function selectCourseHandler(code) {
    qCtx.setSelection({ courseCode: code, chapters: [], mode: null, origins: [], quantity: null });
  }

  function buttonVariant(code) {
    return qCtx.selection.courseCode === code ? "info" : "secondary";
  }

  return (<>
    <Row className="text-centre fw-bold fs-5 p-3 justify-content-center">Select a Course:</Row>
    {availableCourses.map(course => (
      <Row key={course.code} className="mb-2">
        <Col xs={isEditBlacklist ? 10 : 12} className="p-0">
          <Button onClick={() => selectCourseHandler(course.code)} variant={buttonVariant(course.code)} className="d-flex justify-content-between px-3 py-2 w-100">
            <div>{course.code} - {course.name}</div>
          </Button>
        </Col>
        {isEditBlacklist && (
          <Col xs="2" className="p-0 d-flex justify-content-end">
            <DeleteBlacklistButton onClick={() => setEditModal(course.code)} />
          </Col>
        )}
      </Row>
    ))}
    <EditBlacklistModal
      show={editModal}
      editType="All Questions for"
      criteria={editModal}
      onHide={() => setEditModal(null)}
      onConfirm={() => { RemoveCourse(editModal); setEditModal(null); }}
    />
  </>)
}