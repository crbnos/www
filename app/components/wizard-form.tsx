import { useFetcher } from "@remix-run/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Code,
  Database,
  Headphones,
  Home,
  LucideIcon,
  Server,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

import { cn } from "~/lib/utils";
import { Button } from "./ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Progress } from "./ui/progress";

export const steps: Step[] = [
  {
    id: 1,
    title: "Ownership Model",
    description: "Choose how you'd like to own the solution",
    icon: Home,
    options: [
      {
        value: "buy",
        label: "Buy the Source Code",
        description: "One-time purchase with full ownership",
      },
      {
        value: "rent",
        label: "Software as a Service",
        description: "Low monthly payments",
      },
    ],
  },
  {
    id: 2,
    title: "Hosting Preference",
    description: "Select your preferred hosting solution",
    icon: Server,
    options: [
      {
        value: "self-hosted",
        label: "Self-Hosted",
        description: "Complete control over your infrastructure",
      },
      {
        value: "managed-hosting",
        label: "Managed Hosting",
        description: "Let us handle the infrastructure for you",
      },
    ],
  },
  {
    id: 3,
    title: "Database",
    description: "Choose your preferred database",
    icon: Database,
    options: [
      {
        value: "multi-tenant",
        label: "Multi-Tenant",
        description: "Shared database with isolated data",
      },
      {
        value: "single-tenant",
        label: "Single-Tenant",
        description: "Dedicated database for your organization",
      },
    ],
  },
  {
    id: 4,
    title: "Support Level",
    description: "Select your desired level of support",
    icon: Headphones,
    options: [
      {
        value: "limited",
        label: "Limited Support",
        description: "Least expensive. Basic onboarding and email support",
      },
      {
        value: "dedicated",
        label: "Dedicated Support",
        description:
          "Recommended. Priority support with dedicated account manager",
      },
      {
        value: "priority",
        label: "Feature Prioritization",
        description:
          "Enterprise. Influence product roadmap with priority feature requests",
      },
    ],
  },
  {
    id: 5,
    title: "Custom Development",
    description: "Select which features you need custom development for",
    icon: Code,
    options: [
      {
        value: "none",
        label: "None Required",
        description: "You can handle everything yourself",
      },
      {
        value: "portal",
        label: "Customer Portal/Website",
        description:
          "Create a branded ordering experience that drives production",
      },
      {
        value: "shop-floor",
        label: "Shop Floor Apps",
        description:
          "Connect your robots and machines to your production systems",
      },
      {
        value: "integrations",
        label: "Integrations",
        description: "Custom integrations with your existing systems",
      },
    ],
  },
];

export type Step = {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  options: Array<{
    value: string;
    label: string;
    description: string;
  }>;
};

export type ContactInfo = {
  name: string;
  email: string;
  company: string;
};

export type FormAnswers = {
  ownership: string;
  hosting: string;
  tenancy: string;
  support: string;
  customDev: string;
  contactInfo: ContactInfo;
};

type WizardFormProps = {
  open: boolean;
  onClose: () => void;
};

