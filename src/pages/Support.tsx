
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, MessageSquare, Phone, Mail, FileText } from 'lucide-react';

const Support: React.FC = () => {
  return (
    <MainLayout>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="geo-card">
            <h2 className="text-xl font-mono mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-techguard-500" />
              Help Center
            </h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I control my smart lights?</AccordionTrigger>
                <AccordionContent>
                  Smart lights can be controlled from the Settings page under the Lighting tab. 
                  You can adjust brightness, color, and set automation schedules for your connected lights.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-2">
                <AccordionTrigger>My air conditioning isn't responding</AccordionTrigger>
                <AccordionContent>
                  First, check if the device is online in the Device page. If it shows as offline, 
                  verify your WiFi connection. You may need to restart the device or reconnect it 
                  to your network. If problems persist, contact technical support.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-3">
                <AccordionTrigger>How do I add a new device?</AccordionTrigger>
                <AccordionContent>
                  To add a new device, go to the Devices section and click on the "+" button. 
                  Follow the on-screen instructions to pair your device. Make sure your smart device 
                  is in pairing mode before starting the process.
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I control blinds with voice commands?</AccordionTrigger>
                <AccordionContent>
                  Yes, if your smart blinds are connected to a voice assistant like Alexa, Google Home, 
                  or Siri. Configure voice integration in the Settings page under the Blinds tab, then 
                  use commands like "Open living room blinds" or "Close bedroom blinds".
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="item-5">
                <AccordionTrigger>My aromatic diffuser isn't working</AccordionTrigger>
                <AccordionContent>
                  Check that your aromatic diffuser has water and essential oils. Most diffuser issues 
                  are related to empty reservoirs. Also verify that the device is properly connected to 
                  your network and appears as online in the Devices section.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          
          <div className="geo-card">
            <h2 className="text-xl font-mono mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-techguard-500" />
              Documentation
            </h2>
            <div className="grid gap-3">
              <Card className="hover:bg-secondary/20 cursor-pointer transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-techguard-500" />
                    <span>User Manual</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:bg-secondary/20 cursor-pointer transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-techguard-500" />
                    <span>Device Compatibility</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:bg-secondary/20 cursor-pointer transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-techguard-500" />
                    <span>Troubleshooting Guide</span>
                  </div>
                  <Button variant="ghost" size="sm">View</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="geo-card">
            <h2 className="text-xl font-mono mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-techguard-500" />
              Contact Support
            </h2>
            
            <form className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <Input id="name" placeholder="Your name" />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input id="email" type="email" placeholder="your.email@example.com" />
                </div>
                
                <div>
                  <label htmlFor="issue" className="block text-sm font-medium mb-1">Issue Type</label>
                  <select 
                    id="issue" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select issue type</option>
                    <option value="lighting">Lighting Problems</option>
                    <option value="climate">Climate Control Issues</option>
                    <option value="blinds">Smart Blinds Problems</option>
                    <option value="aromatics">Aromatic Diffuser Issues</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Description</label>
                  <Textarea id="message" placeholder="Please describe your issue in detail..." rows={5} />
                </div>
              </div>
              
              <Button type="submit" className="w-full bg-techguard-600 hover:bg-techguard-700">
                Submit Ticket
              </Button>
            </form>
          </div>
          
          <div className="geo-card">
            <h2 className="text-xl font-mono mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-techguard-500" />
              Direct Support
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-md border border-border">
                <Phone className="h-5 w-5 text-techguard-500" />
                <span>+1 (800) 555-0123</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-md border border-border">
                <Mail className="h-5 w-5 text-techguard-500" />
                <span>support@geoentry.com</span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                Support available Monday - Friday, 9AM - 6PM EST
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Support;
