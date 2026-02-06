import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data";
import Dashboard from "./pages/dashboard";
import { BookOpen, Building2, ClipboardCheck, GraduationCap, Home, Users } from "lucide-react";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectsList from "./pages/subjects/list";
import SubjectsCreate from "./pages/subjects/create";
import { Register } from "./pages/register";
import { Login } from "./pages/login";
import ClassesCreate from "./pages/classes/create";
import ClassesList from "./pages/classes/list";
import { authProvider } from "./providers/auth";
import ClassesShow from "./pages/classes/show";
import SubjectsShow from "./pages/subjects/show";
import FacultyList from "./pages/faculty/list";
import FacultyShow from "./pages/faculty/show";
import DepartmentsList from "./pages/departments/list";
import DepartmentsCreate from "./pages/departments/create";
import DepartmentsShow from "./pages/departments/show";
import CreateEnrollmentPage from "./pages/enrollments/create";
import EnrollmentsConfirmPage from "./pages/enrollments/confirm";
import EnrollmentJoinPage from "./pages/enrollments/join";

function App() {

  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              authProvider={authProvider}
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "bTnDaC-MZQmd5-NVQ97z",
              }}
              resources={
                [
                  {
                    "name": "dashboard",
                    "list": "/",
                    "meta": { label: "Home", icon: <Home /> }
                  },
                  {
                    "name": "subjects",
                    "list": "/subjects",
                    "create": "/subjects/create",
                    "show": "/subjects/show/:id",
                    "meta": { label: "Subjects", icon: <BookOpen /> }
                  },
                  {
                    'name': 'departments',
                    'list': '/departments',
                    'create': '/departments/create',
                    'show': '/departments/show/:id',
                    'meta': { label: 'Departments', icon: <Building2 /> }
                  },
                  {
                    "name": "users",
                    "list": "/faculty",
                    "show": "/faculty/show/:id",
                    "meta": { label: "Faculty", icon: <Users /> }
                  },
                  {
                    "name": "enrollments",
                    "list": "/enrollments/create",
                    "create": "/enrollments/create",
                    "meta": { label: "Enrollments", icon: <ClipboardCheck /> }
                  },
                  {
                    "name": "classes",
                    "list": "/classes",
                    "create": "/classes/create",
                    "show": "/classes/show/:id",
                    "meta": { label: "Classes", icon: <GraduationCap /> }
                  }
                ]
              }
            >
              <Routes>
                <Route
                  element={
                    <Authenticated key="public-routes" fallback={<Outlet />}>
                      <NavigateToResource fallbackTo="/" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                <Route
                  element={
                    <Authenticated key="private-routes" fallback={<Login />}>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path="/" element={<Dashboard />} />

                  <Route path="subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                    <Route path="show/:id" element={<SubjectsShow />} />
                  </Route>

                  <Route path="departments">
                    <Route index element={<DepartmentsList />} />
                    <Route path="create" element={<DepartmentsCreate />} />
                    <Route path="show/:id" element={<DepartmentsShow />} />
                  </Route>

                  <Route path="faculty">
                    <Route index element={<FacultyList />} />
                    <Route path="show/:id" element={<FacultyShow />} />
                  </Route>

                  <Route path="enrollments">
                    <Route path="create" element={<CreateEnrollmentPage />} />
                    <Route path="join" element={<EnrollmentJoinPage />} />
                    <Route path="confirm" element={<EnrollmentsConfirmPage />} />
                  </Route>

                  <Route path="classes">
                    <Route index element={<ClassesList />} />
                    <Route path="create" element={<ClassesCreate />} />
                    <Route path="show/:id" element={<ClassesShow />} />
                  </Route>
                </Route>
              </Routes>

              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler
                handler={({ resource }) => {
                  let title = "Classroom";
                  if (resource?.meta?.label) {
                    title = `${resource.meta.label} | Classroom`;
                  }
                  return title;
                }}
              />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
