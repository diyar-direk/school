import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
const AllQuizes = lazy(() => import("./AllQuizes"));
const AddQuiz = lazy(() => import("./AddQuiz"));
export const quizeRouter = [
  {
    path: pagesRoute.quize.page,
    element: <AllQuizes />,
  },
  {
    path: pagesRoute.quize.add,
    element: <AddQuiz />,
  },
];
