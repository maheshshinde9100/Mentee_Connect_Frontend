/**
 * Normalizes Spring Data Page or plain array API responses.
 */
export const normalizePageResponse = (data) => {
  if (!data) {
    return { content: [], totalPages: 0, totalElements: 0, number: 0, size: 20 };
  }
  if (Array.isArray(data)) {
    return {
      content: data,
      totalPages: 1,
      totalElements: data.length,
      number: 0,
      size: data.length,
    };
  }
  if (data.content && Array.isArray(data.content)) {
    return {
      content: data.content,
      totalPages: data.totalPages ?? 1,
      totalElements: data.totalElements ?? data.content.length,
      number: data.number ?? 0,
      size: data.size ?? data.content.length,
    };
  }
  return { content: [], totalPages: 0, totalElements: 0, number: 0, size: 20 };
};
