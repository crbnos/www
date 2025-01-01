import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const WizardContext = createContext<{
  showWizard: boolean;
  setShowWizard: Dispatch<SetStateAction<boolean>>;
}>({
  showWizard: false,
  setShowWizard: () => {},
});

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
};
