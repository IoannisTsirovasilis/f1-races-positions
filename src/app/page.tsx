import Link from 'next/link';

export default function Home() {
  const years = [2023];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ul className="w-full lg:w-5/12">
        {years.map((y) => (
          <li
            key={y}
            className="flex gap-2 items-center my-2 border-b-2 border-solid border-gray-500 w-full hover:bg-gray-700 cursor-pointer"
          >
            <Link className="w-full p-2" href={`/years/${y}`}>
              {y}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
