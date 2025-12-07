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
				<div key={idx} className="flex flex-col h-full space-y-5">
					<div className="relative bg-[#ededed] overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.06)] aspect-[3/4]">
						<Skeleton className="h-full w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-3 w-28" />
						<Skeleton className="h-6 w-48" />
						<Skeleton className="h-3 w-40" />
						<div className="flex items-center gap-3 pt-2">
							<Skeleton className="h-5 w-20" />
							<Skeleton className="h-9 w-28" />
						</div>
					</div>
				</div>
			))}
		</div>
	);
}

