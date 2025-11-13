import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Reports() {
  const mockReports = [
    {
      id: 'r1',
      patientName: 'Mary Thompson',
      type: 'Comprehensive',
      generatedAt: '2025-01-10',
      status: 'completed',
    },
    {
      id: 'r2',
      patientName: 'James Cooper',
      type: 'Cognitive Assessment',
      generatedAt: '2025-01-08',
      status: 'completed',
    },
    {
      id: 'r3',
      patientName: 'Robert Anderson',
      type: 'Imaging Analysis',
      generatedAt: '2025-01-05',
      status: 'completed',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground mt-1">Generate and manage patient reports</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Generate New Report
          </Button>
        </div>

        <div className="grid gap-4">
          {mockReports.map((report) => (
            <Card key={report.id} className="card-shadow card-shadow-hover">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{report.patientName}</CardTitle>
                      <CardDescription>
                        {report.type} Report • Generated {new Date(report.generatedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary">{report.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
