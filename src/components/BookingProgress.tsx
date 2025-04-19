// components/BookingProgress.tsx
type Step = 'search' | 'details' | 'payment' | 'complete';

interface BookingProgressProps {
  currentStep: BookingStep;
  onStepClick: (step: BookingStep) => void;
  resultsUrl: string;
}

export default function BookingProgress({ currentStep, onStepClick }: BookingProgressProps) {
  const steps: { key: Step; label: string }[] = [
    { key: 'search', label: 'Search' },
    { key: 'details', label: 'Booking Details' },
    { key: 'payment', label: 'Payment' },
    { key: 'complete', label: 'Complete' }
  ];

  const getStepStatus = (step: BookingStep) => {
    const stepOrder = ['search', 'details', 'payment', 'complete'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const handleClick = (step: BookingStep) => {
    if (step === 'search' && resultsUrl) {
      onStepClick(step);
    } else if (getStepStatus(step) !== 'upcoming') {
      onStepClick(step);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <button
              onClick={() => handleClick(step.key)}
              disabled={getStepStatus(step.key) === 'upcoming'}
              className={`
                rounded-full w-8 h-8 flex items-center justify-center
                ${getStepStatus(step.key) === 'completed' 
                  ? 'bg-stone-500 text-white cursor-pointer' // Changed from green-500
                  : getStepStatus(step.key) === 'current'
                    ? 'bg-yellow-700 text-white' // Changed from blue-500
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'}
              `}
            >
              {getStepStatus(step.key) === 'completed' ? '✓' : index + 1}
            </button>

            <span className={`ml-2 ${getStepStatus(step.key) === 'upcoming' ? 'text-gray-400' : 'text-gray-900'}`}>
              {step.label}
            </span>
            {index < steps.length - 1 && (
              // <div className={`h-1 w-16 mx-2 ${getStepStatus(step.key) === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`} />
              <div className={`h-1 w-16 mx-2 ${
                getStepStatus(step.key) === 'completed' 
                  ? 'bg-yellow-700' // Changed from green-500
                  : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
