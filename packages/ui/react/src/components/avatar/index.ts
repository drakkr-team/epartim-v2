import { AvatarFallback, AvatarImage, AvatarRoot } from "./avatar";

export { Avatar as AvatarHeadless } from "@base-ui/react/avatar";

export const Avatar = Object.assign(AvatarRoot, {
	Image: AvatarImage,
	Fallback: AvatarFallback,
});

export type {
	AvatarFallbackProps,
	AvatarImageProps,
	AvatarRootProps as AvatarProps,
} from "./avatar";
