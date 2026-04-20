export type SuggestionStepData = {
  status: "loading" | "streaming" | "completed";
  changes?: string[];
};

export type ImprovementStepData = {
  status: "in-progess" | "completed";
  url: string;
};
