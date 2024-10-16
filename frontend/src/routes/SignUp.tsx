import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { signup, login } from "@/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignUp() {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      localStorage.setItem("token", res.data.token);
      navigate("/");
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast({
        title: "User created.",
        description: "Logging you in now...",
      });
      loginMutation.mutate({ username, password });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to register user.",
      });
    },
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your username below to create your account
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
            onClick={() => signUpMutation.mutate({ username, password })}
          >
            Register
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
