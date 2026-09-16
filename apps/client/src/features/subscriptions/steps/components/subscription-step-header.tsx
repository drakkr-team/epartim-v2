type SubscriptionStepHeaderProps = {
	description: string;
	eyebrow: string;
	title: string;
};

export function SubscriptionStepHeader(props: SubscriptionStepHeaderProps) {
	const { description, eyebrow, title } = props;

	return (
		<header className="border-neutral-4 border-b pb-6">
			<p className="font-bold text-primary-9 text-xs uppercase tracking-widest">{eyebrow}</p>
			<h1 className="mt-3 font-bold text-3xl text-secondary-12">{title}</h1>
			<p className="mt-2 text-neutral-11 text-sm sm:text-base">{description}</p>
		</header>
	);
}
