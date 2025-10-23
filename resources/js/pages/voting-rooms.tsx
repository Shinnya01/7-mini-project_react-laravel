import * as React from "react"
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Inertia } from '@inertiajs/inertia';
import { SearchIcon, Users } from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { ChevronDownIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner";

type VotingRoom = {
  id: number;
  title: string;
  description: string;
  participants: number;
};

export default function VotingRooms({rooms: initialRooms }: {rooms: VotingRoom[]}) {

  const [rooms, setRooms] = useState<VotingRoom[]>(initialRooms);
  const [range, setRange] = React.useState<DateRange | undefined>(undefined)
  const [fromTime, setFromTime] = React.useState("")
  const [toTime, setToTime] = React.useState("")

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState('public');

  const [creating, setCreating] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
  e.preventDefault();
  setCreating(true);

  const startDateTime = range?.from && fromTime
  ? `${range.from.toISOString().split('T')[0]} ${fromTime}`
  : null;

const endDateTime = range?.to && toTime
  ? `${range.to.toISOString().split('T')[0]} ${toTime}`
  : null;

  Inertia.post('/voting-rooms', {title, description, privacy, start_time: startDateTime,
  end_time: endDateTime}, { 
        onSuccess: (response: any) => {
          setRooms([...rooms, response.props]);
          setTitle("");
          setDescription("");
          setPrivacy("public");
          setRange(undefined);
          setFromTime("");
          setToTime("");
        },
        onFinish: () => {
            setCreating(false);
          }
      })
    }

  
  return (
    <AppLayout>
      <Head title="Voting Rooms" />
      <div className="p-6 space-y-4">
        <div className='flex justify-between'>
              <InputGroup className='max-w-sm'>
                <InputGroupInput/>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">3 results</InputGroupAddon>
            </InputGroup>
          <Dialog>
            
              <DialogTrigger asChild>
                <Button variant="outline">Create Voting</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Create Voting Room</DialogTitle>
                  <DialogDescription>
                    Fill in the details below to create a new voting room.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="School Positions"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      name="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Optional details about this voting room"
                    />

                  </div>
                  <div className="grid gap-3">
                    <div>
                      <Label>Privacy</Label>
                      <Select value={privacy} onValueChange={setPrivacy}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Privacy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <div>
                        <div className="flex flex-col gap-3">
                          <Label htmlFor="dates" className="px-1">
                            Date & Time Range
                          </Label>

                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                id="dates"
                                className="w-full justify-between font-normal"
                              >
                                {range?.from && range?.to
                                  ? `${range.from.toLocaleDateString()} ${fromTime || ""} - ${range.to.toLocaleDateString()} ${toTime || ""}`
                                  : "Select date & time"}
                                <ChevronDownIcon />
                              </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-auto overflow-hidden p-4" align="start">
                              <div className="flex flex-col gap-3">
                                <Calendar
                                  mode="range"
                                  selected={range}
                                  captionLayout="dropdown"
                                  onSelect={(range) => setRange(range)}
                                />

                                {range?.from && (
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex flex-col gap-1">
                                      <Label htmlFor="from-time">Start Time</Label>
                                      <Input
                                        id="from-time"
                                        type="time"
                                        value={fromTime}
                                        onChange={(e) => setFromTime(e.target.value)}
                                        className="w-36"
                                      />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                      <Label htmlFor="to-time">End Time</Label>
                                      <Input
                                        id="to-time"
                                        type="time"
                                        value={toTime}
                                        onChange={(e) => setToTime(e.target.value)}
                                        className="w-36"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" className='w-full' size="sm" disabled={creating}>
                    {creating ? <><Spinner/>Creating...</> : 'Create'}
                  </Button>
                </DialogFooter>
                </form>
              </DialogContent>
          
          </Dialog>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.length > 0 ? (
            rooms.map(room => (
              <Card
                key={room.id}
                className="cursor-pointer hover:shadow-lg transition"
                onClick={() => Inertia.get(`/voting-rooms/${room.id}`)}
              >
                <CardHeader>
                  <CardTitle>{room.title}</CardTitle>
                  <CardDescription className="line-clamp-1">{room.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{room.participants} participants</span>
                  </div>
                  <Button size="sm">Enter</Button>
                </CardContent>
              </Card>
            ))
          ) : (
              <p className='text-center text-gray-400 col-span-3'>No room yet.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
