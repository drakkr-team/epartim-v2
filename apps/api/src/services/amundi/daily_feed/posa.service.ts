import { parse } from "csv/sync";
import { DateTime } from "luxon";

import { POSA_DEVICE_TYPES, POSA_FUNDS, PosaDeviceType, PosaFund } from "#constants/posa";
import Company from "#models/company";
import Posa from "#models/posa";

type PosaCsvRow = {
	CD_ENT: string; // Company Amundi Id
	CD_DISPO: string; // Device code
	TYPE_DISPO: string; // Type of device
	CD_FONDS: string; // Fund code
	ISIN_FCPE: string; // Fund reference (ISIN)
	DT_VAL: DateTime; // Date of validity
	COURS: number; // Value of found
	"SUM(NB_PARTS_DISPO)": number; // Number of available parts
	"SUM(NB_PARTS_INDISPO)": number; // Number of unavailable parts
};

export default class AmundiDailyFeedPosaService {
	async import(csvBuffer: Uint8Array<ArrayBuffer>) {
		const data = this.#parseCsv(csvBuffer);

		for await (const row of data) {
			const company = await Company.findBy("amundiId", row.CD_ENT);
			if (!company) continue;

			const deviceType = POSA_DEVICE_TYPES[
				row.TYPE_DISPO as keyof typeof POSA_DEVICE_TYPES
			] as PosaDeviceType | undefined;
			const fund = POSA_FUNDS[row.ISIN_FCPE as keyof typeof POSA_FUNDS] as PosaFund | undefined;

			if (!deviceType) return console.warn("Unknown contract type:", row.TYPE_DISPO);
			if (!fund) return console.warn("Unknown fund reference:", row.ISIN_FCPE);

			await Posa.firstOrCreate(
				{
					companyId: row.CD_ENT,
					deviceCode: row.TYPE_DISPO,
					fund,
					valuationDate: row.DT_VAL,
				},
				{
					rate: row.COURS,
					deviceType,
					availableShares: row["SUM(NB_PARTS_DISPO)"],
					unavailableShares: row["SUM(NB_PARTS_INDISPO)"],
				},
			);
		}
	}

	#parseCsv(csvBuffer: Uint8Array<ArrayBuffer>) {
		const COLUMNS_AS_NUMBER = ["COURS", "SUM(NB_PARTS_DISPO)", "SUM(NB_PARTS_INDISPO)"];
		const COLUMNS_AS_DATE = ["DT_VAL"];

		return parse<PosaCsvRow>(csvBuffer, {
			columns: true,
			delimiter: "|",
			cast: (value, context) => {
				if (COLUMNS_AS_NUMBER.includes(context.column.toString())) {
					return parseFloat(value);
				}
				if (COLUMNS_AS_DATE.includes(context.column.toString())) {
					return DateTime.fromFormat(value, "dd/MM/yyyy");
				}
				return value;
			},
		});
	}
}
