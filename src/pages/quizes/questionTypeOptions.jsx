import { questionTypes, tofQuestionStatus } from "../../constants/enums";

export const questionTypeOptions = [
  {
    text: (
      <span className="flex align-center gap-10">
        <i className="fa-solid fa-check" style={{ color: "green" }} />
        <i className="fa-solid fa-xmark" style={{ color: "red" }} />
        true / false
      </span>
    ),
    value: questionTypes.TOF,
    props: { className: questionTypes.TOF },
  },
  {
    text: (
      <span className="flex align-center gap-10">
        <i className="fa-solid fa-list-ol" style={{ color: "blue" }} />
        multiple choice
      </span>
    ),
    value: questionTypes.MC,
    props: { className: questionTypes.MC },
  },
];

export const tofOptions = [
  {
    text: (
      <span className="flex align-center gap-10" style={{ color: "green" }}>
        <i className="fa-solid fa-check" />
        true
      </span>
    ),
    value: tofQuestionStatus.true,
  },
  {
    text: (
      <span className="flex align-center gap-10" style={{ color: "red" }}>
        <i className="fa-solid fa-xmark" />
        false
      </span>
    ),
    value: tofQuestionStatus.false,
  },
];
