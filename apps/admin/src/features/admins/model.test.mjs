import assert from "node:assert/strict";
import test from "node:test";

import {
	ADMIN_LIST_DEFAULTS,
	adminCreateSchema,
	adminListSearchSchema,
	adminUpdateSchema,
	isUnchangedAdminName,
} from "#/features/admins/model.ts";

test("administrator list search applies stable defaults", () => {
	assert.deepEqual(adminListSearchSchema.parse({}), ADMIN_LIST_DEFAULTS);
});

test("administrator list search preserves valid URL state", () => {
	assert.deepEqual(
		adminListSearchSchema.parse({
			page: "3",
			perPage: "50",
			q: "  jane@example.com  ",
			orderBy: "email_asc",
		}),
		{
			page: 3,
			perPage: 50,
			q: "jane@example.com",
			orderBy: "email_asc",
		},
	);
});

test("administrator list search recovers from invalid pagination and sorting", () => {
	assert.deepEqual(
		adminListSearchSchema.parse({
			page: "-4",
			perPage: "0",
			orderBy: "unsupported",
		}),
		ADMIN_LIST_DEFAULTS,
	);
});

test("administrator creation trims accepted values", () => {
	assert.deepEqual(
		adminCreateSchema.parse({
			name: "  Jane Doe  ",
			email: "  jane.doe@example.com  ",
		}),
		{
			name: "Jane Doe",
			email: "jane.doe@example.com",
		},
	);
});

test("administrator creation rejects invalid email and oversized names", () => {
	assert.equal(
		adminCreateSchema.safeParse({
			name: "x".repeat(256),
			email: "not-an-email",
		}).success,
		false,
	);
});

test("administrator update only accepts a trimmed name", () => {
	assert.deepEqual(adminUpdateSchema.parse({ name: "  Jane Doe  " }), { name: "Jane Doe" });
	assert.equal(adminUpdateSchema.safeParse({ name: "   " }).success, false);
});

test("unchanged administrator names do not submit", () => {
	assert.equal(isUnchangedAdminName(" Jane Doe ", "Jane Doe"), true);
	assert.equal(isUnchangedAdminName("Jane Smith", "Jane Doe"), false);
});
