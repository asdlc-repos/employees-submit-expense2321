import { useState, type ReactNode } from "react";
import {
  Alert, AppShell, Badge, Breadcrumbs, Button, Detail, EmptyState, Field, Filters, Form, Heading, Screen,
  Section, Stat, StatGroup, Table, Tabs, Text, ValidationSummary, defineApp, useCollection, useDisplayState,
  useNav, useParams, useRole,
} from "@wso2/prototype-kit";

interface Line { date: string; category: string; description: string; cents: number }
interface Claim {
  id: string;
  employee: string;
  manager: string;
  status: string;
  submittedAt: string;
  totalCents: number;
  exported: string;
  reason: string;
  decidedBy: string;
  lines: Line[];
}
interface Batch { id: string; created: string; claimCount: number; totalCents: number; by: string }

const ELLA = "Ella Perera";
const MARCO = "Marco Silva";
const CATEGORIES = ["Travel", "Meals", "Accommodation", "Office supplies", "Other"];
const STATUSES = ["All", "Draft", "Submitted", "Approved", "Rejected", "Withdrawn"];

const claims: Claim[] = [
  { id: "claim.2041", employee: ELLA, manager: MARCO, status: "Draft", submittedAt: "", totalCents: 8450, exported: "", reason: "", decidedBy: "",
    lines: [{ date: "2026-01-12", category: "Travel", description: "Taxi to airport", cents: 8450 }] },
  { id: "claim.2038", employee: ELLA, manager: MARCO, status: "Submitted", submittedAt: "2026-01-10", totalCents: 24000, exported: "", reason: "", decidedBy: "",
    lines: [
      { date: "2026-01-08", category: "Travel", description: "Train to client site", cents: 19000 },
      { date: "2026-01-09", category: "Meals", description: "Team lunch", cents: 5000 },
    ] },
  { id: "claim.2031", employee: ELLA, manager: MARCO, status: "Rejected", submittedAt: "2026-01-02", totalCents: 5620, exported: "", reason: "Receipt amount does not match", decidedBy: MARCO,
    lines: [{ date: "2025-12-30", category: "Meals", description: "Client dinner", cents: 5620 }] },
  { id: "claim.2024", employee: ELLA, manager: MARCO, status: "Approved", submittedAt: "2025-12-20", totalCents: 12000, exported: "export.1", reason: "", decidedBy: MARCO,
    lines: [{ date: "2025-12-18", category: "Accommodation", description: "Hotel, one night", cents: 12000 }] },
  { id: "claim.2044", employee: "Ana Fernando", manager: MARCO, status: "Submitted", submittedAt: "2026-01-03", totalCents: 24000, exported: "", reason: "", decidedBy: "",
    lines: [
      { date: "2026-01-01", category: "Travel", description: "Train to client", cents: 19000 },
      { date: "2026-01-02", category: "Meals", description: "Team lunch", cents: 5000 },
    ] },
  { id: "claim.2045", employee: "Ravi Jayawardena", manager: MARCO, status: "Submitted", submittedAt: "2026-01-05", totalCents: 5620, exported: "", reason: "", decidedBy: "",
    lines: [{ date: "2026-01-04", category: "Office supplies", description: "Printer paper", cents: 5620 }] },
  { id: "claim.2036", employee: "Ana Fernando", manager: MARCO, status: "Approved", submittedAt: "2026-01-04", totalCents: 9800, exported: "", reason: "", decidedBy: MARCO,
    lines: [{ date: "2026-01-03", category: "Travel", description: "Parking", cents: 9800 }] },
  { id: "claim.2029", employee: "Nina Rao", manager: "Tara Wong", status: "Approved", submittedAt: "2025-12-28", totalCents: 31000, exported: "", reason: "", decidedBy: "Tara Wong",
    lines: [{ date: "2025-12-26", category: "Accommodation", description: "Conference hotel", cents: 31000 }] },
  { id: "claim.2027", employee: "Omar Haddad", manager: "Tara Wong", status: "Rejected", submittedAt: "2025-12-27", totalCents: 4000, exported: "", reason: "Personal expense", decidedBy: "Tara Wong",
    lines: [{ date: "2025-12-24", category: "Meals", description: "Dinner", cents: 4000 }] },
];

