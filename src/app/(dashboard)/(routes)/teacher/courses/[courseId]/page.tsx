import React from 'react';

function Page({ params }: { params: { courseId: string } }) {
  return <div>Course - {params.courseId}</div>;
}

export default Page;
