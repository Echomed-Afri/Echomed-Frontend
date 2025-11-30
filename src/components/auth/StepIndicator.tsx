import React from 'react';

type Props = {
  step: number;
  total?: number;
};

const StepIndicator: React.FC<Props> = ({ step, total = 4 }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: total }, (_, i) => i + 1).map((i) => (
        <React.Fragment key={i}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i === step
                ? 'bg-blue-600 text-white'
                : i < step
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {i}
          </div>
          {i < total && (
            <div className={`w-8 h-0.5 ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
