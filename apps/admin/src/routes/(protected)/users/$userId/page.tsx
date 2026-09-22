import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, Link as RouterLink } from "@tanstack/react-router";
import { TuyauError } from "@tuyau/core/client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@workspace/ui-react/components/button";
import { Card } from "@workspace/ui-react/components/card";
import { Menu } from "@workspace/ui-react/components/menu";
import { Spinner } from "@workspace/ui-react/components/spinner";
import {
	EllipsisVerticalIcon,
	MailIcon,
	SquarePenIcon,
	TrashIcon,
} from "@workspace/ui-react/icons";

import { DetailField } from "#/components/app/detail-field";
import { DeleteUserDialog } from "#/features/users/components/delete-dialog";
import { useResendOnboardingMutation } from "#/features/users/hooks/use-resend-onboarding-mutation";
import { api } from "#/libs/tuyau";

export const Route = createFileRoute("/(protected)/users/$userId/")({
	loader: async ({ context, params }) => {
		await context.queryClient.query(
			api.users.view.queryOptions({ params: { userId: params.userId } }, { staleTime: "static" }),
		);
	},
	onError: (error) => {
		if (error instanceof TuyauError) {
			if (error.isStatus(404)) {
				throw notFound();
			}
		}
	},
	component: Page,
});

function Page() {
	const { t } = useTranslation("routes.(protected).users.$userId");

	const { userId } = Route.useParams();

	const { data: user } = useSuspenseQuery(api.users.view.queryOptions({ params: { userId } }));
	const canDoActions = user.meta.canUpdate || user.meta.canDelete || user.meta.canResendOnboarding;

	const { mutateAsync: resendOnboarding, isPending: isResendingOnboarding } =
		useResendOnboardingMutation();
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

	const handleResendOnboarding = async () => {
		await resendOnboarding({ params: { userId: user.id } });
	};

	return (
		<main className="mx-auto grid max-w-xl gap-9">
			<header className="flex items-center justify-between gap-2">
				<div className="grid gap-1">
					<h2 className="font-bold text-primary-9 text-xs uppercase tracking-widest">
						{t("headline")}
					</h2>
					<h1 className="font-bold text-3xl text-secondary-12">{t("title")}</h1>
					<p className="text-neutral-11 text-sm">{t("description")}</p>
				</div>

				{canDoActions && (
					<Menu>
						<Menu.Trigger render={<Button variant="ghost" size="icon-md" />}>
							<EllipsisVerticalIcon />
						</Menu.Trigger>

						<Menu.Content align="end">
							{user.meta.canUpdate && (
								<Menu.Item render={<RouterLink to="/users/$userId/edit" params={{ userId }} />}>
									<SquarePenIcon />
									{t("action.edit")}
								</Menu.Item>
							)}
							{user.meta.canResendOnboarding && (
								<Menu.Item
									closeOnClick={false}
									onClick={handleResendOnboarding}
									disabled={isResendingOnboarding}
								>
									{isResendingOnboarding ? <Spinner /> : <MailIcon />}
									{t("action.resendOnboarding")}
								</Menu.Item>
							)}
							{user.meta.canDelete && (
								<Menu.Item variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
									<TrashIcon />
									{t("action.delete")}
								</Menu.Item>
							)}
						</Menu.Content>
					</Menu>
				)}
			</header>

			<Card className="grid grid-cols-2 gap-4">
				<DetailField label={t("field.id")} value={user.id.toString()} />
				<DetailField label={t("field.firstName")} value={user.firstName} />
				<DetailField label={t("field.lastName")} value={user.lastName} />
				<DetailField label={t("field.email")} value={user.email} />
				<DetailField
					label={t("field.activatedAt")}
					value={user.activatedAt?.toLocaleDateString() ?? t("status.pendingActivation")}
				/>
				<DetailField label={t("field.createdAt")} value={user.createdAt.toLocaleDateString()} />
				<DetailField label={t("field.updatedAt")} value={user.updatedAt.toLocaleDateString()} />
			</Card>

			<DeleteUserDialog user={user} open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} />
		</main>
	);
}
