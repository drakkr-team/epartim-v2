import { useTranslation } from "react-i18next";

import {
	AUTHORIZATIONS_ACTIONS,
	AUTHORIZATIONS_RESOURCES,
	type AuthorizationOption,
} from "@workspace/api/constants/role";
import { Checkbox } from "@workspace/ui-react/components/checkbox";
import { Table } from "@workspace/ui-react/components/table";

type AuthorizationMatrixProps = {
	authorizations: AuthorizationOption[];
};

export function AuthorizationMatrix(props: AuthorizationMatrixProps) {
	const { authorizations } = props;

	const { t } = useTranslation("features.roles.components.authorization-matrix");

	return (
		<Table>
			<Table.Header>
				<Table.HeaderCell />
				<Table.HeaderCell className="text-center">{t("action.read")}</Table.HeaderCell>
				{AUTHORIZATIONS_ACTIONS.map((action) => (
					<Table.HeaderCell key={action} className="text-center">
						{t(`action.${action}`)}
					</Table.HeaderCell>
				))}
			</Table.Header>
			<Table.Body>
				{AUTHORIZATIONS_RESOURCES.map((resource) => (
					<Table.Row key={resource}>
						<Table.Cell>{t(`resource.${resource}`)}</Table.Cell>
						<Table.Cell>
							<div className="flex justify-center">
								<Checkbox size="sm" checked disabled />
							</div>
						</Table.Cell>
						{AUTHORIZATIONS_ACTIONS.map((action) => {
							const option = `${action}:${resource}` as const;

							return (
								<Table.Cell key={action}>
									<div className="flex justify-center">
										<Checkbox size="sm" checked={authorizations.includes(option)} disabled />
									</div>
								</Table.Cell>
							);
						})}
					</Table.Row>
				))}
			</Table.Body>
		</Table>
	);
}
