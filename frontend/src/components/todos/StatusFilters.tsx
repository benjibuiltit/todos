import React from "react";
import { Badge } from "../ui/badge";

export function StatusFilters({
  filter,
  setFilter,
}: {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div>
      <button onClick={() => setFilter("all")}>
        <Badge
          variant={filter === "all" ? "default" : "outline"}
          className={
            "mr-1 " + (filter === "all" ? "text-background" : "text-primary")
          }
        >
          All
        </Badge>
      </button>
      <button onClick={() => setFilter("complete")}>
        <Badge
          variant={filter === "complete" ? "default" : "outline"}
          className={
            "mr-1 " +
            (filter === "complete" ? "text-background" : "text-primary")
          }
        >
          Completed
        </Badge>
      </button>
      <button onClick={() => setFilter("pending")}>
        <Badge
          variant={filter === "pending" ? "default" : "outline"}
          className={
            "mr-1 " +
            (filter === "pending" ? "text-background" : "text-primary")
          }
        >
          Pending
        </Badge>
      </button>
    </div>
  );
}
