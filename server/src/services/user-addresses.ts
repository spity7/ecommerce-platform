import type { HydratedDocument, Types } from "mongoose";
import type { UserDocument } from "../models/User.js";

type AddressSubdocument = UserDocument["addresses"][number];

function getAddresses(user: UserDocument): UserDocument["addresses"] {
  const doc = user as HydratedDocument<UserDocument>;
  if (!doc.addresses) {
    doc.set("addresses", []);
  }
  return doc.addresses;
}

export function findUserAddress(
  user: UserDocument,
  addressId: string
): AddressSubdocument | undefined {
  return getAddresses(user).find(
    (address) => address._id.toString() === addressId
  );
}

export function setDefaultAddress(
  user: UserDocument,
  addressId: string
): AddressSubdocument | undefined {
  const target = findUserAddress(user, addressId);
  if (!target) {
    return undefined;
  }

  for (const address of getAddresses(user)) {
    address.isDefault = address._id.toString() === addressId;
  }

  return target;
}

export function ensureSingleDefaultAddress(user: UserDocument): void {
  const addresses = getAddresses(user);
  if (addresses.length === 0) {
    return;
  }

  const defaultAddress = addresses.find((address) => address.isDefault);
  if (defaultAddress) {
    return;
  }

  addresses[0]!.isDefault = true;
}

export function removeUserAddress(
  user: UserDocument,
  addressId: string
): boolean {
  const addresses = getAddresses(user);
  const index = addresses.findIndex(
    (address) => address._id.toString() === addressId
  );
  if (index < 0) {
    return false;
  }

  const removedDefault = addresses[index]!.isDefault;
  addresses.splice(index, 1);

  if (removedDefault) {
    ensureSingleDefaultAddress(user);
  }

  return true;
}

export function addUserAddress(
  user: UserDocument,
  input: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    country: string;
    phone?: string;
    isDefault?: boolean;
  }
): Types.ObjectId {
  const addresses = getAddresses(user);
  const shouldBeDefault =
    input.isDefault === true || addresses.length === 0;

  if (shouldBeDefault) {
    for (const address of addresses) {
      address.isDefault = false;
    }
  }

  const address = addresses.create({
    name: input.name,
    line1: input.line1,
    line2: input.line2 ?? "",
    city: input.city,
    country: input.country,
    phone: input.phone ?? "",
    isDefault: shouldBeDefault,
  });
  addresses.push(address);
  return address._id;
}
