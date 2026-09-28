import type {
	SubscriptionDeviceMatching,
	SubscriptionMatchingDevice,
} from "@workspace/api/constants/subscription_matching_rules";

import type { MatchingForm } from "#/features/subscriptions/contract_characteristics/components/matching-fields";

export type MatchingChange = (next: SubscriptionDeviceMatching, save?: boolean) => void;

export type MatchingChildProps = {
	device: SubscriptionMatchingDevice;
	form: MatchingForm;
	matching: SubscriptionDeviceMatching;
	onChange: MatchingChange;
};
