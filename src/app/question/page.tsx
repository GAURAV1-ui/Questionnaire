"use client";
import { useState } from "react";

interface Question {
  question: string;
  category: string;
  options: { text: string; value: number }[];
}

const questions: Question[] = [
  {
    question: "How clear are you on the purpose of building your personal brand?",
    category: "Goals",
    options: [
      { text: "Not clear, I haven’t thought much about it.", value: 1 },
      { text: "I have some ideas but lack focus.", value: 2 },
      { text: "I’m clear about my goals and direction.", value: 5 },
    ],
  },
  {
    question: "How well do you think your personal brand stands out from others in your industry?",
    category: "Positioning",
    options: [
      { text: "I blend in with my peers, not much stands out.", value: 1 },
      { text: "I have some unique qualities, but they’re not well-defined.", value: 2 },
      { text: "My brand has strong, clear differentiation in the industry.", value: 5 },
    ],
  },
  {
    question: "How active are you in maintaining your online presence (e.g., LinkedIn, social media, blogs)?",
    category: "Presence",
    options: [
      { text: "I rarely post or engage online.", value: 1 },
      { text: "I post occasionally but not consistently.", value: 2 },
      { text: "I consistently post and engage with my audience.", value: 5 },
    ],
  },
  {
    question: "How frequently do you create or share content (e.g., blogs, LinkedIn posts)?",
    category: "ContentCreation",
    options: [
      { text: "I rarely create content.", value: 1 },
      { text: "I create content occasionally but not regularly.", value: 2 },
      { text: "I consistently create and share valuable content.", value: 5 },
    ],
  },
  {
    question: "How effectively are you monetizing your personal brand or using it to generate opportunities (e.g., new roles, clients, partnerships)?",
    category: "ProfitPotential",
    options: [
      { text: "I haven’t monetized my brand yet.", value: 1 },
      { text: "I’ve had some opportunities, but they’re limited.", value: 2 },
      { text: "My brand regularly helps me generate revenue or new opportunities.", value: 5 },
    ],
  },
];

const Questionnaire = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<number[]>(Array(questions.length).fill(0));
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const weights: { [key in Question['category']]: number } = {
    Goals: 0.15,
    Positioning: 0.25,
    Presence: 0.20,
    ContentCreation: 0.15,
    ProfitPotential: 0.25,
  };

  const handleResponseChange = (value: number) => {
    const newResponses = [...responses];
    newResponses[currentQuestionIndex] = value;
    setResponses(newResponses);
    setIsOptionSelected(true);
  };

  const calculateScore = () => {
    const categoryScores = questions.reduce((acc: any, question, index) => {
      const category = question.category;
      const weight = weights[category];
      acc[category] = (acc[category] || 0) + responses[index] * weight;
      return acc;
    }, {});

    const maxWeightedScore = questions.reduce((acc, question) => {
      return acc + 5 * weights[question.category];
    }, 0);

    const totalWeightedScore = Object.values(categoryScores).reduce((acc: number, score) => acc + (score as number), 0);
    const finalScore = (totalWeightedScore / maxWeightedScore) * 10;

    setScore(finalScore);
    sessionStorage.setItem("personalBrandScore", JSON.stringify({ finalScore, categoryScores }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setIsOptionSelected(responses[currentQuestionIndex + 1] !== 0);
    } else {
      calculateScore();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setIsOptionSelected(responses[currentQuestionIndex - 1] !== 0); 
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const finalScore = JSON.parse(sessionStorage.getItem("personalBrandScore") || "{}").finalScore;
  const categoryScores = JSON.parse(sessionStorage.getItem("personalBrandScore") || "{}").categoryScores;

  return (
    <div className="max-w-4xl p-8 font-poppins">
      {(currentQuestionIndex > 0 && score == null) && (
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="border-none text-black mb-8"
        >
          ← BACK
        </button>
      )}

      {score === null ? (
        <>
          <div className="mb-4">
            <p className="text-3xl font-bold text-black mb-10">{currentQuestion.question.toUpperCase()}</p>
            {currentQuestion.options.map((option, j) => (
              <label key={j} className="flex items-center space-x-2 mt-6 text-black">
                <input
                  type="radio"
                  name={`question-${currentQuestionIndex}`}
                  value={option.value}
                  checked={responses[currentQuestionIndex] === option.value}
                  onChange={() => handleResponseChange(option.value)}
                  className="form-radio accent-violet-500"
                />
                <span>{option.text}</span>
              </label>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={handleNext}
              disabled={!isOptionSelected} 
              className={`px-8 py-2 text-white rounded-md ${
                isOptionSelected ? "bg-violet-500 hover:bg-violet-600" : "cursor-not-allowed"
              }`}
            >
              {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
            </button>
          </div>
        </>
      ) : (
        <div className="mt-4 text-black">
          <p className="text-3xl font-bold mb-4">Your Personal Brand Score: {`${Math.round(finalScore)}/10`}</p>
          {finalScore < 4 ? <p className="text-lg">You have a lot of room for improvement. Focus on building a strong personal brand to stand out in your industry.</p> : finalScore < 7 ? <p className="text-lg">You’re on the right track, but there’s still room for growth. Keep refining your personal brand to reach your goals.</p> : <p className="text-lg">You’re doing great! Your personal brand is strong and well-defined. Keep up the good work!</p>}

          {Object.entries(categoryScores).map(([category, score]) => (
            <div key={category} className="mt-4">
              <p className="text-xl font-semibold">{category} Score: {Math.round((score as number) / weights[category])}/5</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Questionnaire;
