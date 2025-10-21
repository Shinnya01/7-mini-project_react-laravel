import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontalIcon } from 'lucide-react';
type Note = {
  id: number;
  title: string;
  description: string;
  created_at: string;
};

export default function ShowNote() {
  const { note } = usePage().props as unknown as { note: Note };

  return (
    <AppLayout>
      <Head title={note.title} />
      <div className="flex justify-center p-4">
        <Card className="w-full max-w-4xl">
          <CardHeader className='flex items-center justify-between'>
            <CardTitle className="text-2xl">{note.title}</CardTitle>
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
                            <DropdownMenuItem variant='destructive' >
                            Delete
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
          <CardContent>
            <p className="text-gray-700">{note.description}</p>
            <p className="text-xs text-gray-400 mt-4">
              Created on: {new Date(note.created_at).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