const batches: Batch[] = [
  { id: "export.1", created: "2026-01-02", claimCount: 9, totalCents: 118000, by: "Fiona Jayasuriya" },
  { id: "export.0", created: "2025-12-15", claimCount: 14, totalCents: 231000, by: "Fiona Jayasuriya" },
];

function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function tone(status: string): "default" | "info" | "success" | "warning" | "error" {
  if (status === "Approved") return "success";
  if (status === "Rejected") return "error";
  if (status === "Submitted") return "info";
  return "default";
}

function Shell({ children }: { children: ReactNode }) {
  const role = useRole();
  const user =
    role === "Manager"
      ? { name: MARCO, email: "marco.silva@acme.example" }
      : role === "FinanceOfficer"
        ? { name: "Fiona Jayasuriya", email: "fiona.j@acme.example" }
        : { name: ELLA, email: "ella.perera@acme.example" };
  const nav =
    role === "Manager"
      ? [{ id: "nav.team", label: "Team claims", to: "screen.team-queue" }]
      : role === "FinanceOfficer"
        ? [
            { id: "nav.all-claims", label: "All claims", to: "screen.all-claims" },
            { id: "nav.payroll", label: "Payroll export", to: "screen.payroll-exports" },
          ]
        : [{ id: "nav.my-claims", label: "My claims", to: "screen.my-claims" }];
  return (
    <AppShell id="shell" user={user} nav={nav} account="screen.account" settings="screen.settings" signOut="screen.signed-out">
      {children}
    </AppShell>
  );
}

function LinesTable({ id, lines }: { id: string; lines: Line[] }) {
  return (
    <Table
      id={id}
      columns={["Date", "Category", "Description", { label: "Amount", kind: "number" }]}
      rows={lines.map((l, i) => ({ id: `${id}.${i}`, cells: [l.date, l.category, l.description, money(l.cents)] }))}
      empty={<EmptyState id={`${id}.empty`} title="No lines yet" text="Add an expense line to this claim." />}
    />
  );
}

function MyClaims() {
  const state = useDisplayState();
  const all = useCollection<Claim>("claims");
  const [filter, setFilter] = useState("All");
  const mine = state === "state.empty" ? [] : all.items.filter((c) => c.employee === ELLA && (filter === "All" || c.status === filter));
  return (
    <Shell>
      <Heading id="heading.my-claims" text="My claims" />
      {state === "state.failed" && (
        <Alert id="alert.claims-failed" tone="error" title="Claims unavailable" text="Your claims could not be loaded. Try again in a few minutes." />
      )}
      <Section
        id="section.my-claims"
        title="Claims"
        count={mine.length}
        subtitle="Drafts, submitted and decided claims."
        actions={<Button id="btn.new-claim" label="New claim" emphasis="primary" to="screen.claim-editor" />}
      >
        <Filters id="filters.my-claims">
          <Field id="field.status-filter" label="Status" type="select" options={STATUSES} value={filter} onChange={setFilter} />
        </Filters>
        <Table
          id="table.my-claims"
          columns={["Submitted", { label: "Total", kind: "number" }, "Lines", { label: "Status", kind: "status" }]}
          rows={mine.map((c) => ({
            id: `claim.${c.id}`,
            cells: [c.submittedAt || "Not submitted", money(c.totalCents), String(c.lines.length)],
            status: { text: c.status, tone: tone(c.status) },
            to: "screen.my-claim-detail",
            params: { claim: c.id },
          }))}
          empty={<EmptyState id="empty.my-claims" title="No claims yet" text="Create a claim to get reimbursed." actions={<Button id="btn.empty-new" label="New claim" to="screen.claim-editor" />} />}
        />
      </Section>
    </Shell>
  );
}

