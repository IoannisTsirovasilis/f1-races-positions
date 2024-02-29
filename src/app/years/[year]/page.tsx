'use client';

import Loader from '@/components/Loader';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface F1Session {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  session_key: number;
  session_name: string;
  session_type: string;
  year: number;
}

export default function YearPage() {
  const params = useParams<{ year: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [f1Sessions, setF1Sessions] = useState<F1Session[]>([]);

  useEffect(() => {
    fetch(
      `${process.env.OPEN_F1_URL}/sessions?year=${params.year}&session_type=Race&session_name=Race`,
    )
      .then(async (res) => {
        const result = await res.json();

        setF1Sessions(result);
        setIsLoading(false);
      })
      .catch(console.log);
  }, [params.year]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {isLoading && <Loader />}
      <ul className="w-full lg:w-5/12">
        {f1Sessions.map((session) => (
          <li
            key={session.session_key}
            className="flex gap-2 items-center my-2 border-b-2 border-solid border-gray-500 p-2 w-full hover:bg-gray-700 cursor-pointer"
          >
            <Link
              className="w-full p-2"
              href={`/years/${params.year}/sessions/${session.session_key}`}
            >
              {session.location}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
