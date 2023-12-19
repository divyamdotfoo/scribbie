"use client";
import { nanoid } from "nanoid";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import { useUser } from "@/store";
import { getRandomColor } from "@/lib";
export default function EnterRoom() {
  const [name, setName] = useState("");
  const [id, setId] = useState(nanoid(8));
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("tab") || "create");
  const searchId = params.get("id") || "";
  const [userRoomId, setRoomId] = useState(searchId);
  const { toast } = useToast();
  const setUser = useUser((s) => s.setUser);
  const router = useRouter();

  const handler = (roomId: string, makeHost: boolean) => {
    if (!roomId || roomId.length !== 8) {
      toast({
        title: "Invalid roomId",
        variant: "destructive",
        description: "Please check your roomId and try again",
      });
      return;
    }
    if (!name) {
      toast({
        title: "Uhh! your name??",
        description: "Dont you have a name?",
        variant: "destructive",
      });
      return;
    }
    setUser({
      id: nanoid(8),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${nanoid(10)}`,
      name: name,
      score: 0,
      host: makeHost,
      color: getRandomColor(),
    });
    router.push(`/room/${roomId}`);
  };
  return (
    <Tabs
      defaultValue="create"
      className="w-[400px]"
      value={value}
      onValueChange={(value) => {
        setValue(value);
      }}
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="create">Create Room</TabsTrigger>
        <TabsTrigger value="join">Join</TabsTrigger>
      </TabsList>
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Create new room</CardTitle>
            <CardDescription>
              Create a room and invite your friends.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="roomId">Room id</Label>
              <Input id="roomId" value={id} disabled />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => handler(id, true)} className=" w-full">
              Start
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="join">
        <Card>
          <CardHeader>
            <CardTitle>Join Room</CardTitle>
            <CardDescription>
              Enter the details to join the room.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Name</Label>
              <Input
                id="current"
                type="text"
                placeholder="John lennon"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="roomId">Room id</Label>
              <Input
                id="roomId"
                type="text"
                value={userRoomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder={`eg: ${id}`}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => handler(userRoomId, false)}
              className=" w-full"
            >
              Join
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
