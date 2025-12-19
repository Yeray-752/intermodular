import { Link } from "react-router-dom";

function App() {
  return (
    <div>
      <main className="grid min-h-full place-items-center bg-base-200 px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-primary">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-base-content sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg font-medium text-base-content/70 sm:text-xl/8">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/">
              <div className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-content shadow hover:bg-primary-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                Go back home
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
