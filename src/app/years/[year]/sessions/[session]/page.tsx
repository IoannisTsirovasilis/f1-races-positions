'use client';

import Loader from '@/components/Loader';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface F1Position {
  date: string;
  driver_number: number;
  meeting_key: number;
  position: number;
  session_key: number;
}

type F1Driver = F1Position & {
  first_name: string;
  last_name: string;
  headshot_url: string;
  team_name: string;
};

export default function YearPage() {
  const params = useParams<{ session: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [f1Drivers, setF1Drivers] = useState<F1Driver[]>([]);

  const [page, setPage] = useState<number>(0);
  const driversPerPage = 5;

  async function fetchDriver(driverNumber: number) {
    const res = await fetch(
      `${process.env.OPEN_F1_URL}/drivers?driver_number=${driverNumber}`,
    );

    const driver = (await res.json())[0];

    return driver;
  }

  useEffect(() => {
    fetch(`${process.env.OPEN_F1_URL}/position?session_key=${params.session}`)
      .then(async (res) => {
        const result = await res.json();

        const positionsMap: { [key: string]: F1Position } = {};

        // get last positions for each driver
        result.forEach((position: F1Position) => {
          if (!positionsMap[position.driver_number]) {
            positionsMap[position.driver_number] = position;
          }

          if (
            new Date(position.date) >
            new Date(positionsMap[position.driver_number].date)
          ) {
            positionsMap[position.driver_number] = position;
          }
        });

        const positions = Object.values(positionsMap).sort(
          (a, b) => a.position - b.position,
        );

        const driversWithPositions: F1Driver[] = await Promise.all(
          positions.map(async (position: F1Position) => {
            const driver = await fetchDriver(position.driver_number);

            const f1Driver: F1Driver = {
              ...position,
              first_name: driver.first_name,
              last_name: driver.last_name,
              headshot_url: driver.headshot_url,
              team_name: driver.team_name,
            };

            return f1Driver;
          }),
        );

        setF1Drivers(driversWithPositions);
        setIsLoading(false);
      })
      .catch(console.log);
  }, [params.session]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      {isLoading && <Loader />}
      <ul className="w-full lg:w-5/12">
        {f1Drivers
          .slice(page * driversPerPage, (page + 1) * driversPerPage)
          .map((driver) => (
            <li
              key={driver.driver_number}
              className="flex gap-2 items-center my-2 border-b-2 border-solid border-gray-500 p-2 w-full hover:bg-gray-400"
            >
              {driver.position}.{' '}
              <Image
                width={50}
                height={50}
                src={driver.headshot_url}
                alt={driver.first_name + ' ' + driver.last_name}
              />{' '}
              {driver.first_name} {driver.last_name} [{driver.team_name}]
            </li>
          ))}
        {!isLoading && (
          <li className="flex justify-between">
            <span
              className="cursor-pointer hover:bg-gray-800 bg-gray-700 p-2"
              onClick={() => {
                if (page > 0) {
                  setPage(page - 1);
                }
              }}
            >
              Previous
            </span>
            <span
              className="cursor-pointer hover:bg-gray-800 bg-gray-700 p-2"
              onClick={() => {
                if (page < Math.ceil(f1Drivers.length / driversPerPage) - 1) {
                  setPage(page + 1);
                }
              }}
            >
              Next
            </span>
          </li>
        )}
      </ul>
    </main>
  );
}
