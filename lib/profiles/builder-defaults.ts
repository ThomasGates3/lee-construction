import type { SiteProfile } from "./types";

/**
 * Copy every builder profile starts from. Written to read like an established
 * local builder, without numbers or awards anyone would have to prove.
 * Per lead: override name, phone, address, license, service areas and anything
 * the builder tells you. Reviews are placeholders and the page labels them as samples
 * until the builder's real Google reviews replace them.
 */
export const builderDefaults: Omit<
  SiteProfile,
  "name" | "shortName" | "phone" | "phoneHref" | "smsHref" | "demoNotice"
> = {
  tagline: "Full-brick homes, built right from the ground up.",
  region: "Metro Atlanta",
  serviceArea: "Atlanta and the surrounding metro",
  email: "hello@example.com",
  address: { street: "100 Example Parkway, Suite 200", city: "Atlanta", state: "GA", zip: "30303" },
  hours: "Mon to Fri, 8am to 5pm · Saturdays by appointment",
  license: "GA Residential Contractor Lic. #RBCO-000000",
  lotLabel: "Lot 14",
  planLabel: "4 Bed · 2.5 Bath · Brick",
  homeSummary: "4 bed · 2.5 bath · full brick",
  footprint: "52'-0\"",
  depth: "8'-0\"",
  totalBuildDays: 180,
  trust: [
    { title: "Licensed & insured", body: "Georgia residential contractor, with liability and builder's risk coverage on every home." },
    { title: "Fixed-price contract", body: "One signed price before ground breaks. Every change is priced in writing first." },
    { title: "Written warranty", body: "Workmanship and structural coverage spelled out in your contract, with an 11-month check-in." },
    { title: "Weekly photo updates", body: "Photos and a schedule update from your project manager every Friday." },
  ],
  services: [
    { title: "Custom brick homes", body: "Classic full-brick homes designed around how your family lives, planned and priced before ground breaks." },
    { title: "Build on your lot", body: "Already own land? Survey, soils, sewer or septic, permits and utilities are handled before the first truck arrives." },
    { title: "Plans & design", body: "Start from one of our plans or bring your own. We turn it into stamped, permit-ready drawings." },
    { title: "Additions & renovations", body: "Garages, primary suites and whole-home renovations, built to the same standard as our new homes." },
  ],
  plans: [
    { name: "The Magnolia", beds: 3, baths: 2, sqft: "1,800", garage: "2-car", note: "Single story with split bedrooms and an open kitchen. A great first build on a smaller lot." },
    { name: "The Dogwood", beds: 4, baths: 2.5, sqft: "2,600", garage: "2-car", note: "Two-story full brick with the bedrooms upstairs. The home in the build above." },
    { name: "The Live Oak", beds: 5, baths: 3.5, sqft: "3,300", garage: "3-car", note: "Primary suite on the main floor, a bonus room up and a covered back porch." },
  ],
  process: [
    { time: "Week 1", title: "Free consultation", body: "We meet at your lot or our office, talk through the home you want and give you an honest budget range." },
    { time: "Weeks 2 to 6", title: "Design & fixed price", body: "Final plans, your selections and a line-item price you can take straight to your lender." },
    { time: "Weeks 6 to 10", title: "Permits & site prep", body: "Survey, soil test, permits and utility hookups, all handled for you." },
    { time: "About 6 months", title: "Construction", body: "Foundation to final brick, with one project manager on your home and a photo update every week." },
    { time: "Move-in", title: "Walkthrough & keys", body: "We walk every room with you and finish the punch list before closing day." },
    { time: "Year one and beyond", title: "Warranty care", body: "Check-ins at 30 days and 11 months, and one number to call if anything comes up." },
  ],
  promises: [
    { title: "One project manager", body: "The same person answers your calls from the first stake to the last walkthrough." },
    { title: "Clear, upfront pricing", body: "Allowances and change orders in writing before work starts. No surprises at closing." },
    { title: "You see every stage", body: "Weekly photos and scheduled site visits at framing, before drywall and at final." },
  ],
  reviews: [
    { quote: "They sent photos every Friday, so we watched our house go up from two states away. Closing day was the easiest part.", name: "Homeowner", area: "Fayetteville" },
    { quote: "The price we signed is the price we paid. Every change was written up and approved before anyone touched it.", name: "Homeowner", area: "Stockbridge" },
    { quote: "Our project manager picked up every single call. The brick is beautiful and the yard was done before we moved in.", name: "Homeowner", area: "Decatur" },
  ],
  serviceAreas: ["Atlanta", "Fulton County", "DeKalb County", "Cobb County", "Gwinnett County", "Clayton County", "Henry County", "Fayette County", "Douglas County", "Rockdale County"],
  faqs: [
    { q: "Do I need to own land before I call?", a: "No. Plenty of our clients start without a lot. We can look at land with you and tell you what it will take to build on a lot before you buy it." },
    { q: "How long does it take to build a home?", a: "A home like the one above takes about six months from permit to keys. Design and permits usually add six to ten weeks before that, and heavy weather can move dates." },
    { q: "How much does a custom home cost?", a: "It depends on the size, the lot and your finishes. After a free site walk we give you a budget range, then a fixed, line-item price once plans and selections are set." },
    { q: "Do you help with construction financing?", a: "Yes. We work with your lender on construction-to-permanent loans and provide the plans, specs and draw schedule they ask for. No lender yet? We can point you to local lenders who do construction loans." },
    { q: "Can I change the plan?", a: "Every plan is a starting point. Changes made during design are built into your price. After that, any change is priced in writing before work starts." },
    { q: "What does the warranty cover?", a: "Your contract spells it out: workmanship and systems in the first year, and longer structural coverage on the foundation and framing. We check in at 30 days and again at 11 months." },
    { q: "Can I visit the site while you build?", a: "Yes. Walkthroughs with your project manager are scheduled at framing, before drywall and at final, and you can ask for more any time." },
  ],
  social: [
    { label: "Facebook", href: "#" },
    { label: "Instagram", href: "#" },
    { label: "Google reviews", href: "#" },
  ],
};
