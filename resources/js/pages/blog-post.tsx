import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import * as React from "react"
import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
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
import { Inertia } from '@inertiajs/inertia';
import { Item } from '@radix-ui/react-dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from '@/components/ui/spinner';

type Post = {
  id: number;
  user_id?: number;
  title: string;
  description: string;
};

export default function BlogPost({posts: initialPosts }: {posts: Post[] }) {

    const { auth } = usePage().props as any;
    const currentUserId: number | undefined = auth?.user?.id;

    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [editingPost, setEditingPost] = useState<Post | null>(null);

    // loading states
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

      const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);
        Inertia.post('/blog-post', { title, description }, {
          onSuccess: (response: any) => {
            setPosts([...posts, response.props]);
            setTitle(''); setDescription('');
          },
          onFinish: () => {
            setCreating(false);
          }
        });
      };

        // UPDATE
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setUpdating(true);
        if (!editingPost) return;

        Inertia.put(`/blog-post/${editingPost.id}`, {
            title: editingPost.title,
            description: editingPost.description,
        }, {
        onSuccess: () => {
            setPosts(posts.map(i => i.id === editingPost.id ? editingPost : i));
            setEditingPost(null);
        },
        onFinish: () => {
            setUpdating(false);
        },
        onError:(err) => console.error(err),
        });
    };

    //delete
    const handleDelete = (id: number) => {
    if (!confirm('Are you sure?')) return;
    setDeletingId(id);
    Inertia.delete(`/blog-post/${id}`, {
    onSuccess: () => {
        setPosts(posts.filter(i => i.id !== id));
    },
    onFinish: () => {
          setDeletingId(null);
        }
    });
  };

    const [position, setPosition] = React.useState("bottom")
    return (
        <AppLayout>
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
                            <form onSubmit={handleCreate} className='space-y-4'>
                            <DialogHeader>
                                <DialogTitle className='text-center'>Create Post</DialogTitle>
                                <DialogDescription>
                                <div className='flex items-start gap-2'>
                                    <Avatar className='size-8'>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className='text-white'>{auth.user.name}</p>
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
                                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder='Title'/>
                                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What's on your mind?"/>
                            </div>
                            <DialogFooter>
                                <Button type="submit" className='w-full' size="sm" disabled={creating}>
                                  {creating ? <><Spinner/>Posting...</> : 'Post'}
                                </Button>
                            </DialogFooter>
                            </form>
                            </DialogContent>
                    </Dialog>
                </div>
                <Dialog open={!!editingPost} onOpenChange={open => { if(!open) setEditingPost(null); }}>
                <DialogContent className="sm:max-w-[425px]">
                {editingPost && (
                    <form onSubmit={handleUpdate} className='space-y-4'>
                    <DialogHeader><DialogTitle>Edit Post</DialogTitle></DialogHeader>
                    <div className="grid gap-3">
                        <Label>Title</Label>
                        <Input value={editingPost.title} onChange={e => setEditingPost({...editingPost, title: e.target.value})} />
                        <Label>Description</Label>
                        <Input value={editingPost.description} onChange={e => setEditingPost({...editingPost, description: e.target.value})} />
                        
                        {/* <select value={editingItem.status} onChange={e => setEditingItem({...editingItem, status: e.target.value as 'pending'| 'ongoing' | 'done'})}>
                        <option value="pending">Pending</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="done">Done</option>
                        </select> */}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button type="submit" disabled={updating}>
                          {updating ? <><Spinner/>Saving...</> : 'Save'}
                        </Button>
                    </DialogFooter>
                    </form>
                )}
                </DialogContent>
            </Dialog>
                <div className='flex flex-col space-y-4'>
                    {posts.map((post: any) => (
                    <Card className='w-full p-2' key={post.id}>
                        <div className='flex justify-between'>
                            <div className='flex gap-2 items-center'>
                                <Avatar className='size-8'>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className='text-white'>{post.user?.name}</p>
                                    <p className='text-xs text-gray-400'>
                                        {new Date(post.created_at).toLocaleString('en-US', {
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
                            {post.user_id === currentUserId ? (
                            <DropdownMenu >
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" aria-label="Open menu" size="icon-sm">
                                    <MoreHorizontalIcon />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40" align="end">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem onClick={() => setEditingPost(post)}>
                                        Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem variant='destructive' onClick={() => handleDelete(post.id)} disabled={deletingId === post.id}>
                                        {deletingId === post.id ? (<><Spinner/>Deleting...</>) : 'Delete'}
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            ) : (
                                null
                            )}
                            

                        </div>
                        <CardContent className='!px-2 -my-2 space-y-2'>
                            <p className='font-bold text-lg'>{post.title}</p>
                            <p>{post.description}</p>
                        </CardContent>
                        <Skeleton className="h-76 w-full rounded-xl" />

                        <Separator className='-my-5'/>
                        <ButtonGroup className='!m-0 !p-0 w-full grid grid-cols-2'>
                            
                            <Button variant="ghost" className='text-blue-800 hover:text-blue-800'><ThumbsUp className='text-blue-800 fill-blue-800 size-5'/> Like</Button>
                            <Button variant="ghost" ><MessageCircle/> Comment</Button>
                        </ButtonGroup>
                    </Card>
                    ))}
                    
                </div>
                
            </div>
        </AppLayout>
    );
}
