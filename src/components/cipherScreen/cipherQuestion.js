import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
// import CipherQuestionModal from "./cipherQuestionModal";

const styles = {
  inputBox: {
    padding: "0",
    margin: "0 2px",
    fontSize: "0.85em",
    backgroundColor: "transparent",
    border: "none",
    textAlign: "center",
    width: "1em",
    borderBottom: "2px solid white"
  }
}

export default function CipherQuestion({ question, onNext }) {
  const inputRefs = useRef([]);
  const [letters, setLetters] = useState([]);
  const [hints, setHints] = useState({ max: 0, used: 0 });
  const [isCorrect, setIsCorrect] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  const allFilled = letters.length > 0 && letters.every(l => l.letter === " " || l.revealed || l.user.trim() !== "");



  useEffect(() => {
    const clean = question.Answer.replace(/ /g, "");

    setLetters(question.Answer.toUpperCase().split("").map(char => {
      if (char === " ") return { letter: " ", revealed: true };
      else return { letter: char, revealed: false, user: "" };
    }));

    let totalHints = 1;
    for (let i = 6; i <= clean.length; i += 5)
      totalHints++;
    setHints({ max: totalHints, used: 0 });
    
    setIsCorrect(null);
    setIsFinished(false);
  }, [question]);

  useEffect(() => {
    if (letters.length === 0) return;

    // Only auto-focus when all user entries are empty (fresh question)
    const isFresh = letters.every(l => l.revealed || l.user === "");

    if (!isFresh) return;

    const firstIndex = letters.findIndex(l => !l.revealed);

    if (firstIndex !== -1 && inputRefs.current[firstIndex]) {
      inputRefs.current[firstIndex].focus();
    }
  }, [letters]);

  useEffect(() => {
    function handleEnter(e) {
      if (e.key !== "Enter") return;

      // If puzzle is finished → Enter = Next
      if (isFinished) {
        onNext(isCorrect);
        return;
      }

      // If puzzle is NOT finished → Enter = Submit (only if all filled)
      if (allFilled) checkAnswer();
    }

    window.addEventListener("keydown", handleEnter);
    return () => window.removeEventListener("keydown", handleEnter);
    // eslint-disable-next-line
  }, [allFilled, isFinished, isCorrect]);

  function handleInput(i, value) {
    const char = value.toUpperCase();

    setLetters(prev => {
      const updated = prev.map((l, idx) => idx === i ? { ...l, user: char } : l);

      if (char) {
        let nextIndex = i + 1;
        while (nextIndex < updated.length && updated[nextIndex].revealed)
          nextIndex++;
        if (inputRefs.current[nextIndex]) inputRefs.current[nextIndex].focus();
      }

      return updated;
    });
  }

  function handleKeyDown(i, e) {
    if (e.key !== "Backspace") return;

    setLetters(p => {
      const updated = [ ...p ];

      if (updated[i].user) {
        updated[i] = { ...updated[i], user: "" };
        return updated;
      }

      let prevIndex = i - 1;
      while (prevIndex >= 0 && updated[prevIndex].revealed)
        prevIndex--;
      if (prevIndex >= 0 && !updated[prevIndex].revealed && inputRefs.current[prevIndex]) {
        inputRefs.current[prevIndex].focus();
        updated[prevIndex] = { ...updated[prevIndex], user: "" };
      }

      return updated;
    });
  }

  function showHintHandler() {
    setLetters(p => revealHint(p));
    setHints(p => ({ ...p, used: p.used + 1 }));
  }

  // function giveUpHandler() {
  //   setLetters(p => p.map(l => ({ ...l, revealed: true })));
  //   setIsCorrect(false);
  //   setIsFinished(true);
  //   setShowModal(false);
  // }

  function checkAnswer() {
    const correct = letters.every(l => l.letter === " " || l.revealed || l.user.toUpperCase() === l.letter);
    setIsCorrect(correct);
    setIsFinished(true);
    setLetters(p => p.map(l => ({ ...l, revealed: true })));
  }

  return (<>
    <Row className="justify-content-center p-3 text-center">{question.Question}</Row>
    <Row className="d-block text-center p-3">
      {letters.map((l, i) => (<React.Fragment key={i}>
        {l.letter === " " && <br />}
        {l.letter !== " " && (<input 
          ref={el => inputRefs.current[i] = el}
          style={{ ...styles.inputBox, color: l.revealed ? "#aaa" : "white"}}
          className="mb-3"
          disabled={l.revealed || isFinished}
          maxLength={1}
          value={l.revealed ? l.letter : l.user}
          onChange={e => handleInput(i, e.target.value)}
          onKeyDown={e => handleKeyDown (i, e)}
        />)}
      </React.Fragment>))}
    </Row>
    <Row className="d-flex justify-content-center p-3" style={{ minHeight: "56px"}}>
      {isCorrect && "✅ Correct"}
      {isCorrect === false && "❌ Incorrect"}
    </Row>
    {!isFinished && <Row className="d-flex justify-content-center p-3">
      <Col><Button onClick={showHintHandler} disabled={hints.used >= hints.max} variant="primary" className="w-100">Hints {hints.used}/{hints.max}</Button></Col>
      <Col>{allFilled && <Button onClick={checkAnswer} variant="success" className="w-100">Submit</Button>}</Col>
    </Row>}
    {isFinished && <div className="d-flex justify-content-end">
      <Button onClick={() => onNext(isCorrect)} variant="primary" className="fw-bold text-center p-3 mt-4 w-50">
        Next
      </Button>
    </div>}
  </>);
}

function revealHint(letters) {
  const unrevealed = letters.map((l, i) => ({ ...l, index: i })).filter(l => !l.revealed && l.letter !== " ");
  
  if (unrevealed.length === 0) return letters;
  
  const revealvedIndices = letters.map((l, i) => l.revealed && l.letter !== " " ? i : null)
    .filter(i => i !== null);

  let chosen;

  if (revealvedIndices.length === 0) chosen = unrevealed[Math.floor(Math.random() * unrevealed.length)];
  else {
    const scored = unrevealed.map(l => {
      const distances = revealvedIndices.map(ri => Math.abs(ri - l.index));
      const minDistance = Math.min(...distances);
      return { ...l, score: minDistance };
    });

    scored.sort((a, b) => b.score - a.score);
    chosen = scored[0];
  }

  const updated = letters.map((l, i) => i === chosen.index ? { ...l, revealed: true, user: "" } : l);
  return updated;
}