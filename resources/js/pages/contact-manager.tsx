import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Trash2, Plus, PlusIcon } from "lucide-react"
import { useState } from 'react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Inertia } from '@inertiajs/inertia';

type Contact = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export default function ContactManager({contacts: initialContacts}: {contacts: Contact[]}) {
    const [contacts, setContacts] = useState<Contact[]>(initialContacts);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [editingContact, setEditingContact] = useState<Contact | null>(null);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        Inertia.post('/contact-manager', { name, email , phone, address  }, {
          onSuccess: (response: any) => {
            setContacts([...contacts, response.props]);
            setName('');
            setEmail('');
            setPhone('');
            setAddress('');
          }
        });
      };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingContact) return;

        Inertia.put(`/contact-manager/${editingContact.id}`, {
            name: editingContact.name,
            email: editingContact.email,
            phone: editingContact.phone,
            address: editingContact.address,
        }, {
        onSuccess: () => {
            setContacts(contacts.map(i => i.id === editingContact.id ? editingContact : i));
            setEditingContact(null);
        }
        });
    };

    const handleDelete = (id: number) => {
    if (!confirm('Are you sure?')) return;
    Inertia.delete(`/contact-manager/${id}`, {
    onSuccess: () => {
        setContacts(contacts.filter(i => i.id !== id));
        }
        });
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Contacts</h1>
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
                                <Label>Name</Label>
                                <Input value={name} onChange={e => setName(e.target.value)} placeholder='Name'/>
                                <Label>Email</Label>
                                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder='Email'/>
                                <Label>Phone</Label>
                                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder='Phone'/>
                                <Label>Address</Label>
                                <Input value={address} onChange={e => setAddress(e.target.value)} placeholder='Address'/>
                          
                                </div>
                                <DialogFooter>
                                <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                                <Button type="submit">Save</Button>
                                </DialogFooter>
                            </form>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={!!editingContact} onOpenChange={open => { if(!open) setEditingContact(null); }}>
                            <DialogContent className="sm:max-w-[425px]">
                            {editingContact && (
                                <form onSubmit={handleUpdate} className='space-y-4'>
                                <DialogHeader><DialogTitle>Edit Contact</DialogTitle></DialogHeader>
                                <div className="grid gap-3">
                                    <Label>Name</Label>
                                    <Input value={editingContact.name} onChange={e => setEditingContact({...editingContact, name: e.target.value})} />
                                    <Label>Email</Label>
                                    <Input value={editingContact.email} onChange={e => setEditingContact({...editingContact, email: e.target.value})} />
                                    <Label>Phone</Label>
                                    <Input value={editingContact.phone} onChange={e => setEditingContact({...editingContact, phone: e.target.value})} />
                                    <Label>Address</Label>
                                    <Input value={editingContact.address} onChange={e => setEditingContact({...editingContact, address: e.target.value})} />
                        
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
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {contacts.map((contact) => (
                    <Card key={contact.id}>
                        <CardHeader>
                        <CardTitle>{contact.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                        <p className="text-sm text-gray-600">{contact.phone}</p>
                        <p className="text-sm text-gray-600">{contact.address}</p>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm" onClick={() => setEditingContact(contact)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(contact.id)}>
                            <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                        </CardContent>
                    </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
