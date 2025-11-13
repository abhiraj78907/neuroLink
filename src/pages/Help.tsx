import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { MessageSquare, Send, HelpCircle, Book, Video } from 'lucide-react';

export default function Help() {
  const faqs = [
    {
      question: 'How do I add a new patient?',
      answer: 'Navigate to the Patients page and click the "Add Patient" button. Fill in the patient information form including demographics, medical history, and contact details.',
    },
    {
      question: 'What cognitive tests are supported?',
      answer: 'NEUROCARE supports MMSE, MoCA, CDR, and ADAS-Cog assessments. Each test provides AI-powered analysis and risk assessment.',
    },
    {
      question: 'How does the AI risk assessment work?',
      answer: 'Our AI analyzes multiple data points including cognitive test scores, speech patterns, and brain imaging results to calculate a comprehensive risk score using Google Gemini AI.',
    },
    {
      question: 'Can I export patient reports?',
      answer: 'Yes, you can generate and export comprehensive patient reports as PDF files from the Reports page or individual patient profiles.',
    },
    {
      question: 'How often should patients be assessed?',
      answer: 'Assessment frequency depends on risk level. Low risk patients: every 6 months, Medium risk: every 3 months, High/Critical risk: monthly or as recommended by the physician.',
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Help & Support</h1>
          <p className="text-muted-foreground mt-1">Get assistance and learn how to use NEUROCARE</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="card-shadow card-shadow-hover cursor-pointer">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Book className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>Browse user guides and tutorials</CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-shadow card-shadow-hover cursor-pointer">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Video className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle>Video Tutorials</CardTitle>
              <CardDescription>Watch step-by-step guides</CardDescription>
            </CardHeader>
          </Card>

          <Card className="card-shadow card-shadow-hover cursor-pointer">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
              </div>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Get help from our team</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="card-shadow">
          <CardHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <CardTitle>Frequently Asked Questions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>Send us a message and we'll get back to you soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="support-name">Name</Label>
                <Input id="support-name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Email</Label>
                <Input id="support-email" type="email" placeholder="your@email.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-subject">Subject</Label>
              <Input id="support-subject" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-message">Message</Label>
              <Textarea 
                id="support-message" 
                placeholder="Describe your issue or question..." 
                rows={6}
              />
            </div>
            <Button className="w-full sm:w-auto">
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
