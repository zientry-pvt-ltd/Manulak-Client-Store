import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";

function BankDetails() {
  return (
    <Accordion
      type="single"
      collapsible
      className="bg-blue-50 border border-blue-200 rounded-lg shadow-sm sticky top-20 z-10 lg:static lg:z-0"
    >
      <AccordionItem value="bank-details" className="border-none">
        <AccordionTrigger className="px-4 py-3 hover:no-underline">
          <div className="flex items-center gap-2 text-blue-900 font-semibold">
            <CreditCard className="h-5 w-5" />
            <span>Bank Transfer Details</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-3">
            <div>
              <p className="text-blue-800 font-normal">Account Name:</p>
              <p className="text-blue-800 font-semibold">Manulak Agro</p>
            </div>
            <div>
              <p className="text-blue-800 font-normal">Bank Name:</p>
              <p className="text-blue-800 font-semibold">Bank of Ceylon</p>
            </div>
            <div>
              <p className="text-blue-800 font-normal">Account Number:</p>
              <p className="text-blue-800 font-semibold">0010000000</p>
            </div>
            <div>
              <p className="text-blue-800 font-normal">Branch Name:</p>
              <p className="text-blue-800 font-semibold">Rideegama</p>
            </div>
          </div>
          <Separator className="my-3 bg-blue-200" />
          <div className="space-y-2 text-xs text-blue-800">
            <p className="font-medium text-blue-900">Important Notes:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                This option is not allowed for full order value below Rs.1000.00
              </li>
              <li>
                You are allowed to pay 10% minimum acceptable advance amount
                from the full order value
              </li>
              <li>In need of any clarification please contact us</li>
            </ul>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export default BankDetails;
