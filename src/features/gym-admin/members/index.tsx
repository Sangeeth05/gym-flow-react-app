import React, { useState, useEffect } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  UserPlus,
  Edit,
  Trash2,
  Eye,
  Users,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import {
  Button,
  Badge,
  SearchInput,
  Modal,
  Input,
  Select,
  DatePicker,
  Textarea,
  ConfirmDialog,
  Spinner,
  EmptyState,
  StatCard,
} from "../../../components/ui";
import { membersApi, plansApi } from "../../../api/endpoints";
import { Member, MembershipPlan, MemberStatus } from "../../../types";
import toast from "react-hot-toast";
import { format } from "date-fns";

const statusColor = (s: MemberStatus) => {
  if (s === "Active") return "green";
  if (s === "Expired") return "red";
  if (s === "Suspended") return "yellow";
  return "gray";
};

const MemberFormModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  member?: Member | null;
  plans: MembershipPlan[];
  onSave: () => void;
}> = ({ isOpen, onClose, member, plans, onSave }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "Male",
    dateOfBirth: "",
    address: "",
    city: "",
    membershipPlanId: "",
    joinDate: new Date().toISOString().split("T")[0],
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (member) {
      setForm({
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        phone: member.phone,
        gender: member.gender,
        dateOfBirth: member.dateOfBirth,
        address: member.address,
        city: member.city,
        membershipPlanId: member.membershipPlanId,
        joinDate: member.joinDate,
        emergencyContact: member.emergencyContact,
        emergencyPhone: member.emergencyPhone,
        notes: member.notes || "",
      });
    } else {
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "Male",
        dateOfBirth: "",
        address: "",
        city: "",
        membershipPlanId: plans[0]?.id || "",
        joinDate: new Date().toISOString().split("T")[0],
        emergencyContact: "",
        emergencyPhone: "",
        notes: "",
      });
    }
    setErrors({});
  }, [member, isOpen, plans]);

  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));
  const setValue = (k: string) => (value: string) =>
    setForm((f) => ({ ...f, [k]: value }));

  const clearError = (k: string) =>
    setErrors((prev) => {
      const next = { ...prev };
      delete next[k];
      return next;
    });

  const handleSubmit = async () => {
    const nextErrors = {
      firstName: form.firstName.trim() ? "" : "First name is required.",
      lastName: form.lastName.trim() ? "" : "Last name is required.",
      email: form.email.trim() ? "" : "Email is required.",
      phone: form.phone.trim() ? "" : "Phone number is required.",
    };
    const activeErrors = Object.fromEntries(Object.entries(nextErrors).filter(([, v]) => v));
    setErrors(activeErrors);
    if (Object.keys(activeErrors).length) {
      toast.error("Please fill required fields");
      return;
    }
    setLoading(true);
    try {
      if (member) {
        await membersApi.update(member.id, form as any);
        toast.success("Member updated");
      } else {
        await membersApi.create(
          form as any as import("../../../types").CreateMemberDto,
        );
        toast.success("Member added successfully");
      }
      onSave();
      onClose();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={member ? "Edit Member" : "Add New Member"}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {member ? "Update" : "Add Member"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name *"
          value={form.firstName}
          onChange={(e) => { clearError("firstName"); set("firstName")(e); }}
          error={errors.firstName}
          placeholder="John"
        />
        <Input
          label="Last Name *"
          value={form.lastName}
          onChange={(e) => { clearError("lastName"); set("lastName")(e); }}
          error={errors.lastName}
          placeholder="Doe"
        />
        <Input
          label="Email *"
          type="email"
          value={form.email}
          onChange={(e) => { clearError("email"); set("email")(e); }}
          error={errors.email}
          placeholder="john@example.com"
        />
        <Input
          label="Phone *"
          value={form.phone}
          onChange={(e) => { clearError("phone"); set("phone")(e); }}
          error={errors.phone}
          placeholder="+91 9876543210"
        />
        <Select
          label="Gender"
          value={form.gender}
          onChange={setValue("gender")}
          options={["Male", "Female", "Other"].map((g) => ({
            value: g,
            label: g,
          }))}
        />
        <DatePicker
          label="Date of Birth"
          value={form.dateOfBirth}
          onChange={setValue("dateOfBirth")}
          placeholder="Select date"
        />
        <DatePicker
          label="Join Date"
          value={form.joinDate}
          onChange={setValue("joinDate")}
          placeholder="Select date"
        />
        <Select
          label="Membership Plan"
          value={form.membershipPlanId}
          onChange={setValue("membershipPlanId")}
          showSearch
          optionFilterProp="label"
          placeholder="Choose a plan"
          options={plans.map((p) => ({
            value: p.id,
            label: `${p.name} - Rs ${p.price}/${p.billingCycle}`,
          }))}
        />
        <div className="md:col-span-2">
          <Input
            label="Address"
            value={form.address}
            onChange={set("address")}
            placeholder="Street address"
          />
        </div>
        <Input
          label="City"
          value={form.city}
          onChange={set("city")}
          placeholder="Thiruvananthapuram"
        />
        <Input
          label="Emergency Contact"
          value={form.emergencyContact}
          onChange={set("emergencyContact")}
          placeholder="Contact name"
        />
        <div className="md:col-span-2">
          <Input
            label="Emergency Phone"
            value={form.emergencyPhone}
            onChange={set("emergencyPhone")}
            placeholder="+91 9876543210"
          />
        </div>
        <div className="md:col-span-2">
          <Textarea
            label="Notes"
            value={form.notes}
            onChange={set("notes")}
            placeholder="Any additional notes..."
            rows={2}
          />
        </div>
      </div>
    </Modal>
  );
};

const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [viewMember, setViewMember] = useState<Member | null>(null);

  const debouncedSearch = useDebounce(search);

  const load = async () => {
    setLoading(true);
    try {
      const [m, p] = await Promise.all([
        membersApi.getAll({ search: debouncedSearch, status: statusFilter || undefined }),
        plansApi.getAll(),
      ]);
      setMembers(m.data);
      setPlans(p);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [debouncedSearch, statusFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await membersApi.delete(deleteId);
      toast.success("Member removed");
      setDeleteId(null);
      load();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setDeleteLoading(false);
    }
  };

  const active = members.filter((m) => m.status === "Active").length;
  const expired = members.filter((m) => m.status === "Expired").length;
  const suspended = members.filter((m) => m.status === "Suspended").length;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-subtitle">
            Manage gym members and their subscriptions
          </p>
        </div>
        <Button
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={() => {
            setEditMember(null);
            setShowForm(true);
          }}
        >
          Add Member
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={members.length}
          icon={<Users className="w-5 h-5 text-brand-400" />}
          iconBg="bg-brand-500/10"
        />
        <StatCard
          title="Active"
          value={active}
          icon={<UserCheck className="w-5 h-5 text-emerald-400" />}
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Expired"
          value={expired}
          icon={<Clock className="w-5 h-5 text-red-400" />}
          iconBg="bg-red-500/10"
        />
        <StatCard
          title="Suspended"
          value={suspended}
          icon={<UserX className="w-5 h-5 text-yellow-400" />}
          iconBg="bg-yellow-500/10"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email, ID..."
          className="flex-1 max-w-sm"
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          className="w-full sm:w-48"
          options={[
            { value: "", label: "All Status" },
            ...["Active", "Inactive", "Suspended", "Expired"].map((s) => ({
              value: s,
              label: s,
            })),
          ]}
        />
      </div>

      <div className="table-wrapper">
        {loading ? (
          <Spinner className="py-16" />
        ) : members.length === 0 ? (
          <EmptyState
            icon={<Users className="w-12 h-12" />}
            title="No members found"
            description="Add your first member or adjust filters"
            action={
              <Button
                leftIcon={<UserPlus className="w-4 h-4" />}
                onClick={() => setShowForm(true)}
              >
                Add Member
              </Button>
            }
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>ID</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Expiry</th>
                <th>Last Visit</th>
                <th>Paid</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-600 to-brand-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-white">
                          {m.firstName[0]}
                          {m.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">
                          {m.firstName} {m.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="font-mono text-xs text-brand-400">
                      {m.memberId}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-slate-300">
                      {m.membershipPlanName}
                    </span>
                  </td>
                  <td>
                    <Badge color={statusColor(m.status)} dot>
                      {m.status}
                    </Badge>
                  </td>
                  <td>
                    <span
                      className={`text-xs ${new Date(m.expiryDate) < new Date() ? "text-red-400" : "text-slate-400"}`}
                    >
                      {format(new Date(m.expiryDate), "dd MMM yyyy")}
                    </span>
                  </td>
                  <td>
                    <span className="text-xs text-slate-500">
                      {m.lastVisit
                        ? format(new Date(m.lastVisit), "dd MMM")
                        : "-"}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm font-semibold text-white">
                      Rs {m.totalPayments.toLocaleString("en-IN")}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewMember(m)}
                        className="p-1.5 hover:bg-dark-600 rounded-lg text-slate-500 hover:text-blue-400 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setEditMember(m);
                          setShowForm(true);
                        }}
                        className="p-1.5 hover:bg-dark-600 rounded-lg text-slate-500 hover:text-brand-400 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteId(m.id)}
                        className="p-1.5 hover:bg-dark-600 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        isOpen={!!viewMember}
        onClose={() => setViewMember(null)}
        title="Member Details"
        size="md"
      >
        {viewMember && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {viewMember.firstName[0]}
                  {viewMember.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">
                  {viewMember.firstName} {viewMember.lastName}
                </h3>
                <p className="text-brand-400 font-mono text-sm">
                  {viewMember.memberId}
                </p>
                <Badge color={statusColor(viewMember.status)} dot>
                  {viewMember.status}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { l: "Email", v: viewMember.email },
                { l: "Phone", v: viewMember.phone },
                { l: "Gender", v: viewMember.gender },
                { l: "City", v: viewMember.city },
                { l: "Plan", v: viewMember.membershipPlanName },
                {
                  l: "Join Date",
                  v: format(new Date(viewMember.joinDate), "dd MMM yyyy"),
                },
                {
                  l: "Expiry",
                  v: format(new Date(viewMember.expiryDate), "dd MMM yyyy"),
                },
                {
                  l: "Total Paid",
                  v: `Rs ${viewMember.totalPayments.toLocaleString("en-IN")}`,
                },
                { l: "Emergency Contact", v: viewMember.emergencyContact },
                { l: "Emergency Phone", v: viewMember.emergencyPhone },
              ].map(({ l, v }) => (
                <div key={l} className="bg-dark-700 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-0.5">{l}</p>
                  <p className="font-medium text-white">{v}</p>
                </div>
              ))}
            </div>
            {viewMember.notes && (
              <div className="bg-dark-700 rounded-lg p-3">
                <p className="text-xs text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-300">{viewMember.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <MemberFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        member={editMember}
        plans={plans}
        onSave={load}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Remove Member"
        message="This will permanently remove the member and all their data. Are you sure?"
      />
    </div>
  );
};

export default MembersPage;
