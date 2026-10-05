import { useTranslation } from "react-i18next";
import z from "zod";

import {
	getAvailableFormalismMethods,
	SubscriptionFormalismMethod,
} from "@workspace/api/constants/subscription_formalism";
import { Field } from "@workspace/ui-react/components/field";

import type {
	FormalismGroup,
	useFormalismForm,
} from "#/features/subscriptions/formalism/hooks/use-form";

type MethodSectionProps = Pick<ReturnType<typeof useFormalismForm>, "form" | "changeMethod"> & {
	group: FormalismGroup;
	headcount: string | null;
	devices: string;
	busy: boolean;
};

export function MethodSection({
	form,
	changeMethod,
	group,
	headcount,
	devices,
	busy,
}: MethodSectionProps) {
	const { t } = useTranslation("features.subscriptions.formalism");
	const methods = getAvailableFormalismMethods(group.group, headcount);
	function chooseMethod(method: SubscriptionFormalismMethod) {
		if (method !== form.state.values.method) changeMethod(method);
	}

	return (
		<section className="grid gap-6">
			<div>
				<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">
					{t(`group.${group.group}.eyebrow`)}
				</p>
				<h2 className="mt-2 font-bold text-secondary-12 text-xl">
					{t(`group.${group.group}.title`)}
				</h2>
				<p className="mt-2 text-neutral-11 text-sm">{t("methodsDescription")}</p>
				<p className="mt-2 font-medium text-secondary-12 text-sm">
					{t("selectedDevices", { devices })}
				</p>
			</div>
			{group.methodInvalidated && (
				<p
					role="status"
					className="rounded-md border border-warning-6 bg-warning-2 p-4 text-sm text-warning-11"
				>
					{t("methodInvalidated")}
				</p>
			)}
			<form.AppField
				name="method"
				validators={{
					onBlur: z
						.literal(Object.values(SubscriptionFormalismMethod), t("validation.method"))
						.nullable()
						.refine((value) => methods.some((method) => method === value), t("validation.method")),
				}}
			>
				{(field) => {
					const invalid =
						field.state.meta.isTouched && field.state.meta.errorMap.onBlur !== undefined;
					return (
						<Field
							name={field.name}
							invalid={invalid}
							aria-invalid={invalid}
							className="grid gap-3"
						>
							<div
								role="radiogroup"
								aria-required="true"
								aria-label={t(`group.${group.group}.title`)}
								className="grid gap-3 md:grid-cols-3"
							>
								{methods.map((method) => (
									<label
										key={method}
										className={`flex min-h-28 cursor-pointer items-start gap-3 rounded-sm border p-4 transition ${field.state.value === method ? "border-secondary-10 bg-secondary-2" : "border-neutral-6 bg-neutral-1 hover:border-neutral-8"}`}
									>
										<input
											type="radio"
											name={field.name}
											checked={field.state.value === method}
											value={method}
											required
											aria-invalid={invalid}
											onBlur={field.handleBlur}
											disabled={busy}
											onChange={() => chooseMethod(method)}
											className="mt-0.5 size-4 shrink-0 accent-secondary-9"
										/>
										<span>
											<span className="block font-semibold text-secondary-12 text-sm">
												{t(`method.${method}.title`)}
											</span>
											<span className="mt-1 block text-neutral-11 text-xs leading-5">
												{t(`method.${method}.description`)}
											</span>
										</span>
									</label>
								))}
							</div>
							{invalid &&
								field.state.meta.errorMap.onBlur?.map((error) => (
									<Field.Error key={error.message}>{error.message}</Field.Error>
								))}
						</Field>
					);
				}}
			</form.AppField>

			<form.Subscribe selector={(state) => state.values.method}>
				{(method) => (
					<>
						{method === SubscriptionFormalismMethod.DUE && (
							<div className="grid gap-2 rounded-md border border-warning-6 bg-warning-2 p-4 text-sm text-warning-11">
								<p className="font-semibold">{t("due.title")}</p>
								<p>{t("due.description")}</p>
								<p>{t("due.noFields")}</p>
							</div>
						)}
						{method === SubscriptionFormalismMethod.RATIFICATION && (
							<p className="text-neutral-11 text-sm">{t("ratification.shared")}</p>
						)}
					</>
				)}
			</form.Subscribe>
		</section>
	);
}
