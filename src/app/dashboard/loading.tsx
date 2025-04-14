import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
        {Array.from({ length: 3 }).map((_, i) => (
          <div className="flex-1" key={i}>
            <Skeleton className="h-[125px] w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Skeleton className="col-span-4 h-[350px]" />
        <Skeleton className="col-span-3 h-[350px]" />
      </div>
      <Skeleton className="h-[450px] w-full" />
    </div>
  );
}
