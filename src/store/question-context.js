import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { STORAGE_KEY } from "../lib/constants";
import { questionKey } from "../lib/helperFunctions";

const QContext = React.createContext({
  isLoading: false,
  selection: { courseCode: "", chapters: [], mode: "",origins: [], quantity: 0 },
  questions: [{ CourseCode: "", CourseName: "", Origin: "", Question: "", OptionA: "", OptionB: "", OptionC: "", OptionD: "", OptionE: "", OptionF: "", Answer: "", RelatedTextbook: "", RelatedChapter: "" }],
  blacklist: [{ CourseCode: "", CourseName: "", Origin: "", Question: "", OptionA: "", OptionB: "", OptionC: "", OptionD: "", OptionE: "", OptionF: "", Answer: "", RelatedTextbook: "", RelatedChapter: "" }],
  setIsLoading: () => {},
  setSelection: () => {},
  setAllQuestions: () => {},
  setQuestions: () => {},
  setBlacklist: () => {}
});

export function QContextProvider(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState({ courseCode: null, chapters: [], mode: null,origins: [], quantity: null });
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [blacklist, setBlacklist] = useState(readBlacklist);

  useEffect(() => {
    Papa.parse(process.env.PUBLIC_URL + "/active-file.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setAllQuestions(results.data);
        setQuestions(results.data.filter(q => !blacklist.some(
          blacklistedQuestion => questionKey(blacklistedQuestion) === questionKey(q)
        )));
        setIsLoading(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue = { isLoading, setIsLoading, selection, setSelection, allQuestions, setAllQuestions, questions, setQuestions, blacklist, setBlacklist };

  return (
    <QContext.Provider value={contextValue}>
      {props.children}
    </QContext.Provider>
  );
};

export default QContext;

// Helper function to read the blacklist from localStorage
function readBlacklist() {
	try {
		const savedBlacklist = window.localStorage.getItem(STORAGE_KEY);
		return savedBlacklist ? JSON.parse(savedBlacklist) : [];
	} catch {
		return [];
	}
}