function ClaimEditor() {
  const { claim: id } = useParams();
  const state = useDisplayState();
  const navigate = useNav();
  const all = useCollection<Claim>("claims");
  const editing = id ? all.get(id) : undefined;
  const [lines, setLines] = useState<Line[]>(editing && editing.employee === ELLA ? editing.lines : []);
  const [date, setDate] = useState("2026-01-14");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Travel");
  const [description, setDescription] = useState("");
  const [showError, setShowError] = useState(false);

  const draftLine = (): Line | undefined => {
    const cents = Math.round(parseFloat(amount) * 100);
    if (!amount || Number.isNaN(cents) || cents < 1) return undefined;
    return { date, category, description: description || category, cents };
  };
  const addLine = () => {
    const l = draftLine();
    if (!l) {
      setShowError(true);
      return;
    }
    setLines([...lines, l]);
    setAmount("");
    setDescription("");
    setShowError(false);
  };
  const collect = (): Line[] => {
    const l = draftLine();
    return l ? [...lines, l] : lines;
  };
  const save = (status: string) => {
    const finalLines = collect();
    if (finalLines.length === 0) {
      setShowError(true);
      return;
    }
    const totalCents = finalLines.reduce((sum, l) => sum + l.cents, 0);
    const patch = {
      status,
      lines: finalLines,
      totalCents,
      reason: "",
      submittedAt: status === "Submitted" ? "2026-01-15" : "",
    };
    if (editing) {
      all.update(editing.id, patch);
      navigate.go(status === "Submitted" ? "screen.my-claim-detail" : "screen.my-claims", status === "Submitted" ? { claim: editing.id } : undefined);
    } else {
      const newId = all.create({ employee: ELLA, manager: MARCO, exported: "", decidedBy: "", ...patch });
      navigate.go(status === "Submitted" ? "screen.my-claim-detail" : "screen.my-claims", status === "Submitted" ? { claim: newId } : undefined);
    }
  };
  const invalid = state === "state.validation-error" || showError;
  const total = collect().reduce((sum, l) => sum + l.cents, 0);
  return (
    <Shell>
      <Breadcrumbs
        id="breadcrumbs.editor"
        items={[
          { id: "crumb.my-claims", label: "My claims", to: "screen.my-claims" },
          { id: "crumb.claim", label: editing ? "Edit claim" : "New claim" },
        ]}
      />
      <Heading id="heading.editor" text={editing ? "Edit claim" : "New claim"} />
      {invalid && <ValidationSummary id="summary.claim" issues={["Enter an amount of at least 0.01 for the expense line", "A claim needs at least one expense line"]} />}
      <Section id="section.lines" title="Expense lines" count={lines.length} subtitle="Each line has a date, an amount, a category and a description.">
        <LinesTable id="table.lines" lines={lines} />
      </Section>
      <Form
        id="form.claim"
        title="Add an expense line"
        onSubmit={() => save("Submitted")}
        actions={
          <Stack2>
            <Button id="btn.add-line" label="Add line" onPress={addLine} />
            <Button id="btn.save-draft" label="Save draft" onPress={() => save("Draft")} />
            <Button id="btn.submit-claim" label={`Submit claim (${money(total)})`} emphasis="primary" submit />
          </Stack2>
        }
      >
        <Field id="field.date" label="Date" type="date" value={date} onChange={setDate} />
        <Field id="field.amount" label="Amount" type="number" value={amount} onChange={setAmount} error={invalid ? "Enter an amount" : undefined} />
        <Field id="field.category" label="Category" type="select" options={CATEGORIES} value={category} onChange={setCategory} />
        <Field id="field.description" label="Description" type="textarea" value={description} onChange={setDescription} />
      </Form>
    </Shell>
  );
}

