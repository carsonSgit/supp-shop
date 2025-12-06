import React from "react";
import { Skeleton } from "./ui/skeleton";
import { cn } from "../lib/utils";

interface ProductSkeletonGridProps {
	count?: number;
	className?: string;
}

/**
 * Simple grid of skeleton cards to mirror product tiles while data loads.
 */
export function ProductSkeletonGrid({ count = 6, className }: ProductSkeletonGridProps) {
	return (
		<div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16", className)}>
			{Array.from({ length: count }).map((_, idx) => (
				<div key={idx} className="flex flex-col h-full space-y-4">
					<Skeleton className="aspect-[4/5] w-full rounded-2xl" />
					<div className="space-y-3">
						<div className="flex items-center justify-between gap-4">
							<Skeleton className="h-6 w-32" />
							<Skeleton className="h-6 w-16" />
						</div>
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
						<div className="flex gap-3 pt-2">
							<Skeleton className="h-10 w-28" />
							<Skeleton className="h-10 w-24" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

