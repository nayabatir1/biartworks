import { Query } from "./types";

export default (query: Query) => {
  const q = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value) q.append(key, String(value));
  }

  return q.toString();
};
