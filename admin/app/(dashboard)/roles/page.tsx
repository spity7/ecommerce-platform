import Link from "next/link";
import { DemoNotice } from "@/components/admin/demo-notice";
import { RoleListTable } from "@/components/admin/operation-list-pages";
import { Icon } from "@/components/layout/icon";
import { PageHeader } from "@/components/layout/page-header";
import { routes } from "@/config/routes";
import { roles } from "@/data/admin/operations";

export default function RolesPage() {
  return (
    <>
      <PageHeader
        actions={
          <Link
            className="inline-flex h-11 items-center gap-2 rounded-base bg-brand-600 px-4 text-[14px] font-semibold text-white hover:bg-brand-700"
            href={routes.createRole}
          >
            <Icon className="h-4 w-4" name="plus" />
            Create Role
          </Link>
        }
        description="Control dashboard permissions for admins and staff members."
        eyebrow="Access Control"
        title="Roles"
      />
      <DemoNotice description="Role management is template UI only. Access control is enforced by the admin role on the API — not by these demo roles." />
      <RoleListTable roles={roles} />
    </>
  );
}
