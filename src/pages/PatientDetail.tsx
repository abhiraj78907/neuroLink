import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/DashboardLayout';
import { mockPatients, mockCognitiveTests, mockSpeechAnalyses, mockImagingResults, mockTimelineEvents } from '@/lib/mockData';
import { RiskGauge } from '@/components/RiskGauge';
import { AIAnalysisPanel } from '@/components/AIAnalysisPanel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Edit, 
  FileText, 
  Brain, 
  Mic, 
  Image as ImageIcon, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Upload,
  Play,
  Sparkles
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const patient = mockPatients.find(p => p.id === id);

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <p>Patient not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const cognitiveTests = mockCognitiveTests.filter(t => t.patientId === id);
  const speechAnalyses = mockSpeechAnalyses.filter(s => s.patientId === id);
  const imagingResults = mockImagingResults.filter(i => i.patientId === id);
  const timelineEvents = mockTimelineEvents.filter(e => e.patientId === id);

  const testHistoryData = cognitiveTests.map(test => ({
    date: new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    score: test.score,
    percentile: test.percentile,
  }));

  const speechMetricsData = speechAnalyses.length > 0 ? [
    { metric: 'Clarity', value: speechAnalyses[0].metrics.clarity },
    { metric: 'Vocabulary', value: speechAnalyses[0].metrics.vocabularyRichness },
    { metric: 'Fluency', value: 100 - speechAnalyses[0].metrics.pauseFrequency * 10 },
  ] : [];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/patients')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{patient.name}</h1>
            <p className="text-muted-foreground">Patient ID: {patient.id.toUpperCase()}</p>
          </div>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center pb-4">
              <RiskGauge score={patient.riskScore} size="md" />
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Personal Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Age:</span>
                <span className="ml-2 font-medium">{patient.age} years</span>
              </div>
              <div>
                <span className="text-muted-foreground">Gender:</span>
                <span className="ml-2 font-medium capitalize">{patient.gender}</span>
              </div>
              <div>
                <span className="text-muted-foreground">DOB:</span>
                <span className="ml-2 font-medium">{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {patient.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">{patient.phone}</span>
                </div>
              )}
              {patient.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs">{patient.email}</span>
                </div>
              )}
              {patient.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                  <span className="text-xs">{patient.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="card-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Last Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(patient.lastAssessment).toLocaleDateString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.ceil((new Date().getTime() - new Date(patient.lastAssessment).getTime()) / (1000 * 60 * 60 * 24))} days ago
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Medical History */}
        {patient.medicalHistory.length > 0 && (
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {patient.medicalHistory.map((condition, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {condition}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Analysis Panel */}
        <AIAnalysisPanel patientId={patient.id} patientContext={patient} />

        {/* Detailed Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="cognitive">Cognitive Tests</TabsTrigger>
            <TabsTrigger value="speech">Speech Analysis</TabsTrigger>
            <TabsTrigger value="imaging">Imaging</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Cognitive Test History</CardTitle>
                  <CardDescription>Score trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  {testHistoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={testHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Line type="monotone" dataKey="score" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No test data available</p>
                  )}
                </CardContent>
              </Card>

              <Card className="card-shadow">
                <CardHeader>
                  <CardTitle>Speech Metrics</CardTitle>
                  <CardDescription>Latest speech analysis results</CardDescription>
                </CardHeader>
                <CardContent>
                  {speechMetricsData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={speechMetricsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No speech data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="cognitive" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Cognitive Assessments</h2>
              <Button>
                <Brain className="mr-2 h-4 w-4" />
                Add New Test
              </Button>
            </div>

            {cognitiveTests.map((test) => (
              <Card key={test.id} className="card-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{test.type} Assessment</CardTitle>
                      <CardDescription>{new Date(test.date).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge variant={test.percentile < 50 ? 'destructive' : 'secondary'}>
                      {test.score}/{test.maxScore}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium mb-2">Score Details</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Raw Score:</span>
                          <span className="font-medium">{test.score}/{test.maxScore}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Percentile:</span>
                          <span className="font-medium">{test.percentile}%</span>
                        </div>
                      </div>
                    </div>
                    {test.aiAnalysis && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          <p className="text-sm font-medium">AI Analysis</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{test.aiAnalysis}</p>
                      </div>
                    )}
                  </div>
                  {test.notes && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-sm font-medium mb-2">Clinical Notes</p>
                        <p className="text-sm text-muted-foreground">{test.notes}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}

            {cognitiveTests.length === 0 && (
              <Card className="card-shadow p-12 text-center">
                <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No cognitive test results available</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="speech" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Speech Analyses</h2>
              <Button>
                <Mic className="mr-2 h-4 w-4" />
                New Recording
              </Button>
            </div>

            {speechAnalyses.map((analysis) => (
              <Card key={analysis.id} className="card-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Speech Sample</CardTitle>
                      <CardDescription>
                        {new Date(analysis.date).toLocaleDateString()} • {Math.floor(analysis.duration / 60)}:{(analysis.duration % 60).toString().padStart(2, '0')}
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="icon">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Transcription</p>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      {analysis.transcription}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium mb-3">Speech Metrics</p>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Clarity</span>
                            <span className="font-medium">{analysis.metrics.clarity}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${analysis.metrics.clarity}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Vocabulary Richness</span>
                            <span className="font-medium">{analysis.metrics.vocabularyRichness}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${analysis.metrics.vocabularyRichness}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">AI Insights</p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{analysis.aiInsights}</p>
                      {analysis.riskIndicators.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {analysis.riskIndicators.map((indicator, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {speechAnalyses.length === 0 && (
              <Card className="card-shadow p-12 text-center">
                <Mic className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No speech analyses available</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="imaging" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Medical Imaging</h2>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Scan
              </Button>
            </div>

            {imagingResults.map((result) => (
              <Card key={result.id} className="card-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{result.type} Scan</CardTitle>
                      <CardDescription>{new Date(result.date).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge>{result.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium mb-2">Findings</p>
                      <ul className="space-y-1">
                        {result.findings.map((finding, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{finding}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium">AI Analysis</p>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Atrophy Level:</span>
                          <span className="font-medium">{result.aiAnalysis.atrophyLevel}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Hippocampal Volume:</span>
                          <span className="font-medium">{result.aiAnalysis.hippocampalVolume} mm³</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">White Matter:</span>
                          <span className="font-medium">{result.aiAnalysis.whiteMatters}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Overall Risk:</span>
                          <span className="font-medium">{result.aiAnalysis.overallRisk}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {imagingResults.length === 0 && (
              <Card className="card-shadow p-12 text-center">
                <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No imaging results available</p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <h2 className="text-xl font-semibold">Patient Timeline</h2>

            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
              <div className="space-y-6">
                {timelineEvents.map((event) => (
                  <div key={event.id} className="relative pl-12">
                    <div className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-card border-2 border-primary">
                      {event.type === 'test' && <Brain className="h-4 w-4 text-primary" />}
                      {event.type === 'imaging' && <ImageIcon className="h-4 w-4 text-primary" />}
                      {event.type === 'appointment' && <Calendar className="h-4 w-4 text-primary" />}
                      {event.type === 'note' && <FileText className="h-4 w-4 text-primary" />}
                    </div>
                    <Card className="card-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">{event.title}</CardTitle>
                          {event.severity && (
                            <Badge 
                              variant={
                                event.severity === 'critical' ? 'destructive' : 
                                event.severity === 'warning' ? 'default' : 
                                'secondary'
                              }
                            >
                              {event.severity}
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{new Date(event.date).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {timelineEvents.length === 0 && (
              <Card className="card-shadow p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No timeline events recorded</p>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
