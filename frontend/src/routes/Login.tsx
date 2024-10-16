import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "@/api";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

export function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useMutation({
    mutationFn: login,
    onError: () => {
      toast({
        title: "Failed to login.",
        variant: "destructive",
        description: "Invalid credentials provided.",
      });
    },
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
      navigate("/");
    },
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your username below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="username">username</Label>
            <Input
              id="username"
              type="username"
              placeholder="benjibuiltit"
              required
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              type="password"
              required
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            onClick={() => loginMutation.mutate({ username, password })}
          >
            Login
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
