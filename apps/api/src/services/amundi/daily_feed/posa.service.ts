import { parse } from "csv/sync";
import { DateTime } from "luxon";

type PosaCsvRow = {
	CD_ENT: string; // Company Amundi Id
	CD_DISPO: string; // Contract code
	TYPE_DISPO: string; // Type of contract
	CD_FOUNDS: string; // Fund code
	ISIN_FCPE: string; // Fund reference (ISIN)
	DT_VAL: DateTime; // Date of validity
	COURS: number; // Value of found
	"SUN(NB_PARTS_DISPO)": number; // Number of available parts
	"SUM(NB_PARTS_INDISPO)": number; // Number of unavailable parts
};

export default class AdmundiDailyFeedPosaService {
	async import(csvBuffer: Uint8Array<ArrayBuffer>) {
		const data = this.#parseCsv(csvBuffer);

		console.log(data);
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
