import AppLayout from '@/layouts/app-layout';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Ellipsis } from 'lucide-react';

type Candidate = {
  id: number;
  name: string;
  party: string;
  votes?: number; // added for result summary
};

type Position = {
  id: number;
  title: string;
  candidates: Candidate[];
};

type VotingRoom = {
  id: number;
  title: string;
  description: string;
  positions: Position[];
};

export default function ShowVotingRoom() {
  const { room } = usePage().props as unknown as { room: VotingRoom };

  const [selectedVotes, setSelectedVotes] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Position[]>([]);

  const handleVoteChange = (positionId: number, candidateId: number) => {
    setSelectedVotes(prev => ({ ...prev, [positionId]: candidateId }));
  };

  const handleSubmit = () => {
    const totalPositions = room.positions.length;
    const selectedCount = Object.keys(selectedVotes).length;

    if (selectedCount < totalPositions) {
      alert("Please vote for all positions before submitting.");
      return;
    }

    // simulate results (adds random vote counts)
    const simulatedResults = room.positions.map((pos) => {
      const totalVotes = Math.floor(Math.random() * 50) + 30; // random total votes per position
      const withVotes = pos.candidates.map((c) => ({
        ...c,
        votes: Math.floor(Math.random() * totalVotes / pos.candidates.length) + 5,
      }));

      // normalize so total adds up
      const total = withVotes.reduce((sum, c) => sum + (c.votes ?? 0), 0);
      return {
        ...pos,
        candidates: withVotes.map((c) => ({
          ...c,
          votes: Math.round((c.votes ?? 0) * (totalVotes / total)),
        })),
      };
    });

    setResults(simulatedResults);
    setSubmitted(true);
  };

  const handleDownloadReceipt = () => {
    let receiptText = `🗳️ ${room.title} - Voting Receipt\n\n`;
    receiptText += `Date: ${new Date().toLocaleString()}\n\n`;
    receiptText += `Your Votes:\n`;

    room.positions.forEach(pos => {
      const chosenId = selectedVotes[pos.id];
      const chosen = pos.candidates.find(c => c.id === chosenId);
      receiptText += `• ${pos.title}: ${chosen?.name ?? "No vote"} (${chosen?.party ?? ""})\n`;
    });

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VotingReceipt_${room.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <Head title={room.title} />
      <div className="flex justify-center p-6">
        <Card className="w-full max-w-3xl">
          <CardHeader className='grid grid-cols-[1fr_auto] items-start'>
            <div>
              <CardTitle className="text-2xl font-bold">{room.title}</CardTitle>
              <CardDescription className="">{room.description}</CardDescription>
            </div>
            <Ellipsis/>
          </CardHeader>
          <CardContent>
            {!submitted ? (
              <>
                {room.positions.map((position) => (
                  <div key={position.id} className="mb-8 border p-4 rounded-md">
                    <h2 className="text-lg font-semibold mb-3">{position.title}</h2>
                    <RadioGroup
                      value={selectedVotes[position.id]?.toString() || ""}
                      onValueChange={(value) =>
                        handleVoteChange(position.id, parseInt(value))
                      }
                      className="space-y-3"
                    >
                      {position.candidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-center space-x-3 border p-3 rounded-md hover:bg-gray-50/90 dark:hover:text-black"
                        >
                          <RadioGroupItem
                            value={candidate.id.toString()}
                            id={`candidate-${position.id}-${candidate.id}`}
                          />
                          <Label
                            htmlFor={`candidate-${position.id}-${candidate.id}`}
                            className="cursor-pointer flex-1"
                          >
                            <div className="flex justify-between">
                              <span>{candidate.name}</span>
                              <span className="text-muted-foreground text-sm">{candidate.party}</span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                <Button className="w-full mt-4" onClick={handleSubmit}>
                  Submit Ballot
                </Button>
              </>
            ) : (
              <div className="py-6">
                <h2 className="text-xl font-semibold text-green-600 mb-6 text-center">✅ Vote Submitted!</h2>
                <p className="text-gray-600 text-center mb-8">Here’s the current summary of votes per position:</p>

                {results.map((position) => {
                  const totalVotes = position.candidates.reduce((sum, c) => sum + (c.votes ?? 0), 0);

                  return (
                    <div key={position.id} className="mb-8 border p-4 rounded-md">
                      <h3 className="text-lg font-semibold mb-4">{position.title}</h3>
                      {position.candidates.map((candidate) => {
                        const percent = Math.round(((candidate.votes ?? 0) / totalVotes) * 100);
                        return (
                          <div key={candidate.id} className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>{candidate.name}</span>
                              <span>{candidate.votes} votes ({percent}%)</span>
                            </div>
                            <Progress value={percent} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                <div className="text-center mt-6 flex gap-2 justify-end">
                  <Button variant="outline" className='cursor-pointer' onClick={() => setSubmitted(false)}>Back to Ballot (Demo)</Button>
                  <Button variant="default" className='cursor-pointer' onClick={handleDownloadReceipt}>
                    Download Receipt
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
