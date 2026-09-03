"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ApiError,
  createUserAddress,
  deleteUserAddress,
  fetchUserAddresses,
  setDefaultUserAddress,
  updateUserAddress,
  type ListUserAddresses200Item,
} from "@platform/api-client";
import {
  formatPhoneForDisplay,
  getPhoneValidationError,
} from "@platform/shared";
import { useUiElement } from "@/context/uiStore";
import StorefrontPhoneInput from "@/components/forms/phone-input";
import {
  getStorefrontDefaultPhoneCountry,
  resolveStorefrontPhoneCountry,
} from "@/lib/phone";
import AccountConfirmDialog from "./AccountConfirmDialog";
import { useAccountInfoGuard } from "./AccountInfoGuard";

type AddressFormState = {
  name: string;
  line1: string;
  line2: string;
  city: string;
  country: string;
  phone: string;
  isDefault: boolean;
};

const emptyForm = (): AddressFormState => ({
  name: "",
  line1: "",
  line2: "",
  city: "",
  country: "",
  phone: "",
  isDefault: false,
});

function formatAddress(address: ListUserAddresses200Item): string {
  const parts = [address.line1];
  if (address.line2) {
    parts.push(address.line2);
  }
  parts.push(`${address.city}, ${address.country}`);
  return parts.join(", ");
}

function hasAddressFormContent(form: AddressFormState): boolean {
  return Boolean(
    form.name.trim() ||
      form.line1.trim() ||
      form.line2.trim() ||
      form.city.trim() ||
      form.country.trim() ||
      form.phone.trim() ||
      form.isDefault
  );
}

