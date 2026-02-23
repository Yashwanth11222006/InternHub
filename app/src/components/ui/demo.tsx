import BoxLoader from "@/components/ui/box-loader";

export default function DemoOne() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-background p-8 rounded-xl border border-border">
            <h2 className="text-2xl font-bold mb-12 text-foreground">Box Loader Demo</h2>
            <div className="scale-150">
                <BoxLoader />
            </div>
            <p className="mt-12 text-muted-foreground animate-pulse">Loading amazing things...</p>
        </div>
    );
}
