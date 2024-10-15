import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { createTodo, updateTodo } from "@/api";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function SetTodo({
  children,
  todo,
}: {
  children: React.ReactNode;
  todo:
    | {
        id: number;
        title: string;
        description: string;
        dueDate: Date | undefined;
      }
    | undefined;
}) {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<Date>();
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const { toast } = useToast();
  const [isOpen, setOpen] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  if (todo) {
    if (!date && todo.dueDate) setDate(todo.dueDate);
    if (!description) setDescription(todo.description);
    if (!title) setTitle(todo.title);
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setDate(date);
    setIsDatePickerOpen(false);
  };

  const clearInputs = () => {
    setDate(undefined);
    setDescription("");
    setTitle("");
  };

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setOpen(false);
      toast({
        title: "Todo created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create todo.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      setOpen(false);
      toast({
        title: "Todo updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update todo.",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setOpen(open);
        clearInputs();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{todo?.id ? "Edit Todo" : "New Todo"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              onInput={(e) => setTitle(e.currentTarget.value)}
              defaultValue={title}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              onInput={(e) => setDescription(e.currentTarget.value)}
              id="description"
              defaultValue={description}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="due-date" className="text-right">
              Due Date
            </Label>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => handleDateSelect(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (todo?.id) {
                updateMutation.mutate({
                  id: todo.id,
                  title,
                  description,
                  dueDate: date,
                });
              } else {
                createMutation.mutate({ title, description, dueDate: date });
              }
            }}
            type="submit"
          >
            {todo?.id ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
