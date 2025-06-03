'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import CreateSegmentDialog from '@/components/CreateSegmentDialog';
import UpdateSegmentDialog from '@/components/UpdateSegmentDialog';

type SegmentRule = {
  field: string;
  operator: string;
  value: any;
}[];

interface Segment {
  _id: string;
  name: string;
  isActive: boolean;
  createdBy: string | null;
  segmentRule: SegmentRule;
  audienceSize: number;
  scheduledAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function SegmentsPage() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSegments = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/segments`);
      if (!res.ok) {
        throw new Error('Failed to fetch segments');
      }
      const json = await res.json();
      setSegments(json.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this segment?')) return;

    try {
      setDeletingId(id);
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/segments/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error('Failed to delete segment');
      }
      
      setSegments((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      alert('Failed to delete the segment.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 p-4">Error: {error}</p>;

  return (
    <div className="p-6 min-h-screen bg-[#2B2B36] rounded-2xl">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Segments</h1>
        <div className="flex gap-4">
        <Button
       onClick={()=>location.href='/ai/rulegenerate'}
      type="button"
      className="bg-[#A9DFD8] text-black hover:bg-[#61c9bb] transition-colors duration-200"
    >
      Rule Generator 
    </Button>
        <CreateSegmentDialog onSegmentCreated={fetchSegments} />
        </div>
      </div>

      {segments.length === 0 ? (
        <p className="text-white text-center">No segments found.</p>
      ) : (
        <ScrollArea className="h-[80vh] pr-2">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {segments.map((segment) => (
              <div
                key={segment._id}
                className="bg-[#171821] border-none text-white shadow-sm rounded-2xl p-5 flex flex-col justify-between h-full"
              >
                <div>
                  <h2 className="text-lg font-semibold mb-2">{segment.name}</h2>

                  <p className="text-sm mb-1">
                    <span className="font-medium">Audience Size:</span>{' '}
                    {segment.audienceSize}
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Scheduled At:</span>{' '}
                    {segment.scheduledAt
                      ? new Date(segment.scheduledAt).toLocaleString()
                      : 'Not Scheduled'}
                  </p>
                  <p className="text-sm mb-3">
                    <span className="font-medium">Active:</span>{' '}
                    <Badge variant={segment.isActive ? 'default' : 'destructive'}>
                      {segment.isActive ? 'Yes' : 'No'}
                    </Badge>
                  </p>

                  <div className="text-sm mb-2">
                    <p className="font-medium">Rules:</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {segment.segmentRule.map((rule, idx) => (
                        <li key={idx}>
                          <span className="capitalize font-medium">
                            {rule.field}:
                          </span>{' '}
                          {rule.operator} {String(rule.value)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <UpdateSegmentDialog 
                    segment={segment} 
                    onSegmentUpdated={fetchSegments} 
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-[#FCB859] text-black hover:bg-red-600 border-none"
                    onClick={() => handleDelete(segment._id)}
                    disabled={deletingId === segment._id}
                  >
                    {deletingId === segment._id ? 'Deleting...' : 'Delete'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}