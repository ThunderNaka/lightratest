export const filterValidValues = (
  object: Record<string, unknown> | undefined,
) => {
  return object && Object.values(object).some((value) => !!value)
    ? Object.fromEntries(Object.entries(object).filter(([_, value]) => !!value))
    : undefined;
};
