export const removeSingleValueForSearchParams = (
  params: URLSearchParams,
  key: string,
  valueToRemove: string
) => {
  const values = params.getAll(key);
  if (values.length) {
    params.delete(key);
    for (const value of values) {
      // BEWARE, remember the values will have been
      // converted to string
      if (value !== valueToRemove) {
        params.append(key, value);
      }
    }
  }
  return params; // For chaining if desired
};
