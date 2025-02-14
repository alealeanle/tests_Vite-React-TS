export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error && typeof error === 'object' && 'response' in error) {
    const err = error as { response: { data?: { error?: string } } };
    return err.response.data?.error || 'Ошибка на сервере';
  }

  return 'Неизвестная ошибка';
};
