import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useSWR from 'swr';
import Layout from '../../components/Layouts';
import { getAllTaskIds, getTaskData } from '../../lib/tasks';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Post({ staticTask, id }) {
  const router = useRouter();
  const { data: task, mutate } = useSWR(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/detail-task/${id}`,
    fetcher,
    {
      initialData: staticTask,
    }
  );
  useEffect(() => {
    mutate();
  }, []);
  if (router.isFallback || !task) {
    return <div>Loading...</div>;
  }
  return (
    <Layout title={task.title}>
      <span className="mb-4">
        {'ID : '}
        {task.id}
      </span>
      <p className="mb-4 text-xl font-bold">{task.title}</p>
      <p className="mb-12">{task.created_at}</p>
      <Link href="/task-page">
        <div className="flex cursor-pointer mt-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
          <span>Back to task-page</span>
        </div>
      </Link>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await getAllTaskIds();
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const staticTask = await getTaskData(params.id);
  return {
    props: {
      id: staticTask.id,
      staticTask,
    },
    revalidate: 3,
  };
}
