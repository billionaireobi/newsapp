import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about using our news platform</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How do I create an account?</AccordionTrigger>
                  <AccordionContent>
                    To create an account, click on the "Sign In" button in the top right corner of the page, then select
                    the "Sign Up" tab. Enter your email address and create a password, then follow the verification
                    instructions sent to your email.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I bookmark articles?</AccordionTrigger>
                  <AccordionContent>
                    To bookmark an article, click on the bookmark icon on any article card or within the article page.
                    You must be signed in to use this feature. Your bookmarks can be accessed from your profile or the
                    bookmarks page.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I share articles?</AccordionTrigger>
                  <AccordionContent>
                    To share an article, click on the share icon on any article card or within the article page. You can
                    share via social media platforms like Twitter/X, Facebook, LinkedIn, or copy the link to share
                    elsewhere.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>How do I update my profile information?</AccordionTrigger>
                  <AccordionContent>
                    To update your profile, click on your profile icon in the top right corner and select "Profile" from
                    the dropdown menu. From there, you can edit your username, full name, and avatar.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>How do I change my password?</AccordionTrigger>
                  <AccordionContent>
                    To change your password, go to Settings by clicking on your profile icon and selecting "Settings"
                    from the dropdown menu. In the Account tab, you'll find the option to change your password.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>Need more help? Reach out to our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">Our support team is available Monday through Friday, 9am to 5pm EST.</p>
              <div className="space-y-2">
                <h3 className="font-medium">Email Support</h3>
                <p className="text-sm">support@newsaggregator.com</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Live Chat</h3>
                <p className="text-sm">Available during business hours</p>
                <Button className="w-full">Start Chat</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
