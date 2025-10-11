import { useContext, useState } from "react";
import SelectionMain from "./components/selectionScreen/selectionMain";
import QContext from "./store/question-context";
import QuizMain from "./components/quizScreen/quizMain";
import { Container } from "react-bootstrap";
import Header from "./components/header";

export default function App() {
  const qCtx = useContext(QContext);
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div className="text-white">
      <Header />
      <Container style={{ maxWidth: "768px" }}>
        <div className="px-3">
          {(Object.values(qCtx.selection).includes(null) || !isSelected) && <SelectionMain setIsSelected={setIsSelected} />}
          {(!Object.values(qCtx.selection).includes(null) && isSelected) && <QuizMain />}
        </div>
      </Container>
    </div>
  );
}