"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
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
import StorefrontPhoneInput from "@/components/forms/phone-input";
import {
  getStorefrontDefaultPhoneCountry,
  resolveStorefrontPhoneCountry,
} from "@/lib/phone";

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

export default function AccountAddressesSection() {
  const [addresses, setAddresses] = useState<ListUserAddresses200Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<AddressFormState>(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const defaultPhoneCountry = getStorefrontDefaultPhoneCountry();

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
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
    setError(null);
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
      } else if (editingId) {
        await updateUserAddress(editingId, payload);
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

  async function handleDelete(addressId: string) {
    setError(null);
    try {
      await deleteUserAddress(addressId);
      if (editingId === addressId) {
        cancelEdit();
      }
      await loadAddresses();
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Could not delete this address."
      );
    }
  }

  async function handleSetDefault(addressId: string) {
    setError(null);
    try {
      await setDefaultUserAddress(addressId);
      await loadAddresses();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Could not update the default address."
      );
    }
  }

  return (
    <>
      <div className="rbt-single-info mb--24">
        <div className="rbt-single-info-header d-flex justify-content-between align-items-center mb--12 pt--4">
          <h6 className="mb--0">Saved addresses</h6>
          {editingId === null ? (
            <button
              type="button"
              className="rbt-btn rbt-btn-sm rbt-btn-secondary"
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
                          onClick={() => handleSetDefault(address.id)}
                        >
                          Set default
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="rbt-btn rbt-btn-sm rbt-btn-secondary"
                        onClick={() => startEdit(address)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rbt-btn rbt-btn-sm rbt-bg-color-danger shadow-none"
                        onClick={() => handleDelete(address.id)}
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
              disabled={submitting}
            >
              {submitting ? "Saving…" : "Save address"}
            </button>
            <button
              type="button"
              className="rbt-btn rbt-btn-sm rbt-btn-secondary"
              onClick={cancelEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : error ? (
        <p className="rbt-text-color-danger mb--24 b3">{error}</p>
      ) : null}
    </>
  );
}
