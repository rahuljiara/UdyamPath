import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Dashboard from '../pages/Dashboard';
import Students from '../pages/students/Students';
import StudentDetails from '../pages/students/StudentDetails';
import StudentCreate from '../pages/students/StudentCreate';
import StudentEdit from '../pages/students/StudentEdit';
import Companies from '../pages/companies/Companies';
import CompanyDetails from '../pages/companies/CompanyDetails';
import CompanyCreate from '../pages/companies/CompanyCreate';
import CompanyEdit from '../pages/companies/CompanyEdit';
import PlacementDrives from '../pages/drives/PlacementDrives';
import PlacementDriveDetails from '../pages/drives/PlacementDriveDetails';
import PlacementDriveCreate from '../pages/drives/PlacementDriveCreate';
import PlacementDriveEdit from '../pages/drives/PlacementDriveEdit';
import Applications from '../pages/applications/Applications';
import ApplicationDetails from '../pages/applications/ApplicationDetails';
import Interviews from '../pages/interviews/Interviews';
import Offers from '../pages/offers/Offers';
import Analytics from '../pages/analytics/Analytics';
import Reports from '../pages/reports/Reports';
import CalendarPage from '../pages/calendar/CalendarPage';
import Settings from '../pages/settings/Settings';
import AuditLogs from '../pages/audit/AuditLogs';
import Notifications from '../pages/notifications/Notifications';
import Profile from '../pages/profile/Profile';
import Login from '../pages/auth/Login';
import NotFound from '../pages/NotFound';
import RoleRoute from './RoleRoute';
import { USER_ROLES } from '../context/AuthContext';
import { ROUTES } from './paths';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Standalone Authentication Route */}
      <Route path={ROUTES.LOGIN} element={<Login />} />

      <Route element={<AppLayout />}>
        {/* Default route redirect to dashboard */}
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

        {/* Students Module */}
        <Route path={ROUTES.STUDENTS.ROOT} element={<Students />} />
        <Route
          path={ROUTES.STUDENTS.CREATE}
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
              <StudentCreate />
            </RoleRoute>
          }
        />
        <Route path="/students/:id" element={<StudentDetails />} />
        <Route
          path="/students/:id/edit"
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
              <StudentEdit />
            </RoleRoute>
          }
        />

        {/* Companies Module */}
        <Route
          path={ROUTES.COMPANIES.ROOT}
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
              <Companies />
            </RoleRoute>
          }
        />
        <Route
          path={ROUTES.COMPANIES.CREATE}
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <CompanyCreate />
            </RoleRoute>
          }
        />
        <Route path="/companies/:id" element={<CompanyDetails />} />
        <Route
          path="/companies/:id/edit"
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <CompanyEdit />
            </RoleRoute>
          }
        />

        {/* Placement Drives Module */}
        <Route path={ROUTES.DRIVES.ROOT} element={<PlacementDrives />} />
        <Route
          path={ROUTES.DRIVES.CREATE}
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
              <PlacementDriveCreate />
            </RoleRoute>
          }
        />
        <Route path="/placement-drives/:id" element={<PlacementDriveDetails />} />
        <Route
          path="/placement-drives/:id/edit"
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
              <PlacementDriveEdit />
            </RoleRoute>
          }
        />

        {/* Applications Module */}
        <Route path={ROUTES.APPLICATIONS.ROOT} element={<Applications />} />
        <Route path="/applications/:id" element={<ApplicationDetails />} />

        {/* Interviews Module */}
        <Route path={ROUTES.INTERVIEWS.ROOT} element={<Interviews />} />

        {/* Offers Module */}
        <Route path={ROUTES.OFFERS.ROOT} element={<Offers />} />

        {/* Analytics Module */}
        <Route
          path={ROUTES.ANALYTICS}
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
              <Analytics />
            </RoleRoute>
          }
        />

        {/* Reports Module */}
        <Route
          path={ROUTES.REPORTS}
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.MANAGER]}>
              <Reports />
            </RoleRoute>
          }
        />

        {/* Calendar Module */}
        <Route path={ROUTES.CALENDAR} element={<CalendarPage />} />

        {/* Settings Module (Admin only) */}
        <Route
          path={ROUTES.SETTINGS}
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <Settings />
            </RoleRoute>
          }
        />

        {/* Audit Logs Module (Admin only) */}
        <Route
          path={ROUTES.AUDIT_LOGS}
          element={
            <RoleRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <AuditLogs />
            </RoleRoute>
          }
        />

        {/* Notifications Module */}
        <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />

        {/* User Profile Module */}
        <Route path={ROUTES.PROFILE} element={<Profile />} />

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
