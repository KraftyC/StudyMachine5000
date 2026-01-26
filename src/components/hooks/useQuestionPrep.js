import { useContext, useState, useEffect } from "react";
import QContext from "../../store/question-context";
import { shuffleArray } from "../../lib/helperFunctions";

export default function useQuestionPrep() {
  const qCtx = useContext(QContext);
  const [preparedQuestions, setPreparedQuestions] = useState([]);

  useEffect(() => {
      const qType = qCtx.selection.mode === "Multiple Choice" ? "MCQ" : "Single";
  
      // Step 1: Filter by courseCode
      let filtered = qCtx.questions.filter(q => q.CourseCode === qCtx.selection.courseCode && (qType === "Single" ? q.OptionA === "" : q.OptionA !== ""));

      // Step 2: Filter by question type needed
      filtered = filtered.filter(q => q.CourseCode === qCtx.selection.courseCode && (qType === "Single" ? q.OptionA === "" : q.OptionA !== ""));
  
      // Step 3: Filter by chapters (textbook & chapter)
      filtered = filtered.filter(q => qCtx.selection.chapters.some(ch => ch.textbook === q.RelatedTextbook && ch.chapter === q.RelatedChapter));
  
      // Step 4: Filter by origin
      filtered = filtered.filter(q => qCtx.selection.origins.includes(q.Origin));
  
      // Step 5: Group by textbook & chapter
      const chapterGroups = qCtx.selection.chapters.map(ch => ({ textbook: ch.textbook, chapter: ch.chapter }));
      const grouped = chapterGroups.map(({ textbook, chapter }) => filtered.filter(q => q.RelatedTextbook === textbook && q.RelatedChapter === chapter));
  
      // Step 6: Distribute questions equally
      const totalQuestions = qCtx.selection.quantity;
      const perGroup = Math.floor(totalQuestions / grouped.length);
      let remainder = totalQuestions % grouped.length;
  
      let selectedQuestions = [];
      grouped.forEach(group => {
        const shuffled = shuffleArray([...group]);
        let take = perGroup;
        if (remainder > 0) {
          take += 1;
          remainder -= 1;
        }
        selectedQuestions = selectedQuestions.concat(shuffled.slice(0, take));
      });
  
      // Fill up to totalQuestions if needed, avoiding duplicates
      if (selectedQuestions.length < totalQuestions) {
        // Create a unique key for each question
        const makeKey = q => `${q.CourseCode}|${q.RelatedTextbook}|${q.RelatedChapter}|${q.Question}`;
        const selectedKeys = new Set(selectedQuestions.map(makeKey));
        const remaining = shuffleArray(filtered.filter(q => !selectedKeys.has(makeKey(q))));
        selectedQuestions = selectedQuestions.concat(remaining.slice(0, totalQuestions - selectedQuestions.length));
      }
  
      // If still not enough, just use all available
      selectedQuestions = selectedQuestions.slice(0, Math.min(totalQuestions, filtered.length));
  
      // Shuffle final selection
      selectedQuestions = shuffleArray(selectedQuestions);
  
      setPreparedQuestions(selectedQuestions);
      // eslint-disable-next-line
    }, [qCtx.selection]);

  return preparedQuestions;
}