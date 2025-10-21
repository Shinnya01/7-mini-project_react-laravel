import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { PlusIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from '@/components/ui/spinner';

type Note = {
  id: number;
  title: string;
  description: string;
  created_at: string;
};

export default function Notes({notes: initialNotes}: {notes: Note[]}) {

  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
          e.preventDefault();
          setCreating(true);
          Inertia.post('/note', { title, description }, {
            onSuccess: (response: any) => {
              setNotes([...notes, response.props]);
              setTitle(''); setDescription('');
            },
            onFinish: () => {
              setCreating(false);
            }
          });
        };

  return (
    <AppLayout>
      <Head title="Notes" />
      <div className="flex flex-col gap-4 p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Notes</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline"><PlusIcon /> New Note</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <form className='space-y-4' onSubmit={handleCreate}>
                <DialogHeader>
                  <DialogTitle>Add New Note</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3">
                  <Label>Title</Label>
                  <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
                  <Label>Description</Label>
                  <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
                </div>
                <DialogFooter>
                  <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                  <Button type="submit" size="sm" disabled={creating}>
                      {creating ? <><Spinner/>Creating...</> : 'Create'}
                    </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <Card
              key={note.id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => Inertia.get(`/note/${note.id}`)}
            >
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3">{note.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(note.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
