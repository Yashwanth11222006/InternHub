import DemoOne from "@/components/ui/demo";

export default function LoaderDemoPage() {
    return (
        <div className="container mx-auto py-20 px-4">
            <div className="max-w-3xl mx-auto space-y-12 text-center">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-4">Page-to-Page Loader</h1>
                    <p className="text-xl text-muted-foreground">
                        A premium 3D moving box loader integrated with Tailwind CSS 4 and Framer Motion.
                    </p>
                </div>

                <DemoOne />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left h-[400px]">
                    <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col items-center justify-center">
                        <h3 className="font-semibold text-lg mb-2">Usage</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {`import BoxLoader from "@/components/ui/box-loader"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <BoxLoader />
    </div>
  )
}`}
                        </p>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-border group">
                        <img
                            src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
                            alt="Technology"
                            className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
                            <p className="text-white font-medium text-lg">Integrated with modern tech stack</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
