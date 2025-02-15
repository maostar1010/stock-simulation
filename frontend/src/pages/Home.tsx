export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h1 className="text-4xl font-bold text-center">StockEd</h1>
      <p className="text-xl text-center max-w-2xl">
        Learn and practice stock trading in a fun, gamified environment. Start
        your journey to becoming a stock market pro!
      </p>
      <div className="card p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Get Started</h2>
        <p>
          Use the navigation menu on the left to start learning about stocks or
          jump right into the simulation!
        </p>
      </div>
    </div>
  );
}
