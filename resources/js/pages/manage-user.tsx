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

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  email_verified_at: string | null;
  created_at: string;
};

export default function ManageUsers({ users: initialUsers }: { users: User[] }) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // CREATE
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    Inertia.post('/manage-user', { name, email, password, role }, {
      onSuccess: (page: any) => {
        const newUser = page.props.flash?.user || { name, email, role };
        setUsers([...users, newUser]);
        setName(''); setEmail(''); setPassword(''); setRole('user');
      }
    });
  };

  // UPDATE
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    Inertia.put(`/manage-user/${editingUser.id}`, {
      name: editingUser.name,
      email: editingUser.email,
      role: editingUser.role
    }, {
      onSuccess: () => {
        setUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
        setEditingUser(null);
      }
    });
  };

  // DELETE
  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    Inertia.delete(`/users/${id}`, {
      onSuccess: () => setUsers(users.filter(u => u.id !== id))
    });
  };

  return (
    <AppLayout>
      <Head title="Manage Users" />
      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
        <div className='flex justify-between'>
          {/* SEARCH BAR */}
          <InputGroup className='max-w-sm'>
            <InputGroupInput 
              placeholder="Search..." 
              value={search}
              onChange={e => setSearch(e.target.value)} />
            <InputGroupAddon><SearchIcon /></InputGroupAddon>
            <InputGroupAddon align="inline-end">{filteredUsers.length} results</InputGroupAddon>
          </InputGroup>

          {/* CREATE MODAL */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><PlusIcon /> New User</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form onSubmit={handleCreate} className='space-y-4'>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3">
                  <Label>Name</Label>
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder='Full Name' required />
                  <Label>Email</Label>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' required />
                  <Label>Password</Label>
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' required />
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
        <Dialog open={!!editingUser} onOpenChange={open => { if(!open) setEditingUser(null); }}>
          <DialogContent className="sm:max-w-[425px]">
            {editingUser && (
              <form onSubmit={handleUpdate} className='space-y-4'>
                <DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader>
                <div className="grid gap-3">
                  <Label>Name</Label>
                  <Input value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
                  <Label>Email</Label>
                  <Input value={editingUser.email} onChange={e => setEditingUser({...editingUser, email: e.target.value})} />
                  <Label>Role</Label>
                  <Input value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value})} />
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
          <TableCaption>All Registered Users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className='space-x-2 text-right'>
                  <Button variant="secondary" onClick={() => setEditingUser(user)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(user.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
