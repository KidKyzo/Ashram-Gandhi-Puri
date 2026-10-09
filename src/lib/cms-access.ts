import type { Access, FieldAccess } from "payload";

export function isAdmin(user: unknown): boolean {
  return Boolean(user && typeof user === "object" && "role" in user && user.role === "admin");
}

export function isStaff(user: unknown): boolean {
  return Boolean(user && typeof user === "object" && "role" in user &&
    (user.role === "admin" || user.role === "editor"));
}

export const adminOnly: Access = ({ req }) => isAdmin(req.user);
export const staffOnly: Access = ({ req }) => isStaff(req.user);
export const adminField: FieldAccess = ({ req }) => isAdmin(req.user);
export const publishedOrStaff: Access = ({ req }) =>
  isStaff(req.user) || { _status: { equals: "published" } };

export const adminOrSelf: Access = ({ req }) => {
  if (isAdmin(req.user)) return true;
  if (!isStaff(req.user) || !req.user) return false;
  return { id: { equals: req.user.id } };
};
