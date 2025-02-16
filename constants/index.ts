import * as SecureStore from "expo-secure-store";
const TOKEN_KEY = "my-token";
// const USER_ONBOARDED = "onboardedv1";
const FALSE = "false";
const TRUE = "true";

// Function to generate and get user-specific onboarding key
const getUserOnboardingKey = (email: string) => `USER_ONBOARDED_${email}`;

// Function to set onboarding status for a new user
const initializeOnboardingStatus = async (email: string) => {
  const key = getUserOnboardingKey(email);
  await SecureStore.setItemAsync(key, FALSE); // Set to "false"
};

// Function to mark onboarding as complete
const completeOnboarding = async (email: string) => {
  const key = `USER_ONBOARDED_${email}`;
  await SecureStore.setItemAsync(key, TRUE); // Set to "true"
};

// Function to check onboarding status
const checkOnboardingStatus = async (email: string) => {
  const key = getUserOnboardingKey(email);
  const hasOnboarded = await SecureStore.getItemAsync(key);
  // If the key doesn't exist or the value is "false", return `false`
  if (hasOnboarded === null || hasOnboarded === FALSE) {
    return false;
  }

  // Otherwise, return `true` (assuming the value is "true")
  return true;
};
export {
  TOKEN_KEY,
  getUserOnboardingKey,
  initializeOnboardingStatus,
  completeOnboarding,
  checkOnboardingStatus,
};
