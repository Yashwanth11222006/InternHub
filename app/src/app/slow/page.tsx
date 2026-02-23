export default async function SlowPage() {
    // Simulate a slow data fetch
    await new Promise((resolve) => setTimeout(resolve, 5000));

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold">Slow Page Loaded!</h1>
            <p className="mt-4">You should have seen the loader for 5 seconds.</p>
        </div>
    );
}
