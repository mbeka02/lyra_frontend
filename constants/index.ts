import AsyncStorage from "@react-native-async-storage/async-storage";
const TOKEN_KEY = "my-token";
const FALSE = "false";
const TRUE = "true";

// Function to generate and get user-specific onboarding key
const getUserOnboardingKey = (email: string): string => {
  if (!email) {
    throw new Error("Email is required for onboarding key generation");
  }
  return `@onboarding_status_${email.toLowerCase().trim()}`;
};
// Function to set onboarding status for a new user
const initializeOnboardingStatus = async (email: string): Promise<void> => {
  try {
    if (!email) {
      throw new Error("Email is required for initializing onboarding status");
    }
    const key = getUserOnboardingKey(email);
    console.log("Initializing onboarding status for key:", key);
    await AsyncStorage.setItem(key, FALSE);
    console.log("Successfully initialized onboarding status to false");
  } catch (error) {
    console.error("Error initializing onboarding status:", error);
    throw error;
  }
};
// Function to mark onboarding as complete
const completeOnboarding = async (email: string): Promise<void> => {
  try {
    if (!email) {
      throw new Error("Email is required for completing onboarding");
    }
    const key = getUserOnboardingKey(email);
    console.log("Marking onboarding as complete for key:", key);
    await AsyncStorage.setItem(key, TRUE);
    console.log("Successfully marked onboarding as complete");
  } catch (error) {
    console.error("Error completing onboarding:", error);
    throw error;
  }
};
// Function to check onboarding status
const checkOnboardingStatus = async (email: string): Promise<boolean> => {
  try {
    if (!email) {
      console.warn("Email is required for checking onboarding status");
      return false;
    }

    const key = getUserOnboardingKey(email);
    console.log("Checking onboarding status for key:", key);

    const hasOnboarded = await AsyncStorage.getItem(key);
    console.log("Retrieved onboarding status:", hasOnboarded);

    // If the key doesn't exist, initialize it
    if (hasOnboarded === null) {
      console.log("No onboarding status found, initializing...");
      await initializeOnboardingStatus(email);
      return false;
    }

    const isOnboarded = hasOnboarded === TRUE;
    console.log("Final onboarding status:", isOnboarded);
    return isOnboarded;
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    return false;
  }
};
// Helper function to clear onboarding status
const clearOnboardingStatus = async (email: string): Promise<void> => {
  try {
    if (!email) {
      throw new Error("Email is required for clearing onboarding status");
    }
    const key = getUserOnboardingKey(email);
    console.log("Clearing onboarding status for key:", key);
    await AsyncStorage.removeItem(key);
    console.log("Successfully cleared onboarding status");
  } catch (error) {
    console.error("Error clearing onboarding status:", error);
    throw error;
  }
};

// Helper function to debug/view all onboarding keys
const getAllOnboardingKeys = async (): Promise<string[]> => {
  try {
    const allKeys = await AsyncStorage.getAllKeys();
    return allKeys.filter((key) => key.startsWith("@onboarding_status_"));
  } catch (error) {
    console.error("Error getting all onboarding keys:", error);
    return [];
  }
};
// In your development code
const debugOnboarding = async () => {
  const keys = await getAllOnboardingKeys();
  console.log("All onboarding keys:", keys);

  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);
    console.log("Key:", key, "Value:", value);
  }
};
export {
  TOKEN_KEY,
  getUserOnboardingKey,
  initializeOnboardingStatus,
  completeOnboarding,
  checkOnboardingStatus,
  clearOnboardingStatus,
  debugOnboarding,
};
