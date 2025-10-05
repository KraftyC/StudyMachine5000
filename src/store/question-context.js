import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const QContext = React.createContext({
  isLoading: false,
  selection: { courseCode: "", chapters: [], origins: [], quantity: 0 },
  questions: [{ CourseCode: "", CourseName: "", Origin: "", Question: "", OptionA: "", OptionB: "", OptionC: "", OptionD: "", Answer: "", RelatedTextbook: "", RelatedChapter: "" }],
  setIsLoading: () => {},
  setSelection: () => {},
  setQuestions: () => {}
});

export function QContextProvider(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [selection, setSelection] = useState({ courseCode: null, chapters: [], origins: [], quantity: null });
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    Papa.parse(process.env.PUBLIC_URL + "/active-file.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setQuestions(results.data);
        setIsLoading(false);
      }
    });
  }, []);

  const contextValue = { isLoading, setIsLoading, selection, setSelection, questions, setQuestions };

  return (
    <QContext.Provider value={contextValue}>
      {props.children}
    </QContext.Provider>
  );
};

export default QContext;