import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Connect Your Zoom Account | ${APP_NAME}`,
};

// Static tutorial page linked from Settings → Integrations (TUTORIAL_URL).
// Content mirrors docs/zoom-setup-tutorial.md — keep the two in sync.

const SCOPES = [
  {
    scope: "meeting:write:meeting:admin",
    purpose: "Lets the LMS create your class meetings",
  },
  {
    scope: "user:read:user:admin",
    purpose: "Lets the LMS verify your Zoom account when you connect",
  },
  {
    scope: "cloud_recording:read:list_user_recordings:admin",
    purpose:
      "Not used yet — needed for automatic recording handling in a future update. Add it now so you don't have to redo this step later.",
  },
];

const FORM_FIELDS = [
  ["Email", "The email you sign into Zoom with — the same account where you built the app"],
  ["Account ID", "From the App Credentials page (Step 2)"],
  ["Client ID", "From the App Credentials page (Step 2)"],
  ["Client Secret", "From the App Credentials page (Step 2)"],
  ["Event Secret Token", "The Secret Token from Step 5 (optional)"],
];

const TROUBLESHOOTING = [
  [
    "“Zoom rejected these credentials”",
    "The Account ID, Client ID, or Client Secret doesn't match, or the app isn't activated.",
    "At marketplace.zoom.us → Manage → your app → App Credentials, carefully re-copy all three values, confirm the Activation tab says Activated, then try Connect again.",
  ],
  [
    "“This email doesn't belong to the Zoom account…”",
    "The email you entered isn't a user in the Zoom account where you built the app.",
    "Use the email you sign into Zoom with — the app and the email must be from the same Zoom account.",
  ],
  [
    "It worked before, but classes now show “Credentials rejected”",
    "Someone regenerated the Client Secret or deactivated/deleted the app in Zoom.",
    "Re-activate the app (or re-copy the new secret / rebuild the app), then re-enter the credentials at Settings → Integrations and click Connect.",
  ],
  [
    "Meetings end after 40 minutes",
    "You're on a free Zoom plan.",
    "A Zoom Pro (paid) plan is required for meetings longer than 40 minutes.",
  ],
];

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h3 className="text-lg font-bold">
        Step {number}: {title}
      </h3>
      <div className="space-y-2 text-sm leading-6 text-gray-700">{children}</div>
    </section>
  );
}

export default function ZoomSetupPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-extrabold">Connect Your Zoom Account to {APP_NAME}</h1>
      <p className="mt-4 text-sm leading-6 text-gray-700">
        This guide shows you how to connect your Zoom account so the LMS can automatically create Zoom
        meetings for your live classes. It takes about 10 minutes, you only do it once, and you don&apos;t
        need any technical knowledge — just follow the steps in order.
      </p>

      <div className="mt-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-sm leading-6">
        <p className="font-bold">What you need before you start:</p>
        <ul className="mt-1 list-disc pl-5">
          <li>Your Zoom sign-in email and password.</li>
          <li>
            A <strong>Zoom Pro (paid) plan</strong> if your classes run longer than 40 minutes — free Zoom
            accounts cut meetings off at 40 minutes.
          </li>
        </ul>
        <p className="mt-2">
          You will create a small &ldquo;app&rdquo; inside your own Zoom account. This app is private to you
          — nobody else can see or use it. It simply gives the LMS permission to schedule meetings on your
          behalf.
        </p>
      </div>

      <h2 className="mt-10 text-2xl font-bold">Part 1 — Create the app in Zoom</h2>
      <div className="mt-6 space-y-8">
        <Step number={1} title="Open the Zoom App Marketplace">
          <ol className="list-decimal space-y-1 pl-5">
            <li>
              Go to{" "}
              <a href="https://marketplace.zoom.us" target="_blank" rel="noreferrer" className="font-bold underline">
                marketplace.zoom.us
              </a>
            </li>
            <li>Click <strong>Sign In</strong> (top right) and sign in with your normal Zoom account.</li>
            <li>Hover over <strong>Develop</strong> (top right) and click <strong>Build App</strong>.</li>
            <li>Choose <strong>Server-to-Server OAuth</strong> as the app type.</li>
            <li>
              Name it, for example <strong>{APP_NAME} LMS</strong>, and click <strong>Create</strong>.
            </li>
          </ol>
        </Step>

        <Step number={2} title="Copy your App Credentials">
          <p>
            The <strong>App Credentials</strong> page shows three values: <strong>Account ID</strong>,{" "}
            <strong>Client ID</strong> and <strong>Client Secret</strong> (click the eye/copy icon to reveal
            it). Keep this tab open — you&apos;ll paste them into the LMS in Part 2. Treat the Client Secret
            like a password: don&apos;t email it or share it with anyone.
          </p>
        </Step>

        <Step number={3} title="Fill in the Information tab">
          <p>
            Zoom requires a few basic fields before activation: a short description (e.g. &ldquo;Creates my
            class meetings&rdquo;), company name (your name or school), and a developer contact name/email
            (your own). Fill in every field marked required.
          </p>
        </Step>

        <Step number={4} title="Add Scopes (permissions)">
          <p>
            On the <strong>Scopes</strong> tab, click <strong>Add Scopes</strong> and tick each of these
            three <em>exactly</em>:
          </p>
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b font-bold">
                <th className="py-2 pr-3">Scope</th>
                <th className="py-2">What it&apos;s for</th>
              </tr>
            </thead>
            <tbody>
              {SCOPES.map((s) => (
                <tr key={s.scope} className="border-b align-top">
                  <td className="py-2 pr-3 font-mono">{s.scope}</td>
                  <td className="py-2">{s.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Step>

        <Step number={5} title="Copy the Secret Token (optional but recommended)">
          <p>
            On the <strong>Feature</strong> tab (sometimes called <strong>Event Subscriptions</strong> or{" "}
            <strong>Access</strong>), copy the <strong>Secret Token</strong>. It&apos;s not required to
            connect, but it&apos;s needed for the upcoming automatic recording features — grabbing it now
            saves you a second trip.
          </p>
        </Step>

        <Step number={6} title="Activate the app">
          <p>
            On the <strong>Activation</strong> tab, click <strong>Activate your app</strong>. If Zoom
            won&apos;t let you, it will say what&apos;s missing — usually a required Information field or
            missing scopes.{" "}
            <strong>The app must show as Activated, or the connection in Part 2 will fail.</strong>
          </p>
        </Step>
      </div>

      <h2 className="mt-10 text-2xl font-bold">Part 2 — Connect the LMS</h2>
      <div className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
        <p>
          In the teacher portal, go to <strong>Settings → Integrations</strong> and fill in the form:
        </p>
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b font-bold">
              <th className="py-2 pr-3">LMS field</th>
              <th className="py-2">What to paste</th>
            </tr>
          </thead>
          <tbody>
            {FORM_FIELDS.map(([field, what]) => (
              <tr key={field} className="border-b align-top">
                <td className="py-2 pr-3 font-bold">{field}</td>
                <td className="py-2">{what}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Click <strong>Connect</strong>. The LMS checks your credentials with Zoom immediately — once
          connected, Zoom meetings for your scheduled classes are created automatically about 15 minutes
          before each class starts.
        </p>
      </div>

      <h2 className="mt-10 text-2xl font-bold">Troubleshooting</h2>
      <table className="mt-4 w-full border-collapse text-left text-xs">
        <thead>
          <tr className="border-b font-bold">
            <th className="py-2 pr-3">What you see</th>
            <th className="py-2 pr-3">What it means</th>
            <th className="py-2">How to fix it</th>
          </tr>
        </thead>
        <tbody>
          {TROUBLESHOOTING.map(([see, means, fix]) => (
            <tr key={see} className="border-b align-top">
              <td className="py-2 pr-3 font-bold">{see}</td>
              <td className="py-2 pr-3">{means}</td>
              <td className="py-2">{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm leading-6">
        <p>
          <strong>Fallback — you&apos;re never blocked:</strong> if the connection isn&apos;t working right before a
          class, create the meeting in Zoom yourself and paste the meeting link manually into the class form.
          Students join it exactly the same way.
        </p>
        <p className="mt-2">
          Still stuck? Contact support and mention &ldquo;Zoom setup&rdquo; — include the step you&apos;re on and
          any error message (never send us your Client Secret).
        </p>
      </div>
    </main>
  );
}
