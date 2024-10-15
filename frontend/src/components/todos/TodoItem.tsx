import { Circle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { SetTodo } from "@/components/todos/SetTodo";
import { useToast } from "@/hooks/use-toast";
import { deleteTodo, updateTodo } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function TodoItem({
  id,
  status,
  title,
  description,
  dueDate,
}: {
  id: number;
  status: string;
  title: string;
  description: string;
  dueDate: string;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast({
        variant: "destructive",
        title: "Todo deleted.",
      });
    },
  });

  const setStatusMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update todo.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function toggleStatus() {
    switch (status) {
      case "complete":
        setStatusMutation.mutate({ id, status: "pending" });
        break;
      case "pending":
        setStatusMutation.mutate({ id, status: "complete" });
        break;
      default:
        console.error("Unrecognized status");
    }
  }

  function sameDay(d1: Date, d2: Date) {
    return (
      d1.getFullYear() <= d2.getFullYear() &&
      d1.getMonth() <= d2.getMonth() &&
      d1.getDate() <= d2.getDate()
    );
  }

  return (
    <div className="todo-row m-4 flex flex-initial">
      <button className="todo-action mr-4" onClick={toggleStatus}>
        <div className="text-gray-300">
          {status === "complete" ? <Circle fill="#111" /> : <Circle />}
        </div>
      </button>
      <div className="todo-content overflow-hidden">
        <h3 className="text-nowrap truncate text-ellipsis font-semibold">
          {title}
        </h3>
        <p className="text-muted-foreground text-ellipsis">{description}</p>
        <div className="flex text-muted-foreground text-sm">
          {dueDate && (
            <p
              className={
                sameDay(new Date(dueDate), new Date())
                  ? "text-destructive"
                  : "text-muted-foreground"
              }
            >
              {new Intl.DateTimeFormat().format(new Date(dueDate))}
            </p>
          )}
          {dueDate && <span className="mx-1">•</span>}
          <SetTodo
            todo={{
              id: id,
              title: title,
              description: description,
              dueDate: dueDate ? new Date(dueDate) : undefined,
            }}
          >
            <button>
              <p>Edit</p>
            </button>
          </SetTodo>
          <span className="mx-1">•</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button>
                <p>Delete</p>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  "{title}" task.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-red-600"
                  onClick={() => deleteMutation.mutate(id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
