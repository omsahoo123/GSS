'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Mock data for past consultations - in a real app, this would be fetched based on the ID.
const pastConsultations = [
  {
    id: 'consult-1',
    doctor: 'Dr. Anjali Sharma',
    department: 'Cardiology',
    date: '2024-06-15',
    type: 'Video',
    videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', // Placeholder health-related video
  },
  {
    id: 'consult-2',
    doctor: 'Dr. Priya Singh',
    department: 'General Medicine',
    date: '2024-04-22',
    type: 'In-Person',
    videoUrl: null,
  },
  {
    id: 'consult-3',
    doctor: 'Dr. Arun Verma',
    department: 'Dermatology',
    date: '2024-02-10',
    type: 'In-Person',
    videoUrl: null,
  },
];


export default function ReplayConsultationPage() {
  const searchParams = useSearchParams();
  const consultationId = searchParams.get('id');
  const consultation = pastConsultations.find(c => c.id === consultationId);

  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Link href="/dashboard/patient/records" passHref>
          <Button variant="outline" size="icon">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
            <h1 className="font-headline text-3xl font-bold">Consultation Replay</h1>
            <p className="text-muted-foreground">
                Watch the recording of your past video consultation.
            </p>
        </div>
      </div>

      {consultation ? (
        <Card>
          <CardHeader>
            <CardTitle>Replay: {consultation.doctor}</CardTitle>
            <CardDescription>Date: {consultation.date}</CardDescription>
          </CardHeader>
          <CardContent>
            {consultation.videoUrl ? (
                 <div className="aspect-video w-full rounded-lg bg-muted">
                    <video className="w-full rounded-lg" controls>
                        <source src={consultation.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                 </div>
            ) : (
                <div className="text-center text-muted-foreground py-10">
                    <p>No video recording is available for this consultation.</p>
                </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
            <CardHeader>
                <CardTitle>Consultation Not Found</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">The requested consultation could not be found.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
