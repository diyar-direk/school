import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";
const AllQuizes = lazy(() => import("./AllQuizes"));
const AddQuiz = lazy(() => import("./AddQuiz"));
const UpdateQuiz = lazy(() => import("./UpdateQuiz"));
const TakeQuiz = lazy(() => import("./TakeQuiz"));
export const quizeRouter = [
  {
    path: pagesRoute.quize.page,
    element: <AllQuizes />,
  },
  {
    path: pagesRoute.quize.add,
    element: (
      <AllowedTo roles={[roles.admin, roles.teacher]}>
        <AddQuiz />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.quize.update(),
    element: (
      <AllowedTo roles={[roles.admin, roles.teacher]}>
        <UpdateQuiz />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.quize.take(),
    element: (
      <AllowedTo roles={[roles.student]}>
        <TakeQuiz />
      </AllowedTo>
    ),
  },
];
