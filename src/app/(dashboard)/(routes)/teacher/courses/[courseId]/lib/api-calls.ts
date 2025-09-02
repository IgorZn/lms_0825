import axios from 'axios';

export const updateCourseTitle = async (courseId: string, title: string) => {
  const response = await axios.patch(`/api/courses/${courseId}`, { title });
  return response.data;
};

export const updateCourseDescription = async (courseId: string, description: string | null) => {
  const response = await axios.patch(`/api/courses/${courseId}`, { description });
  return response.data;
};

export const updateCourseImage = async (courseId: string, imageUrl: string | null) => {
  const response = await axios.patch(`/api/courses/${courseId}`, { imageUrl });
  return response.data;
};

export const updateCourseCategory = async (courseId: string, categoryId: string | null) => {
  const response = await axios.patch(`/api/courses/${courseId}`, { categoryId });
  return response.data;
};
