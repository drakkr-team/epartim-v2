import type { MatchingForm } from "#/features/subscriptions/contract_characteristics/components/matching-fields";
import type {
	MatchingDeviceKey,
	SubscriptionDeviceMatching,
} from "#/features/subscriptions/contract_characteristics/hooks/use-form";

export type MatchingChange = (next: SubscriptionDeviceMatching, save?: boolean) => void;

export type MatchingChildProps = {
	device: MatchingDeviceKey;
	form: MatchingForm;
	matching: SubscriptionDeviceMatching;
	onChange: MatchingChange;
};
