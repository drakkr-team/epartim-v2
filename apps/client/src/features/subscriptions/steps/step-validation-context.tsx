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
	state: { isFieldsValid: boolean; values: unknown };
	store: { subscribe: (listener: () => void) => { unsubscribe: () => void } };
	validateAllFields: (cause: "submit") => Promise<unknown>;
};

type RegisteredStepForm = {
	form: StepForm;
	isComplete: () => boolean;
	isValidated: boolean;
	values: unknown;
};

type StepValidationContextValue = {
	canValidate: boolean;
	registerForm: (form: StepForm, isComplete: () => boolean) => () => void;
	validateForms: () => Promise<boolean>;
};

const StepValidationContext = createContext<StepValidationContextValue | null>(null);

function invalidateValidationWhenValuesChange(registeredForm: RegisteredStepForm) {
	const { form } = registeredForm;
	if (registeredForm.values === form.state.values) return;

	registeredForm.values = form.state.values;
	registeredForm.isValidated = false;
}

export function SubscriptionStepValidationProvider({ children }: { children: ReactNode }) {
	const forms = useRef(new Map<StepForm, RegisteredStepForm>());
	const [formCanValidate, setFormCanValidate] = useState(() => new Map<StepForm, boolean>());

	const registerForm = useCallback((form: StepForm, isComplete: () => boolean) => {
		const registeredForm: RegisteredStepForm = {
			form,
			isComplete,
			isValidated: false,
			values: form.state.values,
		};
		forms.current.set(form, registeredForm);

		const updateCanValidate = () => {
			invalidateValidationWhenValuesChange(registeredForm);

			setFormCanValidate((current) => {
				const canValidate = registeredForm.isComplete();
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
			if (forms.current.get(form) !== registeredForm) return;

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
		const registeredForms = [...forms.current.values()];
		registeredForms.forEach(invalidateValidationWhenValuesChange);
		const formsToValidate = registeredForms.filter((form) => !form.isValidated);

		await Promise.all(
			formsToValidate.map(async (registeredForm) => {
				const valuesBeforeValidation = registeredForm.values;
				await registeredForm.form.validateAllFields("submit");

				if (
					registeredForm.values === valuesBeforeValidation &&
					registeredForm.form.state.values === valuesBeforeValidation
				) {
					registeredForm.isValidated = registeredForm.form.state.isFieldsValid;
				}
			}),
		);

		registeredForms.forEach(invalidateValidationWhenValuesChange);

		return registeredForms.every(
			({ form, isValidated }) => isValidated && form.state.isFieldsValid,
		);
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
	form: StepForm,
	isComplete: RegisteredStepForm["isComplete"],
) {
	const context = useContext(StepValidationContext);
	if (!context) throw new Error("A subscription step validation provider is required.");

	const { registerForm } = context;
	useEffect(() => registerForm(form, isComplete), [form, isComplete, registerForm]);
}

export function useSubscriptionStepValidation() {
	const context = useContext(StepValidationContext);
	if (!context) throw new Error("A subscription step validation provider is required.");

	return context;
}
