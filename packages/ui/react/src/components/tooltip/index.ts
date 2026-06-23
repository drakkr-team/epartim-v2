import { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from "./tooltip";

export { Tooltip as TooltipPrimitives } from "@base-ui/react/tooltip";

export const Tooltip = Object.assign(TooltipRoot, {
	Provider: TooltipProvider,
	Trigger: TooltipTrigger,
	Content: TooltipContent,
});

export type {
	TooltipContentProps,
	TooltipProviderProps,
	TooltipRootProps as TooltipProps,
	TooltipTriggerProps,
} from "./tooltip";
