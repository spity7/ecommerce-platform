"use client";

import { useUiElement } from "@/context/uiStore";
import StorefrontSearchPanelContent, {
  type StorefrontSearchPanelVariant,
} from "@/components/store/StorefrontSearchPanelContent";

type SearchDropdownCommonProps = {
  variant?: StorefrontSearchPanelVariant;
};

export default function SearchDropdownCommon({
  variant = "demo",
}: SearchDropdownCommonProps) {
  const { closeCommonSearch, commonSearchOpen } = useUiElement();
  return (
    <div
      id="header-common-search-dropdown"
      role="dialog"
      aria-modal="false"
      aria-label="Sticky header product search panel"
      className={`rbt-search-dropdown rbt-common-search-dropdown-activation${commonSearchOpen ? " active" : ""}`}
    >
      <div className="wrapper">
        <StorefrontSearchPanelContent
          copyLinkInputId="search-dropdown-common-link"
          separatorClassName="ptb--24"
          titleClassName="text-start text-md-center"
          variant={variant}
          onSearchSubmitted={closeCommonSearch}
        />
      </div>
    </div>
  );
}
