import { useContext, useEffect, useRef } from "react";
import QContext from "../../store/question-context";
import SelectCourse from "./selectCourse";
import SelectChapters from "./selectChapters";
import SelectOrigin from "./selectOrigin";
import SelectCount from "./selectCount";
import { Button, Row } from "react-bootstrap";

export default function SelectionMain({ setIsSelected }) {
  const qCtx = useContext(QContext);
  const chaptersRef = useRef(null);
  const originRef = useRef(null);
  const countRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (qCtx.selection.courseCode && chaptersRef.current) {
      chaptersRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [qCtx.selection.courseCode]);

  useEffect(() => {
    if (qCtx.selection.chapters.length > 0 && originRef.current) {
      originRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [qCtx.selection.chapters]);

  useEffect(() => {
    if (qCtx.selection.origins.length > 0 && countRef.current) {
      countRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [qCtx.selection.origins]);

  useEffect(() => {
    if (qCtx.selection.quantity > 0 && buttonRef.current) {
      buttonRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [qCtx.selection.quantity]);

  return (<>
    <SelectCourse />
    {qCtx.selection.courseCode && <div ref={chaptersRef}><SelectChapters /></div>}
    {qCtx.selection.chapters.length > 0 && <div ref={originRef}><SelectOrigin /></div>}
    {qCtx.selection.origins.length > 0 && <div ref={countRef}><SelectCount /></div>}
    {qCtx.selection.quantity > 0 && (
      <Row className="justify-content-center" ref={buttonRef}>
        <Button onClick={() => setIsSelected(true)} variant="success" className="w-50">Start Quiz!</Button>
      </Row>
    )}
  </>);
}