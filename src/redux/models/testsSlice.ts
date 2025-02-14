import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TestsState,
  ExistingTest,
  Question,
  Answer,
  FetchTestsPayload,
  FetchTestsParams,
  AddTest,
  EditTest,
} from 'src/types/testsTypes';

const initialState: TestsState = {
  tests: [],
  test: null,
  meta: null,
  loading: false,
  error: null,
};

const testsSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {
    fetchTestsRequest: (state, action: PayloadAction<FetchTestsParams>) => {
      state.loading = true;
      state.error = null;
    },
    fetchTestsSuccess: (state, action: PayloadAction<FetchTestsPayload>) => {
      state.tests = action.payload.tests;
      state.meta = action.payload.meta;
      state.loading = false;
    },
    fetchTestsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addTestRequest: (state, action: PayloadAction<AddTest>) => {
      state.loading = true;
      state.error = null;
    },
    addTestSuccess: (state, action: PayloadAction<ExistingTest>) => {
      state.tests.push(action.payload);
      state.loading = false;
    },
    addTestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    getTestRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    getTestSuccess: (state, action: PayloadAction<ExistingTest>) => {
      state.test = action.payload;
      state.loading = false;
    },
    getTestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    editTestRequest: (state, action: PayloadAction<EditTest>) => {
      state.loading = true;
      state.error = null;
    },
    editTestSuccess: (state, action: PayloadAction<ExistingTest>) => {
      state.tests = state.tests.map(test =>
        test.id === action.payload.id ? { ...test, ...action.payload } : test,
      );
      state.test = null;
      state.loading = false;
    },
    editTestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTestRequest: (
      state,
      action: PayloadAction<{ testId: number } & { params: FetchTestsParams }>,
    ) => {
      state.loading = true;
      state.error = null;
    },
    deleteTestSuccess: (state, action: PayloadAction<number>) => {
      state.tests = state.tests.filter(test => test.id !== action.payload);
      state.loading = false;
    },
    deleteTestFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    addQuestionSuccess: (
      state,
      action: PayloadAction<Question & { testId: number }>,
    ) => {
      const test = state.tests.find(test => test.id === action.payload.testId);
      if (test) {
        test.questions = [...(test.questions || []), action.payload];
      }
    },
    editQuestionSuccess: (state, action: PayloadAction<Question>) => {
      const test = state.tests.find(test =>
        test.questions.some(q => q.id === action.payload.id),
      );
      if (test) {
        const questionIndex = test.questions.findIndex(
          q => q.id === action.payload.id,
        );
        if (questionIndex !== -1) {
          test.questions[questionIndex] = {
            ...test.questions[questionIndex],
            ...action.payload,
          };
        }
      }
    },
    deleteQuestionSuccess: (state, action: PayloadAction<number>) => {
      const test = state.tests.find(test =>
        test.questions.some(q => q.id === action.payload),
      );
      if (test) {
        test.questions = test.questions.filter(q => q.id !== action.payload);
      }
    },
    addAnswerSuccess: (
      state,
      action: PayloadAction<
        { addAnswerResponseData: Answer } & {
          createdQuestionId: number;
        }
      >,
    ) => {
      const test = state.tests.find(test =>
        test.questions?.some(q => q.id === action.payload.createdQuestionId),
      );
      if (test) {
        const question = test.questions.find(
          q => q.id === action.payload.createdQuestionId,
        );
        if (question) {
          question.answers = [
            ...(question.answers || []),
            action.payload.addAnswerResponseData,
          ];
        }
      }
    },
    editAnswerSuccess: (state, action: PayloadAction<Answer>) => {
      const test = state.tests.find(test =>
        test.questions.some(q =>
          q.answers.some(a => a.id === action.payload.id),
        ),
      );
      if (test) {
        const question = test.questions.find(q =>
          q.answers.some(a => a.id === action.payload.id),
        );
        if (question) {
          const answerIndex = question.answers.findIndex(
            a => a.id === action.payload.id,
          );
          if (answerIndex !== -1) {
            question.answers[answerIndex] = {
              ...question.answers[answerIndex],
              ...action.payload,
            };
          }
        }
      }
    },
    deleteAnswerSuccess: (state, action: PayloadAction<{ id: number }>) => {
      const test = state.tests.find(test =>
        test.questions.some(q =>
          q.answers.some(a => a.id === action.payload.id),
        ),
      );
      if (test) {
        const question = test.questions.find(q =>
          q.answers.some(a => a.id === action.payload.id),
        );
        if (question) {
          question.answers = question.answers.filter(
            a => a.id !== action.payload.id,
          );
        }
      }
    },
  },
});

export const {
  fetchTestsRequest,
  fetchTestsSuccess,
  fetchTestsFailure,
  addTestRequest,
  addTestSuccess,
  addTestFailure,
  getTestRequest,
  getTestSuccess,
  getTestFailure,
  editTestRequest,
  editTestSuccess,
  editTestFailure,
  deleteTestRequest,
  deleteTestSuccess,
  deleteTestFailure,
  addQuestionSuccess,
  editQuestionSuccess,
  deleteQuestionSuccess,
  addAnswerSuccess,
  editAnswerSuccess,
  deleteAnswerSuccess,
} = testsSlice.actions;

export default testsSlice.reducer;
