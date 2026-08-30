export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

type ActionEmailButtonInput = {
  href: string;
  label: string;
};

export function renderActionEmailButton(input: ActionEmailButtonInput): string {
  const href = escapeHtml(input.href);
  const label = escapeHtml(input.label);

  return `
    <p style="margin: 24px 0;">
      <a
        href="${href}"
        style="
          display: inline-block;
          background-color: #0d6efd;
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          padding: 12px 24px;
          border-radius: 6px;
        "
      >${label}</a>
    </p>
  `.trim();
}
