import { Link } from "react-router-dom";
import { Fragment } from "react";
import { CircleUser, ListTodo, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TodoItem } from "@/components/todos/TodoItem";
import { useQuery } from "@tanstack/react-query";
import { getTodos } from "@/api";
import { SetTodo } from "@/components/todos/SetTodo";
import { StatusFilters } from "@/components/todos/StatusFilters";
import { useState } from "react";

export default function Todos() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  const filteredTodos = todosQuery.data
    ?.filter((todo) => {
      return (
        (statusFilter !== "all" && todo.status === statusFilter) ||
        statusFilter === "all"
      );
    })
    .filter((todo) => {
      return (
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  const sortedTodos = filteredTodos?.sort((a, b) => {
    return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
  });

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <ListTodo className="h-6 w-6" />
            <span className="sr-only">Todos</span>
          </Link>
          <Link
            to="#"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Todos
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search todos..."
                className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 container mx-auto">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle className="mb">Todos</CardTitle>
              <StatusFilters
                filter={statusFilter}
                setFilter={setStatusFilter}
              />
            </div>
            <div className="ml-auto mr-1">
              <SetTodo todo={undefined}>
                <Button variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </SetTodo>
            </div>
          </CardHeader>
          <CardContent>
            {sortedTodos?.map((todo, i) => {
              const isLast = i === sortedTodos.length - 1;
              return (
                <Fragment key={todo.id}>
                  <TodoItem
                    id={todo.id}
                    status={todo.status}
                    title={todo.title}
                    description={todo.description}
                    dueDate={todo.dueDate}
                  />
                  {!isLast && <Separator />}
                </Fragment>
              );
            })}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
