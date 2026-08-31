import React, { useContext, useEffect, useState } from "react";
import QContext from "../../store/question-context";
import { Button, Col, Row } from "react-bootstrap";
import { CHAPTER_GROUPS } from "../../lib/constants"; // { CourseCode: { GroupName: { Textbook: [ Chapter1, Chapter2, ... ] }}}
import useBlacklist from "../hooks/useBlacklist";
import EditBlacklistModal from "../shared/editBlacklistModal";
import DeleteBlacklistButton from "../shared/deleteBlacklistButton";

export default function SelectChapters({ isEditBlacklist }) {
  const qCtx = useContext(QContext);
  const { Get, RemoveChapter } = useBlacklist();
  const groupName = CHAPTER_GROUPS[qCtx.selection.courseCode] ? Object.keys(CHAPTER_GROUPS[qCtx.selection.courseCode])[0] : null;
  const [availableChapters, setAvailableChapters] = useState([]); // [{ textbook, chapter, origins }]
  const [editModal, setEditModal] = useState(null);

  useEffect(() => {
    setAvailableChapters(findAvailableChapters(isEditBlacklist ? Get(qCtx.selection.courseCode) : qCtx.questions.filter(q => q.CourseCode === qCtx.selection.courseCode)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditBlacklist, qCtx.questions, qCtx.blacklist, qCtx.selection.courseCode]);

  function selectChapterHandler(chapter) {
    if (isEditBlacklist) {
      qCtx.setSelection(p => ({ ...p, chapters: [ chapter ], mode: null, origins: [], quantity: null }));
    } else {
      if (!qCtx.selection.chapters.find(c => c.textbook === chapter.textbook && c.chapter === chapter.chapter))
        qCtx.setSelection(p => ({ ...p, chapters: [ ...p.chapters, chapter ], mode: null, origins: [], quantity: null }));
      else
        qCtx.setSelection(p => ({ ...p, chapters: p.chapters.filter(c => !(c.textbook === chapter.textbook && c.chapter === chapter.chapter)), mode: null, origins: [], quantity: null }));
    }
  }

  function selectGroupHandler() {
    if (isExactGroupSelection(qCtx.selection.chapters, qCtx.selection.courseCode, groupName)) {
      qCtx.setSelection(p => ({ ...p, chapters: [], mode: null, origins: [], quantity: null }));
      return;
    }

    const groupQuestions = [];
    const textbooks = Object.keys(CHAPTER_GROUPS[qCtx.selection.courseCode][groupName]);

    textbooks.forEach(t => {
      groupQuestions.push(
        ...qCtx.questions.filter(q => q.RelatedTextbook === t && CHAPTER_GROUPS[qCtx.selection.courseCode][groupName][t].includes(q.RelatedChapter))
      );
    });

    qCtx.setSelection(p => ({ ...p, chapters: findAvailableChapters(groupQuestions), mode: null, origins: [], quantity: null }));
  }

  function buttonVariant(chapter, isGroup = false) {
    if (isGroup)
      return isExactGroupSelection(qCtx.selection.chapters, qCtx.selection.courseCode, groupName) ? "info" : "secondary";
    else
      return qCtx.selection.chapters.find(c => c.textbook === chapter.textbook && c.chapter === chapter.chapter) ? "info" : "secondary";
  }

  function isChapterInBlacklist(textbook, chapter) {
    return Get(qCtx.selection.courseCode).some(q => q.RelatedTextbook === textbook && q.RelatedChapter === chapter) > 0;
  }

  return (<>
    <Row className="text-center fw-bold fs-5 px-3 pt-2 justify-content-center">Select Chapters:</Row>
    {(!isEditBlacklist && groupName !== null) && <Row className="my-3">
      <Button onClick={selectGroupHandler} variant={buttonVariant(null, true)} className="d-flex justify-content-between px-3 py-2">
        <div className="text-start fw-bold">{groupName}</div>
      </Button>
    </Row>}
    {uniqueTextbooks(availableChapters).map(textbook => (<React.Fragment key={textbook}>
      <Row className="fst-italic fs-6 px-3 py-2">{textbook}</Row>
      {availableChapters.filter(chapter => chapter.textbook === textbook).map(chapter => (
        <Row key={chapter.chapter} className="mb-2">
          <Col xs={(isEditBlacklist && isChapterInBlacklist(chapter.textbook, chapter.chapter)) ? 10 : 12} className="p-0">
            <Button onClick={() => selectChapterHandler(chapter)} variant={buttonVariant(chapter)} className="d-flex justify-content-between px-3 py-2 w-100">
              <div className="text-start">{chapter.chapter}</div>
              <div className="d-flex gap-3 fst-italic ms-3">
                {chapter.origins.map(origin => (
                  <div key={origin}>{origin}</div>
                ))}
              </div>
            </Button>
          </Col>
          {(isEditBlacklist && isChapterInBlacklist(chapter.textbook, chapter.chapter)) && (
            <Col xs="2" className="p-0 d-flex justify-content-end">
              <DeleteBlacklistButton onClick={() => setEditModal([qCtx.selection.courseCode, chapter.textbook, chapter.chapter])} />
            </Col>
          )}
        </Row>
      ))}
    </React.Fragment>))}
    <EditBlacklistModal
      show={editModal}
      editType="All Questions for"
      criteria={editModal ? `Chapter ${editModal[2]}` : ""}
      onHide={() => setEditModal(null)}
      onConfirm={() => { RemoveChapter(...editModal); setEditModal(null); }}
    />
  </>)
}

function findAvailableChapters(questionBase) {
  let uniqueChapters = [];

  uniqueChapters = questionBase.reduce((acc, curr) => {
    if (!acc.find(item => item.textbook === curr.RelatedTextbook && item.chapter === curr.RelatedChapter))
      acc.push({ textbook: curr.RelatedTextbook, chapter: curr.RelatedChapter, origins: [curr.Origin] });
    return acc;
  }, []);

  questionBase.forEach(q => {
    const currentChapter = uniqueChapters.find(item => item.textbook === q.RelatedTextbook && item.chapter === q.RelatedChapter);
    if (currentChapter && !currentChapter.origins.find(origin => origin === q.Origin))
      currentChapter.origins.push(q.Origin);
  });

  return uniqueChapters.sort((a, b) => parseInt(a.chapter) - parseInt(b.chapter));
}

function uniqueTextbooks(chapters) {
  const textbooks = chapters.reduce((acc, curr) => {
    if (!acc.find(item => item === curr.textbook))
      acc.push(curr.textbook);
    return acc;
  }, []);

  return textbooks.sort((a, b) => a.localeCompare(b));
}

function isExactGroupSelection(selection, courseCode, groupName) {
  const courseGroups = CHAPTER_GROUPS[courseCode];
  if (!courseGroups || !groupName || !courseGroups[groupName]) return false;

  const requiredChapters = Object.entries(courseGroups[groupName]).flatMap(([textbook, chapters]) =>
    chapters.map(chapterName => ({ textbook, chapter: chapterName }))
  );

  if (selection.length !== requiredChapters.length) return false;

  const selectedKeys = new Set(selection.map(chapter => `${chapter.textbook}::${chapter.chapter}`));
  return requiredChapters.every(chapter => selectedKeys.has(`${chapter.textbook}::${chapter.chapter}`));
}