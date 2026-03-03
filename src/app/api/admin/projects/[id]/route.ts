import { NextResponse } from 'next/server';

// In a production app, this would connect to a database
const projects = [
  {
    id: "1",
    title: "The Rise Room Initiative",
    description: "School-based safe spaces providing mental health support",
    pillarNumber: 1,
    status: "active"
  },
  {
    id: "2",
    title: "Academic Rescue Program",
    description: "Tutoring, scholarships, and STEM exposure",
    pillarNumber: 2,
    status: "active"
  }
];

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = projects.find(p => p.id === id);

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(project);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await request.json();

  const index = projects.findIndex(p => p.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  projects[index] = { ...projects[index], ...data };
  return NextResponse.json(projects[index]);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const index = projects.findIndex(p => p.id === id);

  if (index === -1) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  projects.splice(index, 1);
  return NextResponse.json({ success: true });
}
