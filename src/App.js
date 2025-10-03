import { useContext } from "react";
import SelectionMain from "./components/selectionScreen/selectionMain";
import QContext from "./store/question-context";
import QuizMain from "./components/quizScreen/quizMain";
import { Container } from "react-bootstrap";

export default function App() {
  const qCtx = useContext(QContext);

  return (
    <div className="d-flex align-items-center vh-100 text-white">
      <Container style={{ maxWidth: "768px" }}>
        <div className="p-3">
          {qCtx.courseCode === "" && <SelectionMain />}
          {qCtx.courseCode !== "" && <QuizMain />}
        </div>
      </Container>
    </div>
  );
}

