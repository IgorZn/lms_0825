import axios from 'axios';

export const courseFormPATCH = async (courseId: string, values: Record<string, string | number>) => {
  const response = await axios.patch(`/api/courses/${courseId}`, values);
  return response.data;
};
