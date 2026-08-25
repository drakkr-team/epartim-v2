import { useTranslation } from "react-i18next";

type AdminStatusProps = {
	readonly activated: boolean;
};

export function AdminStatus({ activated }: AdminStatusProps) {
	const { t } = useTranslation("features.admins");

	return (
		<span
			className={
				activated
					? "inline-flex rounded-full bg-success-3 px-2 py-1 font-medium text-success-11 text-xs"
					: "inline-flex rounded-full bg-warning-3 px-2 py-1 font-medium text-warning-11 text-xs"
			}
		>
			{activated ? t("status.active") : t("status.pending")}
		</span>
	);
}
