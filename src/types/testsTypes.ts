export type Test = {
  title: string;
  questions: Question[];
};

export type ExistingTest = {
  id: number;
  title: string;
  created_at: string;
  questions: Question[];
};

export type Question = {
  key?: string;
  id?: number;
  title: string;
  question_type: 'single' | 'multiple' | 'number';
  answer: number | null;
  answers: Answer[];
};

export type Answer = {
  key?: string;
  id?: number;
  text: string;
  is_right: boolean;
};

type Meta = {
  total_pages: number;
  total_count: number;
};

export type TestsState = {
  tests: ExistingTest[];
  test: ExistingTest | null;
  meta: Meta | null;
  loading: boolean;
  error: string | null;
};

export type FetchTestsPayload = {
  tests: ExistingTest[];
  meta: Meta;
};

export type FetchTestsParams = {
  page: number;
  per: number;
  search: string;
  sort: string;
};

export type AddTest = {
  newTestTitle: string;
  questions: Question[];
};

export type EditTest = {
  testId: string;
  initialTestTitle: string;
  initialQuestions: Question[];
  newTestTitle: string;
  questions: Question[];
};
