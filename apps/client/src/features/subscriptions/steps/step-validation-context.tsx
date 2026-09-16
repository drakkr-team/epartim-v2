import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
} from "react";

type StepForm = {
	state: { isFieldsValid: boolean };
	validateAllFields: (cause: "submit") => Promise<unknown>;
};

type StepValidationContextValue = {
	registerForm: (form: StepForm) => () => void;
	validateForms: () => Promise<boolean>;
};

const StepValidationContext = createContext<StepValidationContextValue | null>(null);

export function SubscriptionStepValidationProvider({ children }: { children: ReactNode }) {
	const forms = useRef(new Set<StepForm>());

	const registerForm = useCallback((form: StepForm) => {
		forms.current.add(form);

		return () => forms.current.delete(form);
	}, []);

	const validateForms = useCallback(async () => {
		await Promise.all([...forms.current].map((form) => form.validateAllFields("submit")));

		return [...forms.current].every((form) => form.state.isFieldsValid);
	}, []);

	const value = useMemo(() => ({ registerForm, validateForms }), [registerForm, validateForms]);

	return <StepValidationContext.Provider value={value}>{children}</StepValidationContext.Provider>;
}

export function useRegisterSubscriptionStepForm(form: StepForm) {
	const context = useContext(StepValidationContext);
	if (!context) throw new Error("A subscription step validation provider is required.");

	useEffect(() => context.registerForm(form), [context, form]);
}

export function useSubscriptionStepValidation() {
	const context = useContext(StepValidationContext);
	if (!context) throw new Error("A subscription step validation provider is required.");

	return context;
}
