import { NotFoundPage } from "@/pages/NotFoundPage";
import { LazyMainPage } from "@/pages/MainPage";
import {
	AppRoutes,
	getExcelPage,
	getRouteAdmin,
	getRouteError,
	getRouteLogin,
	getRouteMain,
	getRouteTestPage,
	getRouteNotFound,
	getWorkspacePage,
	getTestExcelPage,
	getProfilePage,
	getVideoChatPage,
} from "@/shared/consts/router";
import { AppRouteProps } from "@/shared/types/router";
import { LazyLoginPage } from "@/pages/Login";
import { LazyTestPage } from "@/pages/TestPage";
import { LazyErrorPage } from "@/pages/Error";
import { LazyExcelPage } from "@/pages/ExcelPage";
import { LazyAdminPage } from "@/pages/AdminPanel";
import { UserRoles } from "@/entities/User";
import { LazyWorkspacePage } from "@/pages/WorkpacesPage";
import { LazyTestExcelPage } from "@/pages/TestExcelPage/ui/TestExcelPage.lazy";
import { LazyProfilePage } from "@/pages/Profile";
import { LazyVideoChat } from "@/pages/Video";

export const routeConfig: Record<AppRoutes, AppRouteProps> = {
	[AppRoutes.MAIN]: {
		path: getRouteMain(),
		element: <LazyMainPage />,
		authOnly: true,
	},
	[AppRoutes.NOT_FOUND]: {
		path: getRouteNotFound(),
		element: <NotFoundPage />,
		authOnly: true,
	},
	[AppRoutes.LOGIN]: {
		path: getRouteLogin(),
		element: <LazyLoginPage />,
	},
	[AppRoutes.TESTPAGE]: {
		path: getRouteTestPage(),
		element: <LazyTestPage />,
	},
	[AppRoutes.ERROR]: {
		path: getRouteError(),
		element: <LazyErrorPage />,
	},
	[AppRoutes.EXCELPAGE]: {
		path: getExcelPage(":id"),
		element: <LazyExcelPage />,
		authOnly: true,
	},
	[AppRoutes.TESTEXCELPAGE]: {
		path: getTestExcelPage(),
		element: <LazyTestExcelPage />,
		authOnly: false,
	},
	[AppRoutes.ADMIN]: {
		path: getRouteAdmin(),
		authOnly: true,
		element: <LazyAdminPage />,
		roles: [UserRoles.ADMIN],
	},
	[AppRoutes.WORKSPACEPAGE]: {
		path: getWorkspacePage(":id"),
		authOnly: false,
		element: <LazyWorkspacePage />,
	},
	[AppRoutes.PROFILE]: {
		path: getProfilePage(":id"),
		element: <LazyProfilePage />,
		authOnly: true,
	},
	[AppRoutes.VIDEOCHAT]: {
		path: getVideoChatPage(),
		element: <LazyVideoChat />,
		authOnly: true,
	},
};
