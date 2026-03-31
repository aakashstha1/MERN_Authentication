export const validatePassword = (password) => {
  const rules = [
    { label: "at least 8 characters", met: password.length >= 8 },
    { label: "uppercase letter", met: /[A-Z]/.test(password) },
    { label: "lowercase letter", met: /[a-z]/.test(password) },
    { label: "a number", met: /\d/.test(password) },
    { label: "special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  // Find the first rule that is not met
  const firstFailed = rules.find((rule) => !rule.met);

  if (!firstFailed) {
    return { valid: true };
  }

  return {
    valid: false,
    failedRule: { message: `Password must contain ${firstFailed.label}` }, // only the first failed rule
  };
};
