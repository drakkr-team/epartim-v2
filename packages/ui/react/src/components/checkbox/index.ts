import { CheckboxGroup, CheckboxRoot } from "./checkbox";

export { Checkbox as CheckboxHeadless } from "@base-ui/react/checkbox";

export const Checkbox = Object.assign(CheckboxRoot, {
	Group: CheckboxGroup,
});

export type { CheckboxGroupProps, CheckboxRootProps as CheckboxProps } from "./checkbox";
