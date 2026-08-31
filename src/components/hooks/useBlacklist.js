import { useContext } from "react";
import QContext from "../../store/question-context";
import { STORAGE_KEY } from "../../lib/constants";
import { questionKey } from "../../lib/helperFunctions";

export default function useBlacklist() {
  const qCtx = useContext(QContext);

	function updateBlacklist(nextBlacklist) {
		qCtx.setBlacklist(nextBlacklist);
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextBlacklist));
		if (nextBlacklist.length === 0) {
			window.localStorage.removeItem(STORAGE_KEY);
			window.location.reload();
		}
	};

  const IsBlacklisted = (questionObj) => {
    return qCtx.blacklist.some(question => questionKey(question) === questionKey(questionObj));
  }

  const Get = (courseCode) => {
    return qCtx.blacklist.filter(question => question.CourseCode === courseCode);
  }

	const Add = (questionObj) => {
		const questionAlreadyBlacklisted = qCtx.blacklist.some(question => questionKey(question) === questionKey(questionObj));
		if (!questionAlreadyBlacklisted) updateBlacklist([...qCtx.blacklist, questionObj]);
	};

	const RemoveOne = (questionObj) => {
		updateBlacklist(qCtx.blacklist.filter(question => questionKey(question) !== questionKey(questionObj)));
	};

	const RemoveChapter = (courseCode, textbook, chapter) => {
		updateBlacklist(qCtx.blacklist.filter(question => question.CourseCode !== courseCode || question.RelatedTextbook !== textbook || question.RelatedChapter !== chapter));
	};

	const RemoveCourse = (courseCode) => {
		updateBlacklist(qCtx.blacklist.filter(question => question.CourseCode !== courseCode));
	};

	const RemoveAll = () => {
		updateBlacklist([]);
	};

	return { IsBlacklisted, Get, Add, RemoveOne, RemoveChapter, RemoveCourse, RemoveAll };
}