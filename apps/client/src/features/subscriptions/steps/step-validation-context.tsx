import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

type StepForm = {
	isComplete: () => boolean;
	state: { isFieldsValid: boolean };
	store: { subscribe: (listener: () => void) => { unsubscribe: () => void } };
	validateAllFields: (cause: "submit") => Promise<unknown>;
};

type StepValidationContextValue = {
	canValidate: boolean;
	registerForm: (form: StepForm) => () => void;
	validateForms: () => Promise<boolean>;
};

const StepValidationContext = createContext<StepValidationContextValue | null>(null);

export function SubscriptionStepValidationProvider({ children }: { children: ReactNode }) {
	const forms = useRef(new Set<StepForm>());
	const [formCanValidate, setFormCanValidate] = useState(() => new Map<StepForm, boolean>());

	const registerForm = useCallback((form: StepForm) => {
		forms.current.add(form);
		const updateCanValidate = () => {
			setFormCanValidate((current) => {
				const canValidate = form.isComplete();
				if (current.get(form) === canValidate) return current;

				const next = new Map(current);
				next.set(form, canValidate);
				return next;
			});
		};
		updateCanValidate();
		const subscription = form.store.subscribe(updateCanValidate);

		return () => {
			subscription.unsubscribe();
			forms.current.delete(form);
			setFormCanValidate((current) => {
				if (!current.has(form)) return current;

				const next = new Map(current);
				next.delete(form);
				return next;
			});
		};
	}, []);

	const validateForms = useCallback(async () => {
		await Promise.all([...forms.current].map((form) => form.validateAllFields("submit")));

		return [...forms.current].every((form) => form.state.isFieldsValid);
	}, []);

	const canValidate =
		formCanValidate.size > 0 && [...formCanValidate.values()].every((canValidate) => canValidate);
	const value = useMemo(
		() => ({ canValidate, registerForm, validateForms }),
		[canValidate, registerForm, validateForms],
	);

	return <StepValidationContext.Provider value={value}>{children}</StepValidationContext.Provider>;
}

export function useRegisterSubscriptionStepForm(
	form: Omit<StepForm, "isComplete">,
	isComplete: StepForm["isComplete"],
) {
	const context = useContext(StepValidationContext);
	if (!context) throw new Error("A subscription step validation provider is required.");

	useEffect(() => context.registerForm({ ...form, isComplete }), [context, form, isComplete]);
}

export function useSubscriptionStepValidation() {
	const context = useContext(StepValidationContext);
	if (!context) throw new Error("A subscription step validation provider is required.");

	return context;
}
