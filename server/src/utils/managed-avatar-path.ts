export function getManagedAvatarObjectPath(
  avatarUrl: string,
  bucketName: string,
  userId: string
): string | null {
  let url: URL;
  try {
    url = new URL(avatarUrl);
  } catch {
    return null;
  }

  if (url.hostname !== "storage.googleapis.com") {
    return null;
  }

  const pathParts = url.pathname.split("/").filter(Boolean);
  if (pathParts.length < 2) {
    return null;
  }

  const [bucket, ...objectParts] = pathParts;
  if (bucket !== bucketName) {
    return null;
  }

  const objectPath = decodeURIComponent(objectParts.join("/"));
  const expectedPrefix = `avatars/${userId}/`;
  if (!objectPath.startsWith(expectedPrefix)) {
    return null;
  }

  return objectPath;
}