function Stack2({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function MyClaimDetail() {
  const { claim: id } = useParams();
  const state = useDisplayState();
  const all = useCollection<Claim>("claims");
  const mine = all.items.filter((c) => c.employee === ELLA);
  const claim = (id ? all.get(id) : undefined) ?? mine[0]!;
  const open = claim.status === "Draft" || claim.status === "Submitted" || claim.status === "Rejected";
  const withdrawable = claim.status === "Draft" || claim.status === "Submitted";
  return (
    <Shell>
      <Breadcrumbs
        id="breadcrumbs.my-claim"
        items={[
          { id: "crumb.my-claims", label: "My claims", to: "screen.my-claims" },
          { id: "crumb.claim", label: `Claim ${claim.id.replace("claim.", "")}` },
        ]}
      />
      <Heading id="heading.my-claim" text={`Claim ${claim.id.replace("claim.", "")}`} />
      <Badge id="badge.status" label={claim.status} tone={tone(claim.status)} />
      {state === "state.failed" && (
        <Alert id="alert.action-failed" tone="error" title="Could not update the claim" text="Nothing was changed. Try again in a few minutes." />
      )}
      {claim.status === "Rejected" && (
        <Alert id="alert.rejected" tone="error" title={`Rejected by ${claim.decidedBy}`} text={`Reason: ${claim.reason}. Correct the claim and submit it again.`} />
      )}
      {claim.status === "Approved" && <Alert id="alert.approved" tone="success" title="Approved" text="This claim is decided and can no longer be changed." />}
      <Detail
        id="detail.my-claim"
        fields={[
          { label: "Total", value: money(claim.totalCents) },
          { label: "Submitted", value: claim.submittedAt || "Not submitted" },
          { label: "Approver", value: claim.manager },
        ]}
      />
      <Section
        id="section.claim-lines"
        title="Expense lines"
        count={claim.lines.length}
        actions={
          <>
            {withdrawable && <Button id="btn.withdraw" label="Withdraw" emphasis="danger" onPress={() => all.update(claim.id, { status: "Withdrawn" })} />}
            {open && <Button id="btn.edit-claim" label={claim.status === "Rejected" ? "Correct and resubmit" : "Edit claim"} emphasis="primary" to="screen.claim-editor" params={{ claim: claim.id }} />}
          </>
        }
      >
        <LinesTable id="table.claim-lines" lines={claim.lines} />
      </Section>
    </Shell>
  );
}

function TeamQueue() {
  const state = useDisplayState();
  const all = useCollection<Claim>("claims");
  const team = state === "state.empty" ? [] : all.items.filter((c) => c.manager === MARCO && c.status !== "Draft" && c.status !== "Withdrawn");
  const pending = team.filter((c) => c.status === "Submitted").sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
  const decided = team.filter((c) => c.status === "Approved" || c.status === "Rejected");
  const rows = (list: Claim[], prefix: string) =>
    list.map((c) => ({
      id: `${prefix}.${c.id}`,
      cells: [c.employee, c.submittedAt, money(c.totalCents)],
      status: { text: c.status, tone: tone(c.status) },
      to: "screen.team-claim-detail",
      params: { claim: c.id },
    }));
  const columns = ["Employee", "Submitted", { label: "Total", kind: "number" as const }, { label: "Status", kind: "status" as const }];
  return (
    <Shell>
      <Heading id="heading.team" text="Team claims" />
      {state === "state.failed" && (
        <Alert id="alert.team-failed" tone="error" title="Team claims unavailable" text="The claim list could not be loaded. Try again in a few minutes." />
      )}
      <StatGroup>
        <Stat id="stat.pending" label="Waiting for you" value={String(pending.length)} hint="claims to decide, oldest first" icon="Inbox" tone="warning" />
        <Stat id="stat.decided" label="Decided" value={String(decided.length)} hint="approved or rejected" icon="CircleCheck" tone="success" />
      </StatGroup>
      <Tabs
        id="tabs.team"
        tabs={[
          {
            id: "tab.pending",
            label: "Pending",
            content: (
              <Table
                id="table.pending"
                columns={columns}
                rows={rows(pending, "pending")}
                empty={<EmptyState id="empty.pending" title="Nothing to approve" text="New claims from your direct reports appear here." />}
              />
            ),
          },
          {
            id: "tab.decided",
            label: "Decided",
            content: (
              <Table
                id="table.decided"
                columns={columns}
                rows={rows(decided, "decided")}
                empty={<EmptyState id="empty.decided" title="No decisions yet" text="Claims you approve or reject appear here." />}
              />
            ),
          },
        ]}
      />
    </Shell>
  );
}

function TeamClaimDetail() {
  const { claim: id } = useParams();
  const state = useDisplayState();
  const navigate = useNav();
  const all = useCollection<Claim>("claims");
  const team = all.items.filter((c) => c.manager === MARCO && c.status !== "Draft");
  const claim = (id ? all.get(id) : undefined) ?? team.find((c) => c.status === "Submitted") ?? team[0]!;
  const changed = state === "state.conflict";
  const decidable = claim.status === "Submitted" && !changed;
  return (
    <Shell>
      <Breadcrumbs
        id="breadcrumbs.team-claim"
        items={[
          { id: "crumb.team", label: "Team claims", to: "screen.team-queue" },
          { id: "crumb.claim", label: claim.employee },
        ]}
      />
      <Heading id="heading.team-claim" text={`${claim.employee}, ${money(claim.totalCents)}`} />
      <Badge id="badge.team-status" label={claim.status} tone={tone(claim.status)} />
      {changed && (
        <Alert id="alert.changed" tone="warning" title="This claim changed" text="The employee edited or withdrew it after you opened it. Reload to see its current state before deciding." />
      )}
      {claim.status === "Withdrawn" && <Alert id="alert.withdrawn" tone="info" title="Withdrawn" text="The employee withdrew this claim." />}
      <Detail
        id="detail.team-claim"
        fields={[
          { label: "Employee", value: claim.employee },
          { label: "Submitted", value: claim.submittedAt || "Not submitted" },
          { label: "Total", value: money(claim.totalCents) },
          ...(claim.reason ? [{ label: "Rejection reason", value: claim.reason }] : []),
        ]}
      />
      <Section
        id="section.team-lines"
        title="Expense lines"
        count={claim.lines.length}
        actions={
          <>
            <Button id="btn.reject" label="Reject" emphasis="danger" disabled={!decidable} to="screen.reject-claim" params={{ claim: claim.id }} />
            <Button
              id="btn.approve"
              label="Approve"
              emphasis="primary"
              disabled={!decidable}
              onPress={() => {
                all.update(claim.id, { status: "Approved", decidedBy: MARCO });
                navigate.go("screen.team-queue");
              }}
            />
          </>
        }
      >
        <LinesTable id="table.team-lines" lines={claim.lines} />
      </Section>
    </Shell>
  );
}

function RejectClaim() {
  const { claim: id } = useParams();
  const state = useDisplayState();
  const navigate = useNav();
  const all = useCollection<Claim>("claims");
  const team = all.items.filter((c) => c.manager === MARCO && c.status === "Submitted");
  const claim = (id ? all.get(id) : undefined) ?? team[0] ?? all.items[0]!;
  const invalid = state === "state.validation-error";
  return (
    <Shell>
      <Breadcrumbs
        id="breadcrumbs.reject"
        items={[
          { id: "crumb.team", label: "Team claims", to: "screen.team-queue" },
          { id: "crumb.claim", label: claim.employee, to: "screen.team-claim-detail", params: { claim: claim.id } },
          { id: "crumb.reject", label: "Reject" },
        ]}
      />
      <Heading id="heading.reject" text={`Reject ${claim.employee}'s claim`} />
      <Text id="text.reject" text={`The reason is shown to the employee, who can correct the ${money(claim.totalCents)} claim and resubmit it.`} />
      {invalid && <ValidationSummary id="summary.reject" issues={["Give the employee a reason for rejecting"]} />}
      <Form
        id="form.reject"
        onSubmit={(values) => {
          all.update(claim.id, { status: "Rejected", reason: values.reason ?? "", decidedBy: MARCO });
          navigate.go("screen.team-queue");
        }}
        actions={
          <>
            <Button id="btn.reject-cancel" label="Cancel" to="screen.team-claim-detail" params={{ claim: claim.id }} />
            <Button id="btn.reject-confirm" label="Reject claim" emphasis="danger" submit />
          </>
        }
      >
        <Field id="field.reason" name="reason" label="Reason" type="textarea" required error={invalid ? "Give the employee a reason" : undefined} />
      </Form>
    </Shell>
  );
}

function AllClaims() {
  const state = useDisplayState();
  const all = useCollection<Claim>("claims");
  const [filter, setFilter] = useState("All");
  const [downloaded, setDownloaded] = useState(false);
  const submitted = all.items.filter((c) => c.status !== "Draft");
  const shown = (state === "state.empty" ? [] : submitted)
    .filter((c) => filter === "All" || c.status === filter)
    .sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  const totalFor = (status: string) => submitted.filter((c) => c.status === status).reduce((sum, c) => sum + c.totalCents, 0);
  const countFor = (status: string) => submitted.filter((c) => c.status === status).length;
  return (
    <Shell>
      <Heading id="heading.all-claims" text="All claims" />
      {state === "state.failed" && (
        <Alert id="alert.report-failed" tone="error" title="Claims unavailable" text="The claim list could not be loaded. Try again in a few minutes." />
      )}
      {downloaded && <Alert id="alert.csv" tone="success" title="Download started" text="The filtered list was downloaded as a CSV file." />}
      <StatGroup>
        <Stat id="stat.submitted" label="Submitted" value={String(countFor("Submitted"))} hint={`${money(totalFor("Submitted"))} awaiting decision`} icon="Hourglass" tone="info" />
        <Stat id="stat.approved" label="Approved" value={String(countFor("Approved"))} hint={`${money(totalFor("Approved"))} in total`} icon="CircleCheck" tone="success" />
        <Stat id="stat.rejected" label="Rejected" value={String(countFor("Rejected"))} hint={`${money(totalFor("Rejected"))} in total`} icon="CircleX" tone="error" />
      </StatGroup>
      <Section
        id="section.all-claims"
        title="Claims"
        count={shown.length}
        subtitle="Every submitted claim, newest first."
        actions={<Button id="btn.download-csv" label="Download CSV" onPress={() => setDownloaded(true)} />}
      >
        <Filters id="filters.all-claims">
          <Field id="field.report-status" label="Status" type="select" options={["All", "Submitted", "Approved", "Rejected", "Withdrawn"]} value={filter} onChange={setFilter} />
        </Filters>
        <Table
          id="table.all-claims"
          columns={["Employee", "Submitted", { label: "Total", kind: "number" }, { label: "Status", kind: "status" }, "Exported"]}
          rows={shown.map((c) => ({
            id: `claim.${c.id}`,
            cells: [c.employee, c.submittedAt, money(c.totalCents), c.exported ? "Yes" : "No"],
            status: { text: c.status, tone: tone(c.status) },
            to: "screen.finance-claim-detail",
            params: { claim: c.id },
          }))}
          empty={<EmptyState id="empty.all-claims" title="No claims" text="No submitted claims match this filter." />}
        />
      </Section>
    </Shell>
  );
}

function FinanceClaimDetail() {
  const { claim: id } = useParams();
  const all = useCollection<Claim>("claims");
  const submitted = all.items.filter((c) => c.status !== "Draft");
  const claim = (id ? all.get(id) : undefined) ?? submitted[0]!;
  return (
    <Shell>
      <Breadcrumbs
        id="breadcrumbs.finance-claim"
        items={[
          { id: "crumb.all", label: "All claims", to: "screen.all-claims" },
          { id: "crumb.claim", label: claim.employee },
        ]}
      />
      <Heading id="heading.finance-claim" text={`${claim.employee}, ${money(claim.totalCents)}`} />
      <Badge id="badge.finance-status" label={claim.status} tone={tone(claim.status)} />
      <Detail
        id="detail.finance-claim"
        fields={[
          { label: "Employee", value: claim.employee },
          { label: "Approver", value: claim.manager },
          { label: "Submitted", value: claim.submittedAt || "Not submitted" },
          { label: "Decision", value: claim.decidedBy ? `${claim.status} by ${claim.decidedBy}` : "Not decided" },
          ...(claim.reason ? [{ label: "Reason", value: claim.reason }] : []),
          { label: "Exported", value: claim.exported ? "Yes" : "No" },
        ]}
      />
      <Section id="section.finance-lines" title="Expense lines" count={claim.lines.length} actions={<Button id="btn.back-claims" label="Back to claims" to="screen.all-claims" />}>
        <LinesTable id="table.finance-lines" lines={claim.lines} />
      </Section>
    </Shell>
  );
}

function PayrollExports() {
  const state = useDisplayState();
  const all = useCollection<Claim>("claims");
  const past = useCollection<Batch>("batches");
  const [message, setMessage] = useState<{ tone: "success" | "warning"; text: string } | undefined>(undefined);
  const pending = state === "state.empty" ? [] : all.items.filter((c) => c.status === "Approved" && !c.exported);
  const pendingTotal = pending.reduce((sum, c) => sum + c.totalCents, 0);
  const exportNow = () => {
    if (pending.length === 0) {
      setMessage({ tone: "warning", text: "Nothing to export: every approved claim is already in a batch." });
      return;
    }
    const batchId = past.create({ created: "2026-01-15", claimCount: pending.length, totalCents: pendingTotal, by: "Fiona Jayasuriya" });
    pending.forEach((c) => all.update(c.id, { exported: batchId }));
    setMessage({ tone: "success", text: `${pending.length} claims (${money(pendingTotal)}) exported as one CSV batch and downloaded.` });
  };
  return (
    <Shell>
      <Heading id="heading.payroll" text="Payroll export" />
      {state === "state.failed" && (
        <Alert id="alert.export-failed" tone="error" title="Export unavailable" text="The export could not be created. No claims were marked as exported. Try again in a few minutes." />
      )}
      {message && <Alert id="alert.export-result" tone={message.tone} title={message.tone === "success" ? "Batch created" : "No batch created"} text={message.text} />}
      <StatGroup>
        <Stat id="stat.waiting" label="Waiting to export" value={String(pending.length)} hint="approved claims not yet exported" icon="Receipt" tone="warning" />
        <Stat id="stat.waiting-total" label="Waiting total" value={money(pendingTotal)} hint="across all waiting claims" icon="DollarSign" />
      </StatGroup>
      <Section
        id="section.waiting"
        title="Approved claims waiting"
        count={pending.length}
        subtitle="One export includes every approved claim not yet exported."
        actions={<Button id="btn.export" label="Export approved claims" emphasis="primary" onPress={exportNow} />}
      >
        <Table
          id="table.waiting"
          columns={["Employee", "Approved", { label: "Total", kind: "number" }]}
          rows={pending.map((c) => ({ id: `waiting.${c.id}`, cells: [c.employee, c.submittedAt, money(c.totalCents)] }))}
          empty={<EmptyState id="empty.waiting" title="Nothing waiting" text="Approved claims appear here until they are exported." />}
        />
      </Section>
      <Section id="section.batches" title="Past batches" count={past.items.length} subtitle="Download any earlier batch again.">
        <Table
          id="table.batches"
          columns={["Created", { label: "Claims", kind: "number" }, { label: "Total", kind: "number" }, "By"]}
          rows={past.items.map((b) => ({
            id: `batch.${b.id}`,
            cells: [b.created, String(b.claimCount), money(b.totalCents), b.by],
            actions: [{ id: `batch.${b.id}.download`, label: "Download", onPress: () => setMessage({ tone: "success", text: `Batch from ${b.created} downloaded again.` }) }],
          }))}
          empty={<EmptyState id="empty.batches" title="No batches yet" text="Exports you create are listed here." />}
        />
      </Section>
    </Shell>
  );
}

function Account() {
  const role = useRole();
  const name = role === "Manager" ? MARCO : role === "FinanceOfficer" ? "Fiona Jayasuriya" : ELLA;
  const email = role === "Manager" ? "marco.silva@acme.example" : role === "FinanceOfficer" ? "fiona.j@acme.example" : "ella.perera@acme.example";
  return (
    <Shell>
      <Heading id="heading.account" text="Account" />
      <Detail id="detail.account" fields={[{ label: "Name", value: name }, { label: "Email", value: email }, { label: "Role", value: role }]} />
    </Shell>
  );
}

function Settings() {
  const navigate = useNav();
  const role = useRole();
  const home = role === "Manager" ? "screen.team-queue" : role === "FinanceOfficer" ? "screen.all-claims" : "screen.my-claims";
  return (
    <Shell>
      <Heading id="heading.settings" text="Settings" />
      <Form
        id="form.settings"
        onSubmit={() => navigate.go(home)}
        actions={<Button id="btn.save-settings" label="Save settings" emphasis="primary" submit />}
      >
        <Field id="field.compact" label="Compact tables" type="switch" defaultValue="off" />
      </Form>
    </Shell>
  );
}

function SignedOut() {
  const role = useRole();
  const home = role === "Manager" ? "screen.team-queue" : role === "FinanceOfficer" ? "screen.all-claims" : "screen.my-claims";
  return (
    <Screen>
      <Heading id="heading.signed-out" text="You are signed out" />
      <Button id="btn.sign-in" label="Sign in" emphasis="primary" to={home} />
    </Screen>
  );
}

export default defineApp({
  screens: {
    "screen.my-claims": MyClaims,
    "screen.claim-editor": ClaimEditor,
    "screen.my-claim-detail": MyClaimDetail,
    "screen.team-queue": TeamQueue,
    "screen.team-claim-detail": TeamClaimDetail,
    "screen.reject-claim": RejectClaim,
    "screen.all-claims": AllClaims,
    "screen.finance-claim-detail": FinanceClaimDetail,
    "screen.payroll-exports": PayrollExports,
    "screen.account": Account,
    "screen.settings": Settings,
    "screen.signed-out": SignedOut,
  },
  data: { claims, batches },
});
