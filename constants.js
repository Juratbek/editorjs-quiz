import { CheckboxIcon, QuizIcon, RadioInputIcon } from "./icons";

export const TYPES = {
  singleSelect: "singleSelect",
  multiSelect: "multiSelect",
};

export const settings = [
  {
    name: "Single Select",
    type: TYPES.singleSelect,
    icon: RadioInputIcon,
  },
  {
    name: "Multi Select",
    type: TYPES.multiSelect,
    icon: CheckboxIcon,
  },
];

export const Toolbox = {
  title: "Quiz",
  icon: QuizIcon,
};

export const LANGUAGES = ["uz", "en"];

export const TEXTS = {
  uz: {
    errors: {
      required: "Iltimos javobni tanlang",
    },
    footer: {
      submit: "Jo'natish",
    },
  },
  en: {
    errors: {
      required: "Please pick the answer",
    },
    footer: {
      submit: "Submit",
    },
  },
};
