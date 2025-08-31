import axios from 'axios';
import { toast } from 'sonner';

export const updateCourseTitle = async (courseId: string, title: string) => {
  const response = await axios.patch(`/api/courses/${courseId}`, { title });
  toast.success('Course title updated successfully');
  return response.data;
};
