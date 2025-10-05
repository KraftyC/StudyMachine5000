import React, { useContext, useEffect, useState } from "react";
import QContext from "../../store/question-context";
import { Button, Row } from "react-bootstrap";


export default function SelectChapters() {
  const qCtx = useContext(QContext);
  const [availableChapters, setAvailableChapters] = useState([]); // [{ textbook, chapter, origins }]

  useEffect(() => {
    setAvailableChapters(
      findAvailableChapters(
        qCtx.questions.filter(q => q.CourseCode === qCtx.selection.courseCode)
      )
    );
  }, [qCtx.questions, qCtx.selection.courseCode])

  function selectChapterHandler(chapter) {
    if (!qCtx.selection.chapters.find(c => c.textbook === chapter.textbook && c.chapter === chapter.chapter))
      qCtx.setSelection(p => ({ ...p, chapters: [ ...p.chapters, chapter ], origins: [], quantity: null }));
    else
      qCtx.setSelection(p => ({ ...p, chapters: p.chapters.filter(c => !(c.textbook === chapter.textbook && c.chapter === chapter.chapter)), origins: [], quantity: null }));
  }

  function buttonVariant(chapter) {
    return qCtx.selection.chapters.find(c => c.textbook === chapter.textbook && c.chapter === chapter.chapter) ? "info" : "secondary";
  }

  return (<>
    <Row className="text-center fw-bold fs-5 px-3 pt-2 justify-content-center">Select Chapters:</Row>
    {uniqueTextbooks(availableChapters).map(textbook => (<React.Fragment key={textbook}>
      <Row className="fst-italic fs-6 px-3 py-2">{textbook}</Row>
      {availableChapters.filter(chapter => chapter.textbook === textbook).map(chapter => (
        <Row key={chapter.chapter} className="mb-2">
          <Button onClick={() => selectChapterHandler(chapter)} variant={buttonVariant(chapter)} className="d-flex justify-content-between px-3 py-2">
            <div>{chapter.chapter}</div>
            <div className="d-flex gap-3 fst-italic">
              {chapter.origins.map(origin => (
                <div key={origin}>{origin}</div>
              ))}
            </div>
          </Button>
        </Row>
      ))}
    </React.Fragment>))}
  </>)
}

function findAvailableChapters(questions) {
  const uniqueChapters = questions.reduce((acc, curr) => {
    if (!acc.find(item => item.textbook === curr.RelatedTextbook && item.chapter === curr.RelatedChapter))
      acc.push({ textbook: curr.RelatedTextbook, chapter: curr.RelatedChapter, origins: [curr.Origin] });
    return acc;
  }, []);

  questions.forEach(q => {
    const currentChapter = uniqueChapters.find(item => item.textbook === q.RelatedTextbook && item.chapter === q.RelatedChapter);
    if (currentChapter && !currentChapter.origins.find(origin => origin === q.Origin))
      currentChapter.origins.push(q.Origin);
  });

  return uniqueChapters.sort((a, b) => {
    if (a.textbook < b.textbook) return -1;
    if (a.textbook > b.textbook) return 1;
    if (a.chapter < b.chapter) return -1;
    if (a.chapter > b.chapter) return 1;
    return 0;
  });
}

function uniqueTextbooks(chapters) {
  const textbooks = chapters.reduce((acc, curr) => {
    if (!acc.find(item => item === curr.textbook))
      acc.push(curr.textbook);
    return acc;
  }, []);

  return textbooks;
}