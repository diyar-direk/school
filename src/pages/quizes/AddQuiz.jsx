import { useContext } from "react";
import "../../components/form.css";
import { Context } from "../../context/Context";
import { FieldArray, Formik } from "formik";
import SelectOptionInput from "../../components/inputs/SelectOptionInput";
import { quizeSchema } from "../../schemas/quizeSchema";
import Input from "../../components/inputs/Input";
import dateFormatter from "../../utils/dateFormatter";
import Button from "../../components/buttons/Button";
const AddQuiz = () => {
  const context = useContext(Context);

  const language = context && context.selectedLang;

  return (
    <>
      <div className="container relative">
        <h1 className="title">{language?.quizzes?.add_a_quiz}</h1>

        <Formik
          initialValues={{
            title: "",
            courseId: "",
            classId: "",
            description: "",
            date: dateFormatter(new Date()),
            endDate: "",
            questions: [],
          }}
          validationSchema={quizeSchema}
          onSubmit={(values) => {
            console.log(values);
          }}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit} className="dashboard-form">
              <h1>{language?.exams?.please_complete_form}</h1>

              <div className="flex wrap">
                {/* === Quiz Info === */}
                <Input
                  errorText={formik.errors?.title}
                  title={language?.quizzes?.exam_title}
                  placeholder={language?.quizzes?.exam_title_placeholder}
                  name="title"
                  onChange={formik.handleChange}
                  value={formik?.values?.title}
                />

                <Input
                  errorText={formik.errors?.date}
                  title={language?.quizzes?.quiz_date}
                  name="date"
                  onChange={formik.handleChange}
                  value={formik?.values?.date}
                  type="datetime-local"
                />

                <Input
                  errorText={formik.errors?.endDate}
                  title={language?.quizzes?.endDate}
                  name="endDate"
                  onChange={formik.handleChange}
                  value={formik?.values?.endDate}
                  type="datetime-local"
                />

                <Input
                  errorText={formik.errors?.description}
                  title={language?.quizzes?.exam_discreption}
                  placeholder={language?.quizzes?.exam_discreption_placeholder}
                  name="description"
                  onChange={formik.handleChange}
                  value={formik?.values?.description}
                  elementType="textarea"
                  rows={5}
                />

                {/* === Questions Section === */}
                <FieldArray name="questions">
                  {({ push, remove }) => (
                    <div className="questions-section">
                      <h2 className="my-2">Questions</h2>

                      {/* عرض الخطأ العام للأسئلة */}
                      {formik.errors.questions &&
                        typeof formik.errors.questions === "string" && (
                          <p className="text-red-500">
                            {formik.errors.questions}
                          </p>
                        )}

                      {formik.values.questions.map((q, index) => {
                        const questionError =
                          formik.errors.questions?.[index] || {}; // خطأ السؤال الحالي إن وجد
                        return (
                          <div key={index} className="border p-3 my-2 rounded">
                            {/* نص السؤال */}
                            <Input
                              errorText={questionError?.text}
                              title={`Question ${index + 1}`}
                              placeholder="Enter question text"
                              name={`questions[${index}].text`}
                              onChange={formik.handleChange}
                              value={q.text}
                            />

                            {/* نوع السؤال */}
                            <SelectOptionInput
                              placeholder={q.type || "Select type"}
                              options={[
                                { text: "True / False", value: "true-false" },
                                {
                                  text: "Multiple Choice",
                                  value: "multiple-choice",
                                },
                              ]}
                              onSelectOption={(e) =>
                                formik.setFieldValue(
                                  `questions[${index}].type`,
                                  e.value
                                )
                              }
                            />

                            {/* correctAnswer لحالة true/false */}
                            {q.type === "true-false" && (
                              <SelectOptionInput
                                placeholder="Select correct answer"
                                options={[
                                  { text: "True", value: "true" },
                                  { text: "False", value: "false" },
                                ]}
                                onSelectOption={(e) =>
                                  formik.setFieldValue(
                                    `questions[${index}].correctAnswer`,
                                    e.value
                                  )
                                }
                              />
                            )}

                            {/* multiple choice */}
                            {q.type === "multiple-choice" && (
                              <FieldArray name={`questions[${index}].choices`}>
                                {({
                                  push: pushChoice,
                                  remove: removeChoice,
                                }) => (
                                  <div>
                                    <h4 className="mt-2">Options</h4>

                                    {Array.isArray(q.choices) &&
                                      q.choices.map((opt, i) => {
                                        const choiceError =
                                          questionError?.choices?.[i] || {};
                                        return (
                                          <div
                                            key={i}
                                            className="flex gap-2 items-center"
                                          >
                                            <Input
                                              name={`questions[${index}].choices[${i}].text`}
                                              placeholder={`Option ${i + 1}`}
                                              value={opt.text}
                                              onChange={formik.handleChange}
                                              errorText={choiceError?.text}
                                            />
                                            <label>
                                              <input
                                                type="checkbox"
                                                checked={opt.isCorrect}
                                                onChange={(e) =>
                                                  formik.setFieldValue(
                                                    `questions[${index}].choices[${i}].isCorrect`,
                                                    e.target.checked
                                                  )
                                                }
                                              />
                                              Correct
                                            </label>
                                            <button
                                              type="button"
                                              onClick={() => removeChoice(i)}
                                            >
                                              ❌
                                            </button>
                                          </div>
                                        );
                                      })}

                                    <button
                                      type="button"
                                      onClick={() =>
                                        pushChoice({
                                          text: "",
                                          isCorrect: false,
                                        })
                                      }
                                    >
                                      ➕ Add Option
                                    </button>

                                    {/* عرض خطأ المصفوفة */}
                                    {typeof questionError?.choices ===
                                      "string" && (
                                      <p className="text-red-500">
                                        {questionError?.choices}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </FieldArray>
                            )}

                            <button
                              type="button"
                              className="mt-2 text-red-600"
                              onClick={() => remove(index)}
                            >
                              🗑 Remove Question
                            </button>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        className="mt-3 bg-blue-600 text-white p-2 rounded"
                        onClick={() =>
                          push({
                            text: "",
                            type: "true-false",
                            choices: [],
                            correctAnswer: "",
                          })
                        }
                      >
                        ➕ Add Question
                      </button>
                    </div>
                  )}
                </FieldArray>
              </div>
              <Button type="submit">submit</Button>
            </form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddQuiz;

export function nextJoin(array, obj) {
  let text = "";
  for (let i = 0; i < array.length; i++) {
    if (array[i + 1]) text += array[i][obj] + " , ";
    else text += array[i][obj];
  }

  return text;
}
