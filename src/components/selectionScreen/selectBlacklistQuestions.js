import { useContext, useEffect, useState } from "react";
import QContext from "../../store/question-context";
import { Button, Col, Row } from "react-bootstrap";
import useBlacklist from "../hooks/useBlacklist";
import EditBlacklistModal from "../shared/editBlacklistModal";
import DeleteBlacklistButton from "../shared/deleteBlacklistButton";
import { questionKey } from "../../lib/helperFunctions";

export default function SelectBlacklistQuestions() {
  const qCtx = useContext(QContext);
  const { Get, RemoveOne } = useBlacklist();
  const [availableQuestions, setAvailableQuestions] = useState([]); // [{ textbook, chapter, origins }]
  const [editModal, setEditModal] = useState(null);

  useEffect(() => {
    const questions = Get(qCtx.selection.courseCode).filter(q => q.RelatedChapter === qCtx.selection.chapters[0].chapter);
    setAvailableQuestions(questions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qCtx.selection.chapters[0], qCtx.blacklist]);

  return (<>
    <Row className="text-center fw-bold fs-5 p-3 pt-2 justify-content-center">Select Blacklisted Questions:</Row>
    {availableQuestions.map(question => (
      <Row key={questionKey(question)} className="mb-2">
        <Col xs="10" className="p-0">
          <Button variant="secondary" className="d-flex justify-content-between px-3 py-2 w-100">
            <div className="text-start">{question.Question}</div>
          </Button>
        </Col>
        <Col xs="2" className="p-0 d-flex justify-content-end">
          <DeleteBlacklistButton onClick={() => setEditModal(question)} />
        </Col>
      </Row>
    ))}
    <EditBlacklistModal
      show={editModal}
      editType=""
      criteria={editModal ? editModal.Question : ""}
      onHide={() => setEditModal(null)}
      onConfirm={() => { RemoveOne(editModal); setEditModal(null); }}
    />
  </>)
}