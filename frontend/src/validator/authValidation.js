export function validateSignupInput({ name, email }) {
  // ---------------- NAME VALIDATION ----------------
  if (!name || typeof name !== "string") {
    return { success: false, error: "Name is required" };
  }

  const nameParts = name.trim().split(/\s+/);

  // must be 2 or 3 words only
  if (nameParts.length < 2 || nameParts.length > 3) {
    return {
      success: false,
      error: "Please enter your full name.",
    };
  }

  // name must only contain alphabets
  const nameRegex = /^[A-Za-z]+$/;

  for (const part of nameParts) {
    if (!nameRegex.test(part)) {
      return {
        success: false,
        error:
          "Name must contain only alphabets (no numbers or special characters)",
      };
    }
  }

  // ---------------- EMAIL VALIDATION ----------------
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return { success: false, error: "Invalid email address" };
  }

  return {
    success: true,
    data: {
      name: name.trim(),
      email: email.toLowerCase(),
    },
  };
}
