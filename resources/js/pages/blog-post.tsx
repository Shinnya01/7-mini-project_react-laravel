import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import * as React from "react"
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { MessageCircle, MoreHorizontalIcon, ThumbsUp } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '@/components/ui/skeleton';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blog Post',
        href: '/blog-post',
    },
];

export default function BlogPost() {
    const [position, setPosition] = React.useState("bottom")
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full px-60 flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className='flex justify-center items-center'>
                    <Dialog >
                            <DialogTrigger asChild>
                                <Card className="w-full p-4">
                                        <div className='flex gap-2 items-center w-full'>
                                            <Avatar className='size-10'>
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback>CN</AvatarFallback>
                                            </Avatar>
                                            <Button type="button" variant="outline" className='flex-1 h-10 rounded-full'>What's on your mind?</Button>
                                        </div>
                                </Card>
                            </DialogTrigger>
                            <DialogContent className="w-lg">
                            <DialogHeader>
                                <DialogTitle className='text-center'>Create Post</DialogTitle>
                                <DialogDescription>
                                <div className='flex items-start gap-2'>
                                    <Avatar className='size-8'>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className='text-white'>Shinya01</p>
                                        <p className='text-xs'>
                                            {new Date().toLocaleString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: 'numeric',
                                                minute: '2-digit',
                                                hour12: true,
                                            })}
                                        </p>
                                    </div>
                                </div>
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <Textarea placeholder="What's on your mind?"/>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className='w-full' size="sm">Post</Button>
                            </DialogFooter>
                            </DialogContent>
                    </Dialog>
                </div>
                <div className='flex space-y-4'>
                    <Card className='w-full p-2'>
                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Avatar className='size-8'>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='text-white'>Shinnya01</p>
                                    <p className='text-xs text-gray-400'>
                                        {new Date().toLocaleString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true,
                                        })}
                                    </p>
                                </div>
                            </div>
                            <DropdownMenu >
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" aria-label="Open menu" size="icon-sm">
                                    <MoreHorizontalIcon />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40" align="end">
                                <DropdownMenuGroup>
                                    <DropdownMenuItem >
                                    Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant='destructive'>
                                    Delete
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>

                        </div>
                        <CardContent className='!px-2 -my-2 space-y-2'>
                            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti ad iure et inventore, nemo eos laborum iusto explicabo labore quam voluptate voluptatum ducimus, saepe debitis molestias voluptas, illo temporibus maiores!</p>
                        </CardContent>
                        <Skeleton className="h-76 w-full rounded-xl" />

                        <Separator className='-my-5'/>
                        <ButtonGroup className='!m-0 !p-0 w-full grid grid-cols-2'>
                            
                            <Button variant="ghost" ><ThumbsUp/> Like</Button>
                            <Button variant="ghost" ><MessageCircle/> Comment</Button>
                        </ButtonGroup>
                    </Card>
                </div>
                
            </div>
        </AppLayout>
    );
}
