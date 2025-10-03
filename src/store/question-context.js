import React, { useEffect, useState } from "react";
import Papa from "papaparse";

const QContext = React.createContext({
  isLoading: false,
  courseCode: "",
  origin: "",
  quantity: 0,
  questions: [], // [{ CourseCode, CourseName, Origin (P/AI), Question, OptionA, OptionB, OptionC, OptionD, Answer, RelatedTextbook, RelatedChapter }]
  availableCourses: [], // [{ code, name, origins }]
  setIsLoading: () => {},
  setCourseCode: () => {},
  setOrigin: () => {},
  setQuantity: () => {}
});

export function QContextProvider(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [origin, setOrigin] = useState("P");
  const [quantity, setQuantity] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);

  useEffect(() => {
    Papa.parse("active-file.csv", {
      download: true,
      header: true,
      complete: (results) => {
        setQuestions(results.data);
        setAvailableCourses(results.data.reduce((acc, curr) => {
          if (!acc.find(item => item.code === curr.CourseCode))
            acc.push({ code: curr.CourseCode, name: curr.CourseName, origins: [curr.Origin] });
          else if (!acc.find(item => item.code === curr.CourseCode).origins.find(item => item === curr.Origin))
            acc.find(item => item.code === curr.CourseCode).origins.push(curr.Origin);
          return acc;
        }, []));
        setIsLoading(false);
      }
    });
  }, []);

  const contextValue = { isLoading, setIsLoading, courseCode, setCourseCode, origin, setOrigin, quantity, setQuantity, questions, availableCourses };

  return (
    <QContext.Provider value={contextValue}>
      {props.children}
    </QContext.Provider>
  );
};

export default QContext;