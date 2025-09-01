import axios from 'axios';
import { toast } from 'sonner';

export const updateCourseTitle = async (courseId: string, title: string) => {
  const response = await axios.patch(`/api/courses/${courseId}`, { title });
  return response.data;
};

export const updateCourseDescription = async (courseId: string, description: string) => {
  const response = await axios.patch(`/api/courses/${courseId}`, { description });
  return response.data;
};