export default function WizardForm({ open, onClose }: WizardFormProps) {
  const fetcher = useFetcher();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<FormAnswers>({
    ownership: "",
    hosting: "",
    tenancy: "",
    support: "",
    customDev: "",
    contactInfo: {
      name: "",
      email: "",
      company: "",
    },
  });

  useEffect(() => {
    if (fetcher.state === "submitting") {
      setIsSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [fetcher.state]);

  const handleSelect = (value: string) => {
    const currentQuestion = getCurrentQuestion(currentStep, answers);
    const newAnswers = { ...answers, [currentQuestion]: value };

    if (currentQuestion === "ownership" && value === "rent") {
      newAnswers.hosting = "managed-hosting";
    }

    setAnswers(newAnswers);

    const totalSteps = getTotalSteps(newAnswers);
    if (currentStep < totalSteps - 1) {
      setCurrentStep(getNextStep(currentStep, newAnswers));
    }
  };

  const handleContactChange = (field: keyof ContactInfo, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      if (answers.hosting === "self-hosted" && prevStep === 2) {
        setCurrentStep(1);
      } else {
        setCurrentStep(prevStep);
      }
    }
  };

  const isContactStep =
    getCurrentQuestion(currentStep, answers) === "contactInfo";
  const stepDataIndex = getStepDataIndex(currentStep, answers);
  const currentStepData = !isContactStep ? steps[stepDataIndex] : null;

  const isComplete = () => {
    if (isContactStep) {
      const { name, email, company } = answers.contactInfo;
      return name.trim() && email.trim() && company.trim();
    }
    return true;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent size="medium">
        <fetcher.Form method="post" action="/api/try">
          {!isSubmitted ? (
            <>
              {isContactStep ? (
                <>
                  <DialogHeader className="px-0">
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      <Users className="w-6 h-6" />
                      Contact Information
                    </DialogTitle>
                    <DialogDescription>
                      Please provide your contact details to complete the
                      process
                    </DialogDescription>
                  </DialogHeader>
                  <ContactForm
                    values={answers.contactInfo}
                    onChange={handleContactChange}
                  />
                </>
              ) : (
                <StepContent
                  stepData={currentStepData!}
                  currentAnswer={
                    answers[getCurrentQuestion(currentStep, answers)] as string
                  }
                  onSelect={handleSelect}
                />
              )}
              <ProgressBar
                currentStep={currentStep}
                totalSteps={getTotalSteps(answers)}
              />
              <DialogFooter className="px-0 pt-8">
                {currentStep > 0 && (
                  <Button
                    onClick={handleBack}
                    variant="ghost"
                    className="flex items-center"
                    type="button"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                )}
                {currentStep === getTotalSteps(answers) - 1 && (
                  <>
                    <input
                      type="hidden"
                      name="answers"
                      value={JSON.stringify(answers)}
                    />
                    <Button
                      type="submit"
                      className="ml-auto flex items-center"
                      disabled={!isComplete() || fetcher.state !== "idle"}
                    >
                      Complete
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </DialogFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
              <div className="animate-bounce">
                <Check className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold animate-fade-in">
                Thank you for your interest!
              </h2>
              <p className="text-center text-muted-foreground animate-fade-in-delayed">
                We'll be in touch with you shortly to get you started.
              </p>
            </div>
          )}
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}

type ContactFormProps = {
  values: ContactInfo;
  onChange: (field: keyof ContactInfo, value: string) => void;
};

function ContactForm({ values, onChange }: ContactFormProps) {
  return (
    <CardContent className="px-0 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          name="name"
          value={values.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="John Doe"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={(e) => onChange("email", e.target.value)}
          placeholder="john@company.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company Name</Label>
        <Input
          id="company"
          name="company"
          value={values.company}
          onChange={(e) => onChange("company", e.target.value)}
          placeholder="Acme Inc"
        />
      </div>
    </CardContent>
  );
}

type ProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / (totalSteps - 1)) * 100;

  return <Progress value={progress} className="mb-8" />;
}

type StepContentProps = {
  stepData: Step;
  currentAnswer: string;
  onSelect: (value: string) => void;
};

function StepContent({ stepData, currentAnswer, onSelect }: StepContentProps) {
  return (
    <>
      <CardHeader className="px-0">
        <CardTitle className="text-2xl flex items-center gap-2">
          <stepData.icon className="w-6 h-6" />
          {stepData.title}
        </CardTitle>
        <CardDescription>{stepData.description}</CardDescription>
      </CardHeader>

      <CardContent className="px-0 space-y-4">
        {stepData.options.map((option) => (
          <Button
            key={option.value}
            onClick={() => onSelect(option.value)}
            variant="outline"
            type="button"
            className={cn(
              "w-full p-4 h-auto flex justify-between items-center text-wrap",
              currentAnswer === option.value &&
                "border-primary ring-1 ring-primary"
            )}
          >
            <div className="text-left">
              <h3 className="font-semibold text-foreground">{option.label}</h3>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
            {currentAnswer === option.value && (
              <div className="text-primary">
                <Check className="w-5 h-5" />
              </div>
            )}
          </Button>
        ))}
      </CardContent>
    </>
  );
}

type QuestionType =
  | "ownership"
  | "hosting"
  | "tenancy"
  | "support"
  | "customDev"
  | "contactInfo";

function getCurrentQuestion(
  currentStep: number,
  answers: FormAnswers
): QuestionType {
  // For rent path
  if (answers.ownership === "rent") {
    switch (currentStep) {
      case 0:
        return "ownership";
      case 1:
        return "tenancy";
      case 2:
        return "support";
      case 3:
        return "customDev";
      case 4:
        return "contactInfo";
      default:
        return "ownership";
    }
  }

  // For buy path with self-hosted
  if (answers.hosting === "self-hosted") {
    switch (currentStep) {
      case 0:
        return "ownership";
      case 1:
        return "hosting";
      case 2:
        return "support";
      case 3:
        return "customDev";
      case 4:
        return "contactInfo";
      default:
        return "ownership";
    }
  }

  // For buy path with managed hosting
  switch (currentStep) {
    case 0:
      return "ownership";
    case 1:
      return "hosting";
    case 2:
      return "tenancy";
    case 3:
      return "support";
    case 4:
      return "customDev";
    case 5:
      return "contactInfo";
    default:
      return "ownership";
  }
}

function getNextStep(currentStep: number, answers: FormAnswers): number {
  if (currentStep === 0 && answers.ownership === "rent") {
    return 1;
  }

  if (currentStep === 1 && answers.hosting === "self-hosted") {
    return 3;
  }

  return currentStep + 1;
}

function getTotalSteps(answers: FormAnswers): number {
  if (answers.ownership === "rent") return 5;
  if (answers.hosting === "self-hosted") return 5;
  return 6;
}

function getStepDataIndex(currentStep: number, answers: FormAnswers): number {
  if (answers.ownership === "rent") {
    return currentStep === 0 ? 0 : currentStep + 1;
  }

  if (answers.hosting === "self-hosted" && currentStep > 1) {
    return currentStep + 1;
  }

  return currentStep;
}
