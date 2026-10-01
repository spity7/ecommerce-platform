"use client";

import { useUiElement } from "@/context/uiStore";
import StorefrontSearchPanelContent, {
  type StorefrontSearchPanelVariant,
} from "@/components/store/StorefrontSearchPanelContent";

type SearchDropdownProps = {
  variant?: StorefrontSearchPanelVariant;
};

export default function SearchDropdown({
  variant = "demo",
}: SearchDropdownProps) {
  const { closeSearch, searchOpen } = useUiElement();
  return (
    <>
      <div
        id="header-search-dropdown"
        role="dialog"
        aria-modal="false"
        aria-label="Product search panel"
        className={`rbt-search-dropdown rbt-search-dropdown-activation${searchOpen ? " active" : ""}`}
      >
        <div className="wrapper">
          <StorefrontSearchPanelContent
            copyLinkInputId="search-dropdown-link"
            showMediaDismissOutsider
            variant={variant}
            onSearchSubmitted={closeSearch}
          />
        </div>
        <button
          type="button"
          className="media-upload-close-area"
          aria-label="Close media upload area"
        />
      </div>
    </>
  );
}
