import { Avatar as AvatarHeadless } from "@base-ui/react/avatar";
import { cn, tv, type VariantProps } from "tailwind-variants";

const avatarVariants = tv({
	base: "inline-flex select-none items-center justify-center overflow-hidden rounded-full bg-neutral-4 text-neutral-12",
	variants: {
		size: {
			sm: "size-6 text-xs",
			md: "size-8 text-sm",
			lg: "size-10 text-base",
		},
	},
	defaultVariants: {
		size: "md",
	},
});

export type AvatarRootProps = Omit<AvatarHeadless.Root.Props, "className"> &
	VariantProps<typeof avatarVariants> & {
		className?: string;
	};

export function AvatarRoot(props: AvatarRootProps) {
	const { size, className, ...rest } = props;

	return <AvatarHeadless.Root className={avatarVariants({ size, className })} {...rest} />;
}

export type AvatarImageProps = AvatarHeadless.Image.Props;

export function AvatarImage(props: AvatarImageProps) {
	const { className, ...rest } = props;

	return <AvatarHeadless.Image className={cn("size-full object-cover", className)} {...rest} />;
}

export type AvatarFallbackProps = AvatarHeadless.Fallback.Props;

export function AvatarFallback(props: AvatarFallbackProps) {
	return <AvatarHeadless.Fallback {...props} />;
}
