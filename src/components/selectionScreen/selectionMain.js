import { useContext } from "react";
import QContext from "../../store/question-context";
import SelectMode from "./selectMode";
import SelectCourse from "./selectCourse";
import SelectChapters from "./selectChapters";
import SelectOrigin from "./selectOrigin";
import SelectCount from "./selectCount";
import { Button, Row } from "react-bootstrap";

export default function SelectionMain({ setIsSelected }) {
  const qCtx = useContext(QContext);

  return (<>
    <SelectCourse />
    {qCtx.selection.courseCode && <SelectChapters />}
    {qCtx.selection.chapters.length > 0 && <SelectMode />}
    {qCtx.selection.mode && <SelectOrigin />}
    {qCtx.selection.origins.length > 0 && <SelectCount />}
    {qCtx.selection.quantity > 0 && (
      <Row className="justify-content-center">
        <Button onClick={() => setIsSelected(true)} variant="success" className="w-50">Start!</Button>
      </Row>
    )}
    <div style={{ height: "50px" }}></div>
  </>);
}