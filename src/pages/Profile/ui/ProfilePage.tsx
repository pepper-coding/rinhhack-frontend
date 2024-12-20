import {
	Avatar,
	Button,
	Card,
	Skeleton,
	SkeletonItem,
	Subtitle2,
	Text,
	Title3,
	Toast,
	ToastBody,
	Toaster,
	ToastTitle,
	useId,
	useToastController,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { $api } from "@/shared/api/api";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosResponse } from "axios";
import { Employee } from "@/shared/types/Employee";
import { useTranslation } from "react-i18next";
import { useUserStore } from "@/entities/User";
import { ExcelFile } from "@/shared/types/ExcelFile";
import { Header } from "@/widgets/Header/ui/Header";
import { ArrowDownloadFilled } from "@fluentui/react-icons";
import { getExcelPage } from "@/shared/consts/router";
import { TableModal } from "@/entities/Admin/ui/Modals/Tables/TableModal";

const ProfilePage = () => {
	const toasterId = useId("toaster-profile");
	const { dispatchToast } = useToastController(toasterId);
	const { id } = useParams();
	const { t } = useTranslation();
	const { user } = useUserStore();
	const [isLoading, setIsLoading] = useState(false);
	const [isExcelLoading, setIsExcelLoading] = useState(false);
	const [isLastExcelLoading, setIsLastExcelLoading] = useState(false);
	const [currentUser, setCurrentUser] = useState<Employee & { firstName: string; lastName: string }>();
	const [excels, setExcels] = useState<ExcelFile[]>([]);
	const [lastExcel, setLastExcel] = useState<ExcelFile>();
	const nav = useNavigate();
	const [isOperationLoading, setIsOperationLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const notify = () =>
		dispatchToast(
			<Toast>
				<ToastTitle>{t("error")}</ToastTitle>
				<ToastBody>{t("error fetch user")}</ToastBody>
			</Toast>,
			{ intent: "error" },
		);

	const notifyExcel = () =>
		dispatchToast(
			<Toast>
				<ToastTitle>{t("error")}</ToastTitle>
				<ToastBody>{t("error fetch excel")}</ToastBody>
			</Toast>,
			{ intent: "error" },
		);

	useEffect(() => {
		const fetchMe = async () => {
			try {
				setIsLoading(true);
				const res = await $api.get<void, AxiosResponse<Employee & { firstName: string; lastName: string }>>(
					"/users/" + id,
				);
				if (res.data) {
					setCurrentUser(res.data);
				} else {
					notify();
				}
			} catch (e) {
				console.log(e);
				notify();
			} finally {
				setIsLoading(false);
			}
		};
		fetchMe();
	}, [id]);

	// useEffect(() => {
	// 	const fetchLastExcel = async () => {
	// 		try {
	// 			setIsLastExcelLoading(true);
	// 			const res = await $api.get<void, AxiosResponse<ExcelFile>>("/excel/files");
	// 			if (res.data) {
	// 				setLastExcel(res.data);
	// 			} else {
	// 				notifyExcel();
	// 			}
	// 		} catch (e) {
	// 			console.log(e);
	// 			notifyExcel();
	// 		} finally {
	// 			setIsLastExcelLoading(false);
	// 		}
	// 	};
	// 	fetchLastExcel();
	// }, [id]);

	const fetchExcels = async () => {
		try {
			setIsLastExcelLoading(true);
			setIsExcelLoading(true);
			const res = await $api.get<void, AxiosResponse<{ files: ExcelFile[] }>>("/excel/files");
			if (res.data) {
				setExcels(res.data.files);
				setLastExcel(res.data.files[0] ? res.data.files[0] : undefined);
			} else {
				notifyExcel();
			}
		} catch (e) {
			console.log(e);
			notifyExcel();
		} finally {
			setIsExcelLoading(false);
			setIsLastExcelLoading(false);
		}
	};

	useEffect(() => {
		fetchExcels();
	}, [id]);

	if (currentUser?.id === user?.id) {
		return (
			<>
				<Header />
				<Toaster toasterId={toasterId} />
				<TableModal
					isOpen={isOpen}
					isOperationLoading={isOperationLoading}
					mode="create"
					onClose={() => setIsOpen(false)}
					onSave={async (saveData) => {
						setIsOperationLoading(true);
						try {
							await $api.post("/excel/create", { filename: saveData.name });
							fetchExcels();
						} catch (e) {
							console.log(e);
							notify();
						} finally {
							setIsOperationLoading(false);
						}
					}}
					table={{ download_link: "", id: "", last_modified: "", name: "", size: 0 }}
				/>
				<div className="grid grid-cols-2 gap-4 p-6">
					<Card>
						{isLoading ? (
							<>
								<div className="flex gap-3 items-center w-full">
									<Skeleton aria-label="Loading Content">
										<SkeletonItem shape="circle" size={64} />
									</Skeleton>
									<Skeleton className="flex-1" aria-label="Loading Content">
										<SkeletonItem size={36} />
									</Skeleton>
								</div>
								<div className="flex flex-col gap-3 w-full h-full">
									<Skeleton className="flex-1" aria-label="Loading Content">
										<SkeletonItem size={24} />
									</Skeleton>
									<Skeleton className="flex-1" aria-label="Loading Content">
										<SkeletonItem size={24} />
									</Skeleton>
									<Skeleton className="flex-1" aria-label="Loading Content">
										<SkeletonItem size={24} />
									</Skeleton>
								</div>
							</>
						) : (
							<>
								<div className="flex gap-3 items-center">
									<Avatar
										size={64}
										aria-label={currentUser?.firstName}
										name={currentUser?.firstName + " " + currentUser?.lastName}
										badge={{ status: "available" }}
									/>
									<Title3>
										{currentUser?.firstName} {currentUser?.lastName}
									</Title3>
								</div>
								<div className="flex flex-col items-start ">
									<Subtitle2>
										{t("email")}: {currentUser?.email}
									</Subtitle2>
									<Subtitle2>
										{t("position")}: {currentUser?.position}
									</Subtitle2>
									<Subtitle2>
										{t("department")}: {currentUser?.department}
									</Subtitle2>
								</div>
							</>
						)}
					</Card>
					<Card>
						<Title3>{t("lastModified excel")}</Title3>
						{isLastExcelLoading ? (
							<>
								<Skeleton aria-label="Loading Content">
									<SkeletonItem size={96} />
								</Skeleton>
							</>
						) : lastExcel ? (
							<>
								<Title3>{lastExcel.name}</Title3>
								<Text>
									{t("size")}:{" "}
									{lastExcel.size / 1024 > 1024
										? `${(lastExcel.size / 1024 / 1024).toFixed(2)}МБ`
										: `${(lastExcel.size / 1024).toFixed(2)}КБ`}
								</Text>
								<div className="flex">
									<Button
										as="a"
										style={{ marginRight: 5 }}
										href={lastExcel.download_link}
										download={lastExcel.name}
										icon={<ArrowDownloadFilled />}
										aria-label="Download"
									/>
									<Button className="flex-1" onClick={() => nav(getExcelPage(lastExcel.name))} aria-label="Go">
										{t("go")}
									</Button>
								</div>
							</>
						) : (
							<Subtitle2>{t("no lastModified")}</Subtitle2>
						)}
					</Card>
				</div>

				<div className="flex justify-between px-6">
					<Title3>{t("your tables")}</Title3>
					<Button onClick={() => setIsOpen(true)}>{t("create")}</Button>
				</div>
				<div
					className={
						excels.length === 0 && !isExcelLoading
							? "flex justify-center items-center h-64"
							: "grid grid-cols-3 gap-3 p-6 pt-6"
					}
				>
					{excels.length === 0 && !isExcelLoading && <Title3>{t("no tables")}</Title3>}
					{isExcelLoading ? (
						<>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
							<Skeleton aria-label="Loading Content">
								<SkeletonItem size={96} />
							</Skeleton>
						</>
					) : (
						excels.map((excel) => (
							<Card>
								<Title3>{excel.name}</Title3>
								<Text>
									{t("size")}:{" "}
									{excel.size / 1024 > 1024
										? `${(excel.size / 1024 / 1024).toFixed(2)}МБ`
										: `${(excel.size / 1024).toFixed(2)}КБ`}
								</Text>
								<div className="flex">
									<Button
										as="a"
										style={{ marginRight: 5 }}
										href={excel.download_link}
										download={excel.name}
										icon={<ArrowDownloadFilled />}
										aria-label="Download"
									/>
									<Button className="flex-1" onClick={() => nav(getExcelPage(excel.name))} aria-label="Go">
										{t("go")}
									</Button>
								</div>
							</Card>
						))
					)}
				</div>
			</>
		);
	} else {
		return (
			<>
				<Toaster toasterId="" />
				<div className="grid grid-cols-2 p-6">
					<Card>
						<div className="flex gap-3 items-center">
							<Avatar
								size={64}
								aria-label={currentUser?.firstName}
								name={currentUser?.firstName + " " + currentUser?.lastName}
								badge={{ status: "available" }}
							/>
							<Title3>
								{currentUser?.firstName} {currentUser?.lastName}
							</Title3>
						</div>
						<div className="flex flex-col items-start ">
							<Subtitle2>
								{t("email")}: {currentUser?.email}
							</Subtitle2>
							<Subtitle2>
								{t("position")}: {currentUser?.position}
							</Subtitle2>
							<Subtitle2>
								{t("department")}: {currentUser?.department}
							</Subtitle2>
						</div>
					</Card>
				</div>
			</>
		);
	}
};

export default ProfilePage;
