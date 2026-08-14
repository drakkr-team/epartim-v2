import { BaseModel, column, manyToMany } from "@adonisjs/lucid/orm";
import type { ManyToMany } from "@adonisjs/lucid/types/relations";
import { DateTime } from "luxon";

import User from "#models/user";

export const ROLE_CODES = [
	"administrator",
	"commercial",
	"network_manager",
	"distributor",
] as const;

export type RoleCode = (typeof ROLE_CODES)[number];

export default class Role extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare code: RoleCode;

	@column()
	declare name: string;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@manyToMany(() => User, { pivotTable: "user_roles" })
	declare users: ManyToMany<typeof User>;
}
