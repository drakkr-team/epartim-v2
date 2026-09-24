import type { registry } from "@workspace/api/registry";

export type CompanyDetail = (typeof registry.routes)["admin.companies.view"]["types"]["response"];
