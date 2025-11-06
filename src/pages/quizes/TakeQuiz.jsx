import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../context/Context";
import "./quiz.css";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axios";
import ConfirmPopUp from "../../components/popup/ConfirmPopUp";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endPoints } from "../../constants/endPoints";
import { useFormik } from "formik";
import {
  examTypes,
  questionTypes,
  tofQuestionStatus,
} from "../../constants/enums";
import Button from "../../components/buttons/Button";
import { pagesRoute } from "../../constants/pagesRoute";
import Skeleton from "../../components/skeleton/Skeleton";
const TakeQuiz = () => {
  const { id } = useParams();
  const context = useContext(Context);
  /* TODO add up all the answers in an object that looks like this data:[{
questionId:4ffds03205h30fn23,
answer:true
},
{
questionId:4ffds03205h30fn23,
answer:false
},

] 



*/
  const { userDetails } = useAuth();
  const { profileId } = userDetails;
  const studentId = profileId?._id;
  const [time, setTime] = useState(0);

  const nav = useNavigate();
  const { data: checkIfHasScore } = useQuery({
    queryKey: [endPoints.quizzes, id, studentId],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(endPoints["exam-results"], {
          params: {
            studentId,
            examId: id,
          },
        });
        return data?.data;
      } catch (error) {}
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: [endPoints.quizzes, id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`${endPoints.quizzes}/${id}`);
        const { data: res } = data;
        setTime(
          new Date(new Date(res?.date).getTime() + res?.duration * 60000)
        );

        return data.data;
      } catch {}
    },
    enabled: checkIfHasScore?.length !== 0,
  });

  const name = `${profileId?.firstName} ${profileId?.middleName} ${profileId?.lastName}`;
  const [remainingTime, setRemainingTime] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const language = context?.selectedLang;

  useEffect(() => {
    if (!time) return;

    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const ms = time - currentTime;

      if (ms <= 0) {
        clearInterval(intervalId);
        setRemainingTime("00:00:00");
        formik.handleSubmit();
        return;
      }

      const hours = Math.floor(ms / (1000 * 60 * 60));
      const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((ms % (1000 * 60)) / 1000);

      setRemainingTime(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, [time]);

  const query = useQueryClient();

  const submitQuiz = useMutation({
    mutationFn: async (values) => {
      const { answers } = values;
      const questions = data.questions;
      let correctCount = 0;
      questions.forEach((q) => {
        const studentAns = answers.find((a) => a.questionId === q._id);
        if (!studentAns) return;
        if (q.type === questionTypes.TOF) {
          if (studentAns.studentAnswer === q.correctAnswer) {
            correctCount++;
          }
        } else if (q.type === questionTypes.MC) {
          const correctChoice = q.choices.find((c) => c.isCorrect);
          if (
            correctChoice &&
            studentAns.studentAnswer === correctChoice.text
          ) {
            correctCount++;
          }
        }
      });
      const score = (correctCount / questions.length) * 100;

      try {
        await axiosInstance.post(endPoints["exam-results"], {
          studentId,
          score,
          type: examTypes.Quiz,
          examId: id,
        });
      } catch {}
    },
    onSuccess: () => {
      nav(pagesRoute?.examResult?.page);
      query.invalidateQueries([endPoints.quizzes, endPoints["exam-results"]]);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      answers:
        data?.questions?.map((q) => ({
          questionId: q._id,
          studentAnswer: "",
        })) || [],
    },
    onSubmit: (v) => submitQuiz.mutate(v),
  });

  if (checkIfHasScore?.length > 0)
    return (
      <h1 className="center text-capitalize font-color">
        {language?.take_quiz?.you_allready_took_and_scored}
        {checkIfHasScore?.[0]?.score}
      </h1>
    );

  if (!data?.questions?.length) return <p>Loading questions...</p>;

  if (isLoading)
    return (
      <div className="container">
        <Skeleton height="200px" />
      </div>
    );

  return (
    <>
      <div className="container relative">
        <ConfirmPopUp
          isOpen={isOpen}
          heading={language?.take_quiz?.confirm_sending}
          onConfirm={formik.handleSubmit}
          confirmText={language?.take_quiz?.submit}
          cancelText={language?.take_quiz?.cancel}
          onClose={() => setIsOpen(false)}
        />

        <>
          <div className="center between quiz-title">
            <h1 className="title">{data?.subjectId?.name}</h1>
            <div>
              <h2 className="text-capitalize">{name}</h2>
              <h3 className="text-capitalize">
                {data?.duration}
                {language?.take_quiz?.minutes}
              </h3>
            </div>
          </div>
          <h2 className="time gap-10 center text-capitalize">
            {language?.take_quiz?.remainig_time}
            <span> {remainingTime} </span>
          </h2>

          {data.questions.map((q, i) => (
            <div key={q._id} className="questions-space">
              <h3>{`Q-${i + 1}`}</h3>

              {q.type === questionTypes.TOF && (
                <div className="center wrap justify-start gap-10">
                  <h2 className="flex-1 true-false">{q.text}</h2>
                  <div className="flex gap-10">
                    {Object.values(tofQuestionStatus).map((option) => {
                      const isActive =
                        formik.values.answers[i]?.studentAnswer === option;
                      return (
                        <label key={option}>
                          <input
                            type="radio"
                            name={`answers[${i}].studentAnswer`}
                            value={option}
                            checked={isActive}
                            onChange={formik.handleChange}
                            hidden
                          />
                          {option === tofQuestionStatus.true && (
                            <i
                              className={`fa-solid fa-check true ${
                                isActive ? "active" : ""
                              }`}
                            />
                          )}
                          {option === tofQuestionStatus.false && (
                            <i
                              className={`fa-solid fa-xmark false ${
                                isActive ? "active" : ""
                              }`}
                            />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {q.type === questionTypes.MC && (
                <div className="center wrap justify-start gap-10">
                  <h2 className="flex-1">{q.text}</h2>
                  <article className="w-100 multi">
                    {q.choices?.map((choice, index) => {
                      const isActive =
                        formik.values.answers[i]?.studentAnswer === choice.text;

                      return (
                        <label key={choice._id || index} className="flex-1">
                          <input
                            type="radio"
                            name={`answers[${i}].studentAnswer`}
                            value={choice.text}
                            checked={isActive}
                            onChange={formik.handleChange}
                            hidden
                          />
                          <div className={`flex-1 ${isActive ? "active" : ""}`}>
                            <h4 className="flex-1">{choice.text}</h4>
                          </div>
                        </label>
                      );
                    })}
                  </article>
                </div>
              )}
            </div>
          ))}

          <Button onClick={() => setIsOpen(true)}>
            {language?.take_quiz?.finish_this_quiz}
          </Button>
        </>
      </div>
    </>
  );
};

export default TakeQuiz;

/*
{
1- quizId
2- get student id from their token
3- [{questionId:1,answer:"test"}*4]
}
4- "questions": [
            {
                "text": "dsadsa",
                "type": "true-false",
                "choices": [],
                "correctAnswer": "true",
                "_id": "69088b01a3fe60741d584636"
            },
            {
                "text": "dsadsa",
                "type": "multiple-choice",
                "choices": [
                    {
                        "text": "test",
                        "isCorrect": false,
                        "_id": "6909ff51482373964a4a0bb3"
                    },
                    {
                        "text": "true",
                        "isCorrect": true,
                        "_id": "6909ff51482373964a4a0bb4"
                    },
                    {
                        "text": "false",
                        "isCorrect": false,
                        "_id": "6909ff51482373964a4a0bb5"
                    },
                    {
                        "text": "false",
                        "isCorrect": false,
                        "_id": "6909ff51482373964a4a0bb6"
                    },
                    {
                        "text": "dsadsa",
                        "isCorrect": false,
                        "_id": "6909ff51482373964a4a0bb7"
                    }
                ],
                "correctAnswer": "",
                "_id": "6909ff51482373964a4a0bb2"
            }
        ],
*/
