type DemoNoticeProps = {
  title?: string;
  description: string;
};

export function DemoNotice({
  title = "Demo data only",
  description,
}: DemoNoticeProps) {
  return (
    <div
      className="mb-6 rounded-card border border-amber-200 bg-amber-50 px-4 py-3 text-[14px] text-amber-900"
      role="status"
    >
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-amber-800">{description}</p>
    </div>
  );
}
