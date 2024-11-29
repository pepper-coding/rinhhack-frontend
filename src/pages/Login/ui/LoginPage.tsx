import { useUserStore } from "@/entities/User";
import { getRouteMain } from "@/shared/consts/router";
import {
	Button,
	Card,
	Input,
	Spinner,
	Title3,
	Toast,
	ToastBody,
	Toaster,
	ToastTitle,
	useId,
	useToastController,
} from "@fluentui/react-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
	const toasterId = useId("toaster");
	const { dispatchToast } = useToastController(toasterId);

	const { t } = useTranslation();
	const [authData, setAuthData] = useState({
		email: "",
		password: "",
	});
	const nav = useNavigate();
	const { login, isLoading, setIsLoading, setIsError } = useUserStore();

	const notify = () =>
		dispatchToast(
			<Toast>
				<ToastTitle>{t("error")}</ToastTitle>
				<ToastBody>{t("wrong email")}</ToastBody>
			</Toast>,
			{ intent: "error" },
		);

	const onSubmit = async () => {
		setIsLoading(true);
		const user = await login(authData);
		setIsLoading(false);
		if (user) {
			nav(getRouteMain());
		} else {
			notify();
			setIsError(false);
		}
	};

	return (
		<>
			<Toaster toasterId={toasterId} />
			<div className="flex justify-center items-center w-full h-screen">
				<Card className="flex flex-col gap-2 justify-center p-2 w-[40%]">
					<Title3 className="mb-3">{t("login")}</Title3>
					<Input
						type="email"
						placeholder="email"
						value={authData.email}
						onChange={(e) => setAuthData((prev) => ({ ...prev, email: e.target.value }))}
					/>
					<Input
						type="password"
						placeholder="password"
						value={authData.password}
						onChange={(e) => setAuthData((prev) => ({ ...prev, password: e.target.value }))}
					/>
					<Button
						disabledFocusable={isLoading}
						icon={isLoading ? <Spinner size="tiny" /> : undefined}
						appearance="primary"
						type="submit"
						onClick={onSubmit}
					>
						Submit
					</Button>
				</Card>
			</div>
		</>
	);
};

export default LoginPage;
