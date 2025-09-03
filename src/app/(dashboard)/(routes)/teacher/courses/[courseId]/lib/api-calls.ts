import axios from 'axios';

export const courseFormPATCH = async (courseId: string, values: Record<string, string | number>) => {
  const response = await axios.patch(`/api/courses/${courseId}`, values);
  return response.data;
};

export const courseAttachmentPOST = async (courseId: string, values: Record<string, string | number>) => {
  const response = await axios.post(`/api/courses/${courseId}/attachments`, values);
  return response.data;
};