export default function AccountAddressesSection() {
  const { showToaster } = useUiElement();
  const { actionsDisabled, reportState } = useAccountInfoGuard("addresses");
  const [addresses, setAddresses] = useState<ListUserAddresses200Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<AddressFormState>(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const defaultPhoneCountry = getStorefrontDefaultPhoneCountry();

  const addressToDelete = useMemo(
    () => addresses.find((address) => address.id === deleteConfirmId) ?? null,
    [addresses, deleteConfirmId]
  );

  const addressDirty = editingId !== null && hasAddressFormContent(form);

  useEffect(() => {
    reportState({
      busy: submitting || deletingId !== null,
      dirty: addressDirty,
    });
  }, [addressDirty, deletingId, reportState, submitting]);

  const loadAddresses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserAddresses();
      setAddresses(data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not load saved addresses."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  function startCreate() {
    setEditingId("new");
    setForm(emptyForm());
    setError(null);
    setPhoneError(null);
  }

  function startEdit(address: ListUserAddresses200Item) {
    setEditingId(address.id);
    setForm({
      name: address.name,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      country: address.country,
      phone: address.phone ?? "",
      isDefault: address.isDefault ?? false,
    });
    setError(null);
    setPhoneError(null);
  }

  function cancelEdit() {
    if (submitting) {
      return;
    }

    setEditingId(null);
    setForm(emptyForm());
    setError(null);
    setPhoneError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setPhoneError(null);

    const nextPhoneError = getPhoneValidationError(form.phone);
    if (nextPhoneError) {
      setPhoneError(nextPhoneError);
      setSubmitting(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      line1: form.line1.trim(),
      line2: form.line2.trim() || undefined,
      city: form.city.trim(),
      country: form.country.trim(),
      phone: form.phone.trim() || undefined,
      isDefault: form.isDefault,
    };

    try {
      if (editingId === "new") {
        await createUserAddress(payload);
        showToaster("Address saved");
      } else if (editingId) {
        await updateUserAddress(editingId, payload);
        showToaster("Address saved");
      }
      await loadAddresses();
      cancelEdit();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not save this address."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function openDeleteConfirmation(addressId: string) {
    if (deletingId || submitting) {
      return;
    }

    setError(null);
    setDeleteConfirmId(addressId);
  }

  function closeDeleteConfirmation() {
    if (!deletingId) {
      setDeleteConfirmId(null);
    }
  }

  async function handleDelete(addressId: string) {
    setDeletingId(addressId);
    setError(null);

    try {
      await deleteUserAddress(addressId);
      if (editingId === addressId) {
        cancelEdit();
      }
      await loadAddresses();
      setDeleteConfirmId(null);
      showToaster("Address deleted");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not delete this address."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(addressId: string) {
    if (actionsDisabled || submitting || deletingId) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await setDefaultUserAddress(addressId);
      await loadAddresses();
      showToaster("Default address updated");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not update the default address."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const listActionsDisabled =
    actionsDisabled || submitting || deletingId !== null || editingId !== null;
  const formDisabled = submitting;

  return (
    <>
      <div className="rbt-single-info mb--24">
        <div className="rbt-single-info-header d-flex justify-content-between align-items-center mb--12 pt--4">
          <h6 className="mb--0">Saved addresses</h6>
          {editingId === null ? (
            <button
              type="button"
              className="rbt-btn rbt-btn-sm rbt-btn-secondary"
              disabled={actionsDisabled || loading}
              onClick={startCreate}
            >
              <i className="fa-light fa-plus mr--4" />
              Add
            </button>
          ) : null}
        </div>
        {loading ? (
          <p className="b1 mb--0">Loading addresses…</p>
        ) : addresses.length === 0 && editingId === null ? (
          <p className="b1 mb--0">No saved addresses yet.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {addresses.map((address) => (
              <div key={address.id} className="border rounded p-3">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <p className="b1 rbt-text-medium mb--4">
                      {address.name}
                      {address.isDefault ? (
                        <span className="b3 ms-2">(Default)</span>
                      ) : null}
                    </p>
                    <p className="b1 mb--0">{formatAddress(address)}</p>
                    {address.phone ? (
                      <p className="b3 mt--8 mb--0">
                        {formatPhoneForDisplay(address.phone)}
                      </p>
                    ) : null}
                  </div>
                  {editingId === null ? (
                    <div className="d-flex flex-wrap gap-2">
                      {!address.isDefault ? (
                        <button
                          type="button"
                          className="rbt-btn rbt-btn-sm rbt-btn-secondary"
                          disabled={listActionsDisabled}
                          onClick={() => handleSetDefault(address.id)}
                        >
                          Set default
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="rbt-btn rbt-btn-sm rbt-btn-secondary"
                        disabled={listActionsDisabled}
                        onClick={() => startEdit(address)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rbt-btn rbt-btn-sm rbt-bg-color-danger shadow-none"
                        disabled={listActionsDisabled}
                        onClick={() => openDeleteConfirmation(address.id)}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingId !== null ? (
        <form onSubmit={handleSubmit} className="mb--24">
          <h6 className="mb--12">
            {editingId === "new" ? "Add address" : "Edit address"}
          </h6>
          <div className="row row--12">
            <div className="col-md-6 mt--16">
              <label className="rbt-field-label" htmlFor="address_name">
                Full name
              </label>
              <input
                id="address_name"
                className="rbt-input-field"
                value={form.name}
                disabled={formDisabled}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="col-md-6 mt--16">
              <StorefrontPhoneInput
                id="address_phone"
                label="Phone"
                value={form.phone}
                onChange={(nextValue) => {
                  setForm((current) => ({
                    ...current,
                    phone: nextValue,
                  }));
                  setPhoneError(getPhoneValidationError(nextValue));
                }}
                defaultCountry={defaultPhoneCountry}
                country={resolveStorefrontPhoneCountry(form.country)}
                disabled={formDisabled}
                error={phoneError}
              />
            </div>
            <div className="col-12 mt--16">
              <label className="rbt-field-label" htmlFor="address_line1">
                Street address
              </label>
              <input
                id="address_line1"
                className="rbt-input-field"
                value={form.line1}
                disabled={formDisabled}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    line1: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="col-12 mt--16">
              <label className="rbt-field-label" htmlFor="address_line2">
                Apartment, suite, etc.
              </label>
              <input
                id="address_line2"
                className="rbt-input-field"
                value={form.line2}
                disabled={formDisabled}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    line2: event.target.value,
                  }))
                }
              />
            </div>
            <div className="col-md-6 mt--16">
              <label className="rbt-field-label" htmlFor="address_city">
                City
              </label>
              <input
                id="address_city"
                className="rbt-input-field"
                value={form.city}
                disabled={formDisabled}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    city: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="col-md-6 mt--16">
              <label className="rbt-field-label" htmlFor="address_country">
                Country
              </label>
              <input
                id="address_country"
                className="rbt-input-field"
                value={form.country}
                disabled={formDisabled}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    country: event.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="col-12 mt--16">
              <label className="d-flex align-items-center gap-2 b3 mb--0">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  disabled={formDisabled}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      isDefault: event.target.checked,
                    }))
                  }
                />
                Use as default shipping address
              </label>
            </div>
          </div>
          {error ? (
            <p className="rbt-text-color-danger mt--12 mb--0 b3">{error}</p>
          ) : null}
          <div className="d-flex gap-2 mt--24">
            <button
              type="submit"
              className="rbt-btn rbt-btn-sm"
              disabled={formDisabled}
            >
              {submitting ? "Saving…" : "Save address"}
            </button>
            <button
              type="button"
              className="rbt-btn rbt-btn-sm rbt-btn-secondary"
              disabled={formDisabled}
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : error ? (
        <p className="rbt-text-color-danger mb--24 b3">{error}</p>
      ) : null}

      <AccountConfirmDialog
        confirmLabel="Yes, delete address"
        description={
          addressToDelete ? (
            <>
              Delete the address for <strong>{addressToDelete.name}</strong> at{" "}
              {formatAddress(addressToDelete)}?
            </>
          ) : (
            "Delete this saved address?"
          )
        }
        error={deleteConfirmId ? error : null}
        iconClassName="fa-regular fa-location-dot"
        loading={deletingId !== null}
        loadingLabel="Deleting…"
        onClose={closeDeleteConfirmation}
        onConfirm={() => {
          if (deleteConfirmId) {
            void handleDelete(deleteConfirmId);
          }
        }}
        open={deleteConfirmId !== null}
        title="Delete this address?"
        titleId="delete-address-confirm-title"
        variant="danger"
      />
    </>
  );
}
