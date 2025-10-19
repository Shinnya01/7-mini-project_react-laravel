import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Inertia } from '@inertiajs/inertia';
import { Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHeader, TableHead, TableRow, TableCaption
} from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon, SearchIcon } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type TodoItem = {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'ongoing' | 'done';
};


export default function ToDoList({ items: initialItems }: { items: TodoItem[] }) {

  const [search, setSearch] = useState('');
  const [items, setItems] = useState<TodoItem[]>(initialItems);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [editingItem, setEditingItem] = useState<TodoItem | null>(null);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase())
    );


  // CREATE
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    Inertia.post('/to-do-list', { title, description, status }, {
      onSuccess: (response: any) => {
        setItems([...items, response.props]);
        setTitle(''); setDescription(''); setStatus('pending');
      }
    });
  };

  // UPDATE
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    Inertia.put(`/to-do-list/${editingItem.id}`, {
        title: editingItem.title,
        description: editingItem.description,
        status: editingItem.status
    }, {
    onSuccess: () => {
        setItems(items.map(i => i.id === editingItem.id ? editingItem : i));
        setEditingItem(null);
    }
    });
  };

  // DELETE
  const handleDelete = (id: number) => {
    if (!confirm('Are you sure?')) return;
    Inertia.delete(`/to-do-list/${id}`, {
    onSuccess: () => {
        setItems(items.filter(i => i.id !== id));
    }
    });
  };

  return (
    <AppLayout>
      <Head title="To-Do List" />
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <div className='flex justify-between'>
            {/* CREATE MODAL */}
            <InputGroup className='max-w-sm'>
                <InputGroupInput 
                    placeholder="Search..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}/>
                <InputGroupAddon>
                <SearchIcon />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">{filteredItems.length} results</InputGroupAddon>
            </InputGroup>
            <Dialog>
                <DialogTrigger asChild>
                <Button variant="outline"><PlusIcon /> New List</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleCreate} className='space-y-4'>
                    <DialogHeader>
                        <DialogTitle>Add New To-Do</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-3">
                    <Label>Title</Label>
                    <Input value={title} onChange={e => setTitle(e.target.value)} placeholder='Title'/>
                    <Label>Description</Label>
                    <Input value={description} onChange={e => setDescription(e.target.value)} placeholder='Description'/>
                    <Label>Status</Label>
                    <Select value={status} onValueChange={(value: 'pending' | 'ongoing' | 'done' ) => setStatus(value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='pending'>Pending</SelectItem>
                                <SelectItem value='ongoing'>Ongoing</SelectItem>
                                <SelectItem value='done'>Done</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                    <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                    <Button type="submit">Save</Button>
                    </DialogFooter>
                </form>
                </DialogContent>
            </Dialog>
            </div>
            {/* EDIT MODAL */}
            <Dialog open={!!editingItem} onOpenChange={open => { if(!open) setEditingItem(null); }}>
                <DialogContent className="sm:max-w-[425px]">
                {editingItem && (
                    <form onSubmit={handleUpdate} className='space-y-4'>
                    <DialogHeader><DialogTitle>Edit To-Do</DialogTitle></DialogHeader>
                    <div className="grid gap-3">
                        <Label>Title</Label>
                        <Input value={editingItem.title} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                        <Label>Description</Label>
                        <Input value={editingItem.description} onChange={e => setEditingItem({...editingItem, description: e.target.value})} />
                        <Label>Status</Label>
                        <Select value={editingItem.status} onValueChange={(value: 'pending' | 'ongoing' | 'done') => setEditingItem({...editingItem, status: value})}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='pending'>Pending</SelectItem>
                                <SelectItem value='ongoing'>Ongoing</SelectItem>
                                <SelectItem value='done'>Done</SelectItem>
                            </SelectContent>
                        </Select>
                        {/* <select value={editingItem.status} onChange={e => setEditingItem({...editingItem, status: e.target.value as 'pending'| 'ongoing' | 'done'})}>
                        <option value="pending">Pending</option>
                        <option value="ongoing">Ongoing</option>
                        <option value="done">Done</option>
                        </select> */}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                    </form>
                )}
                </DialogContent>
            </Dialog>

            {/* TABLE */}
            <Table>
                <TableCaption>All To-Do Items</TableCaption>
                <TableHeader>
                <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {filteredItems.map((item, index) => (
                    <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell> 
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>
                            {item.status === 'pending' ? (
                                <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded">Pending</span>
                            ) : item.status === 'ongoing' ? (
                                <span className="px-2 py-1 bg-blue-800 text-white rounded">Ongoing</span>
                            ) : (
                                <span className="px-2 py-1 bg-green-800 text-white rounded">Done</span>
                            )}
                        </TableCell>

                        <TableCell className='space-x-2 text-right'>
                            <Button variant="secondary" onClick={() => setEditingItem(item)}>Edit</Button>
                            <Button variant="destructive" onClick={() => handleDelete(item.id)}>Delete</Button>

                            {item.status == 'pending' ? (
                                <Button variant="secondary" className='bg-blue-800 text-white'
                                onClick={() => {
                                    Inertia.put(`/to-do-list/${item.id}`, { ...item, status: 'ongoing' }, {
                                    onSuccess: () => setItems(items.map(i => i.id === item.id ? { ...i, status: 'ongoing' } : i))
                                    });
                                }}
                                >Mark as Ongoing</Button>
                            ) : item.status === 'ongoing' ? (
                                <Button variant="secondary" className='bg-green-800 text-white'
                                onClick={() => {
                                    Inertia.put(`/to-do-list/${item.id}`, { ...item, status: 'done' }, {
                                    onSuccess: () => setItems(items.map(i => i.id === item.id ? { ...i, status: 'done' } : i))
                                    });
                                }}
                                >Mark as Done</Button>
                            ) : (
                                null
                            )}
                        </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
      </div>
    </AppLayout>
  );
}
