import { lazy } from "react";
import { pagesRoute } from "../../constants/pagesRoute";
import AllowedTo from "../../components/AllowedTo";
import { roles } from "../../constants/enums";
const Courses = lazy(() => import("./Courses"));
const AddCourse = lazy(() => import("./AddCourse"));
const UpdateCourse = lazy(() => import("./UpdateCourse"));
export const coursesRouter = [
  {
    path: pagesRoute.courses.page,
    element: <Courses />,
  },
  {
    path: pagesRoute.courses.add,
    element: (
      <AllowedTo roles={[roles.admin]}>
        <AddCourse />
      </AllowedTo>
    ),
  },
  {
    path: pagesRoute.courses.update(),
    element: (
      <AllowedTo roles={[roles.admin]}>
        <UpdateCourse />
      </AllowedTo>
    ),
  },
];
