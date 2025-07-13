import { Link } from "wouter";
import Router from "./routes/Router";

function App() {
  return (
    <>
      <header className="flex justify-center">
        <nav className="flex m-2 justify-between w-[80%]">
          <h1 className="text-3xl font-bold">Flashcards</h1>
          <ul className="flex gap-4 m-2">
            <li>
              <Link href="/">Deck</Link>
            </li>
            <li>
              <Link href="/settings">Settings</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main className="min-h-screen h-[100%] bg-gray-100 flex flex-col items-center p-2 w-full max-w-full">
        <Router />
      </main>
    </>
  );
}

export default App;
