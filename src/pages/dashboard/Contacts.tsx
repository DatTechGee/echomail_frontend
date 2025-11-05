/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Upload,
  Search,
  Filter,
  Download,
  Trash2,
  Mail,
  User,
  Tag,
  X,
  Check,
  AlertCircle,
  FileText,
  Save,
  UserPlus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { brand } from "@/constants/brand";
import { toast } from "react-hot-toast";
import {
  useContacts,
  useCreateContact,
  useDeleteContact,
  useBulkDeleteContacts,
  useImportCsv,
  useExportContacts,
  useContactGroups,
  useCreateContactGroup,
} from "@/hooks/useContacts";
import { CONTACT_TABS, SOURCE_OPTIONS } from "@/constants/contact";
import {
  parseCsvData,
  getSourceColor,
  getContactInitials,
  formatContactName,
  formatDate,
} from "@/utils/contact";
import type {
  Contact,
  ContactSource,
  CsvContact,
  GetContactsRequest,
  ContactFormData,
} from "@/types/contact";

export const Contacts = () => {
  // Tab and UI state
  const [activeTab, setActiveTab] = useState<"list" | "add" | "import">("list");
  const [successMessage, setSuccessMessage] = useState("");

  // Filter and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedSource, setSelectedSource] = useState<ContactSource | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [sortBy, setSortBy] = useState<
    "email" | "name" | "added_at" | "source"
  >("added_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Selection state
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  // Manual add form
  const [newContact, setNewContact] = useState<ContactFormData>({
    email: "",
    name: "",
    groups: [],
  });

  // CSV import state
  const [csvData, setCsvData] = useState<CsvContact[]>([]);
  const [showCsvPreview, setShowCsvPreview] = useState(false);
  const [csvImportGroups, setCsvImportGroups] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group management
  const [newGroupName, setNewGroupName] = useState("");
  const [showNewGroupInput, setShowNewGroupInput] = useState(false);

  // Build query parameters
  const queryParams: GetContactsRequest = {
    search: searchQuery || undefined,
    group: selectedGroup === "all" ? undefined : selectedGroup,
    source: selectedSource || undefined,
    page: currentPage,
    per_page: perPage,
    sort_by: sortBy,
    sort_order: sortOrder,
  };

  // API hooks
  const {
    data: contactsData,
    isLoading: contactsLoading,
    error: contactsError,
    refetch: refetchContacts,
  } = useContacts(queryParams);

  const { data: groupsData } = useContactGroups();
  const createContactMutation = useCreateContact();
  const deleteContactMutation = useDeleteContact();
  const bulkDeleteMutation = useBulkDeleteContacts();
  const importCsvMutation = useImportCsv();
  const exportMutation = useExportContacts();
  const createGroupMutation = useCreateContactGroup();

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGroup, selectedSource, sortBy, sortOrder]);

  // Reset selections when data changes
  useEffect(() => {
    setSelectedContacts([]);
  }, [contactsData]);

  const contacts = contactsData?.data.data.contacts || [];
  const pagination = contactsData?.data.data.pagination;
  const stats = contactsData?.data.data.stats;
  const availableGroups = groupsData?.data.data.groups || [];

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Download CSV template
  const downloadTemplate = () => {
    const templateContent = `email,name,groups
john.doe@example.com,John Doe,Customers;VIP
jane.smith@example.com,Jane Smith,Newsletter
mike.johnson@example.com,,Prospects`;

    const blob = new Blob([templateContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "contacts-template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    toast.success("Template downloaded!");
  };

  const handleAddContact = async () => {
    if (!newContact.email) return;

    try {
      const response = await createContactMutation.mutateAsync({
        email: newContact.email,
        name: newContact.name || undefined,
        groups: newContact.groups,
      });

      if (response.data.status === 1) {
        setNewContact({ email: "", name: "", groups: [] });
        showSuccessMessage("Contact added successfully!");
        toast.success("Contact added successfully!");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to add contact";
      toast.error(errorMessage);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsedData = parseCsvData(text);
      setCsvData(parsedData);
      setShowCsvPreview(true);
      setActiveTab("import");
    };

    reader.readAsText(file);
  };

  const removeCsvContact = (index: number) => {
    setCsvData((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCsvImport = async () => {
    const validContacts = csvData.filter((c) => c.isValid);

    if (validContacts.length === 0) {
      toast.error("No valid contacts to import");
      return;
    }

    try {
      const contactsToImport = validContacts.map((contact) => ({
        email: contact.email,
        name: contact.name,
        groups: [...(contact.groups || []), ...csvImportGroups],
      }));

      const response = await importCsvMutation.mutateAsync({
        contacts: contactsToImport,
      });

      if (response.data.status === 1) {
        const { imported, skipped } = response.data.data;
        setCsvData([]);
        setShowCsvPreview(false);
        setCsvImportGroups([]);
        setActiveTab("list");
        showSuccessMessage(
          `${imported} contacts imported, ${skipped} skipped!`
        );
        toast.success(`Successfully imported ${imported} contacts`);

        if (skipped > 0) {
          toast.error(`${skipped} contacts were skipped (duplicates)`);
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to import contacts";
      toast.error(errorMessage);
    }
  };

  const handleDeleteContact = async (uuid: string) => {
    try {
      await deleteContactMutation.mutateAsync(uuid);
      toast.success("Contact deleted successfully");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete contact";
      toast.error(errorMessage);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedContacts.length === 0) return;

    try {
      const response = await bulkDeleteMutation.mutateAsync({
        contact_ids: selectedContacts,
      });

      if (response.data.status === 1) {
        showSuccessMessage(
          `${response.data.data.deleted_count} contacts deleted`
        );
        toast.success(
          `Successfully deleted ${response.data.data.deleted_count} contacts`
        );
        setSelectedContacts([]);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete contacts";
      toast.error(errorMessage);
    }
  };

  const handleExport = async (format: "csv" | "json" = "csv") => {
    try {
      const response = await exportMutation.mutateAsync({
        group: selectedGroup === "all" ? undefined : selectedGroup,
        source: selectedSource || undefined,
        format,
      });

      if (format === "csv") {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "contacts.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const jsonData = JSON.stringify(response.data.data.contacts, null, 2);
        const blob = new Blob([jsonData], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "contacts.json");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }

      toast.success("Export completed successfully");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to export data";
      toast.error(errorMessage);
    }
  };

  const handleSelectContact = (uuid: string) => {
    setSelectedContacts((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    );
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length && contacts.length > 0) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map((c) => c.uuid));
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return;

    try {
      await createGroupMutation.mutateAsync({
        name: newGroupName.trim(),
      });
      setNewGroupName("");
      setShowNewGroupInput(false);
      toast.success("Group created successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to create group";
      toast.error(errorMessage);
    }
  };

  if (contactsError) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">Failed to load contacts</div>
          <motion.button
            onClick={() => refetchContacts()}
            className="flex items-center space-x-2 mx-auto px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            Contacts
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your email contacts and organize them into groups
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: brand.colors.primary }}
            >
              {stats?.total || 0}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Total
            </div>
          </div>
          <div className="text-center">
            <div
              className="text-2xl font-bold"
              style={{ color: brand.colors.accent }}
            >
              {availableGroups.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Groups
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center space-x-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          >
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-300 text-sm">
              {successMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl">
        {CONTACT_TABS.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "text-white shadow-lg"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
            style={{
              backgroundColor:
                activeTab === tab.id ? brand.colors.primary : "transparent",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="relative">
        <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50" />

        <div className="relative p-6">
          <AnimatePresence mode="wait">
            {/* Contact List Tab */}
            {activeTab === "list" && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Filters */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search contacts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                        style={
                          {
                            "--tw-ring-color": `${brand.colors.primary}50`,
                          } as React.CSSProperties
                        }
                      />
                    </div>

                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="pl-10 pr-8 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 appearance-none"
                        style={
                          {
                            "--tw-ring-color": `${brand.colors.primary}50`,
                          } as React.CSSProperties
                        }
                      >
                        <option value="all">All Groups</option>
                        {availableGroups.map((group) => (
                          <option key={group.name} value={group.name}>
                            {group.name} ({group.contacts_count})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <select
                        value={selectedSource}
                        onChange={(e) =>
                          setSelectedSource(e.target.value as any)
                        }
                        className="px-3 py-2 bg-slate-100/50 dark:bg-slate-700/50 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 appearance-none"
                        style={
                          {
                            "--tw-ring-color": `${brand.colors.primary}50`,
                          } as React.CSSProperties
                        }
                      >
                        {SOURCE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {selectedContacts.length > 0 && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={handleBulkDelete}
                        disabled={bulkDeleteMutation.isPending}
                        className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>
                          {bulkDeleteMutation.isPending
                            ? "Deleting..."
                            : `Delete (${selectedContacts.length})`}
                        </span>
                      </motion.button>
                    )}

                    <motion.button
                      onClick={() => handleExport("csv")}
                      disabled={exportMutation.isPending}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {exportMutation.isPending ? "Exporting..." : "Export"}
                      </span>
                    </motion.button>

                    <motion.button
                      onClick={() => refetchContacts()}
                      disabled={contactsLoading}
                      className="flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${contactsLoading ? "animate-spin" : ""}`}
                      />
                    </motion.button>
                  </div>
                </div>

                {/* Contacts Table */}
                <div className="relative overflow-hidden rounded-2xl">
                  {contactsLoading ? (
                    <div className="text-center py-12">
                      <motion.div
                        className="w-8 h-8 border-2 border-slate-300 border-t-blue-500 rounded-full mx-auto mb-4"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      <p className="text-slate-600 dark:text-slate-400">
                        Loading contacts...
                      </p>
                    </div>
                  ) : contacts.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                        No contacts found
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {searchQuery ||
                        selectedGroup !== "all" ||
                        selectedSource
                          ? "Try adjusting your search or filter criteria."
                          : "Add your first contact to get started!"}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-slate-50/50 dark:bg-slate-700/50 border-b border-slate-200/50 dark:border-slate-600/50">
                            <tr>
                              <th className="px-4 py-3 text-left">
                                <input
                                  type="checkbox"
                                  checked={
                                    selectedContacts.length ===
                                      contacts.length && contacts.length > 0
                                  }
                                  onChange={handleSelectAll}
                                  className="w-4 h-4 rounded"
                                  style={{ accentColor: brand.colors.primary }}
                                />
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                                Contact
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                                Groups
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                                Added
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300">
                                Source
                              </th>
                              <th className="px-4 py-3 text-right text-sm font-medium text-slate-700 dark:text-slate-300">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/50 dark:divide-slate-600/50">
                            <AnimatePresence>
                              {contacts.map(
                                (contact: Contact, index: number) => (
                                  <motion.tr
                                    key={contact.uuid}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                                  >
                                    <td className="px-4 py-3">
                                      <input
                                        type="checkbox"
                                        checked={selectedContacts.includes(
                                          contact.uuid
                                        )}
                                        onChange={() =>
                                          handleSelectContact(contact.uuid)
                                        }
                                        className="w-4 h-4 rounded"
                                        style={{
                                          accentColor: brand.colors.primary,
                                        }}
                                      />
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex items-center space-x-3">
                                        <div
                                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                                          style={{
                                            backgroundColor:
                                              brand.colors.primary,
                                          }}
                                        >
                                          {getContactInitials(contact)}
                                        </div>
                                        <div>
                                          <div className="font-medium text-slate-800 dark:text-slate-200">
                                            {formatContactName(contact)}
                                          </div>
                                          <div className="text-sm text-slate-600 dark:text-slate-400">
                                            {contact.email}
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex flex-wrap gap-1">
                                        {contact.groups.map((group) => (
                                          <span
                                            key={group}
                                            className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                          >
                                            {group}
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                                      {formatDate(contact.added_at)}
                                    </td>
                                    <td className="px-4 py-3">
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(contact.source)}`}
                                      >
                                        {contact.source === "manual"
                                          ? "Manual"
                                          : contact.source === "csv"
                                            ? "CSV"
                                            : "Newsletter"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                      <motion.button
                                        onClick={() =>
                                          handleDeleteContact(contact.uuid)
                                        }
                                        disabled={
                                          deleteContactMutation.isPending
                                        }
                                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </motion.button>
                                    </td>
                                  </motion.tr>
                                )
                              )}
                            </AnimatePresence>
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination */}
                      {pagination && pagination.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-slate-200/50 dark:border-slate-600/50">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              Showing {pagination.from || 0} to{" "}
                              {pagination.to || 0} of {pagination.total} results
                            </div>

                            <div className="flex items-center space-x-2">
                              <motion.button
                                onClick={() =>
                                  setCurrentPage(Math.max(1, currentPage - 1))
                                }
                                disabled={currentPage <= 1}
                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ChevronLeft className="w-4 h-4" />
                              </motion.button>

                              <span className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400">
                                Page {currentPage} of {pagination.last_page}
                              </span>

                              <motion.button
                                onClick={() =>
                                  setCurrentPage(
                                    Math.min(
                                      pagination.last_page,
                                      currentPage + 1
                                    )
                                  )
                                }
                                disabled={currentPage >= pagination.last_page}
                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Add Contact Tab */}
            {activeTab === "add" && (
              <motion.div
                key="add"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl space-y-6"
              >
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  Add New Contact
                </h2>

                <div className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={newContact.email}
                        onChange={(e) =>
                          setNewContact({
                            ...newContact,
                            email: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                        style={
                          {
                            "--tw-ring-color": `${brand.colors.primary}50`,
                          } as React.CSSProperties
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Full Name (Optional)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={newContact.name}
                        onChange={(e) =>
                          setNewContact({ ...newContact, name: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                        style={
                          {
                            "--tw-ring-color": `${brand.colors.primary}50`,
                          } as React.CSSProperties
                        }
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>

                  {/* Groups */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Groups
                    </label>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {availableGroups.map((group) => (
                          <motion.button
                            key={group.name}
                            onClick={() => {
                              setNewContact((prev) => ({
                                ...prev,
                                groups: prev.groups.includes(group.name)
                                  ? prev.groups.filter((g) => g !== group.name)
                                  : [...prev.groups, group.name],
                              }));
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              newContact.groups.includes(group.name)
                                ? "text-white shadow-lg"
                                : "text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                            style={{
                              backgroundColor: newContact.groups.includes(
                                group.name
                              )
                                ? group.color || brand.colors.primary
                                : "transparent",
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Tag className="w-4 h-4 inline mr-1" />
                            {group.name}
                          </motion.button>
                        ))}
                      </div>

                      {/* Add new group */}
                      {showNewGroupInput ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="Group name"
                            className="flex-1 px-3 py-2 bg-white/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 text-sm"
                            style={
                              {
                                "--tw-ring-color": `${brand.colors.primary}50`,
                              } as React.CSSProperties
                            }
                          />
                          <motion.button
                            onClick={handleCreateGroup}
                            disabled={createGroupMutation.isPending}
                            className="p-2 rounded-lg text-white disabled:opacity-50"
                            style={{ backgroundColor: brand.colors.accent }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.button>
                          <button
                            onClick={() => {
                              setShowNewGroupInput(false);
                              setNewGroupName("");
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowNewGroupInput(true)}
                          className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        >
                          + Add new group
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleAddContact}
                  disabled={
                    !newContact.email || createContactMutation.isPending
                  }
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: brand.colors.primary,
                    boxShadow: `0 4px 12px ${brand.colors.primary}25`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {createContactMutation.isPending ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    <UserPlus className="w-5 h-5" />
                  )}
                  <span>
                    {createContactMutation.isPending
                      ? "Adding..."
                      : "Add Contact"}
                  </span>
                </motion.button>
              </motion.div>
            )}

            {/* Import CSV Tab */}
            {activeTab === "import" && (
              <motion.div
                key="import"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {!showCsvPreview ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                        Import Contacts from CSV
                      </h2>

                      <motion.button
                        onClick={downloadTemplate}
                        className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Download className="w-4 h-4" />
                        <span>Download Template</span>
                      </motion.button>
                    </div>

                    {/* Upload area */}
                    <div
                      className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                        Upload CSV File
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Click to browse or drag and drop your CSV file here
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        CSV should have columns: email, name (optional), groups
                        (optional)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Format info */}
                    <div className="bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                            CSV Format Requirements
                          </h4>
                          <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                            <li>• First row should contain column headers</li>
                            <li>• Required column: "email"</li>
                            <li>• Optional columns: "name", "groups"</li>
                            <li>
                              • Groups should be separated by semicolons (;)
                            </li>
                            <li>• Each email address should be unique</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                        Preview & Import
                      </h2>
                      <button
                        onClick={() => {
                          setShowCsvPreview(false);
                          setCsvData([]);
                          setCsvImportGroups([]);
                        }}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Group Selection for Import */}
                    <div className="bg-slate-50/50 dark:bg-slate-700/50 rounded-xl p-4">
                      <h3 className="font-medium text-slate-800 dark:text-slate-200 mb-3">
                        Add to Groups (applies to all contacts)
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {availableGroups.map((group) => (
                          <motion.button
                            key={group.name}
                            onClick={() => {
                              setCsvImportGroups((prev) =>
                                prev.includes(group.name)
                                  ? prev.filter((g) => g !== group.name)
                                  : [...prev, group.name]
                              );
                            }}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              csvImportGroups.includes(group.name)
                                ? "text-white shadow-lg"
                                : "text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                            }`}
                            style={{
                              backgroundColor: csvImportGroups.includes(
                                group.name
                              )
                                ? group.color || brand.colors.primary
                                : "transparent",
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Tag className="w-4 h-4 inline mr-1" />
                            {group.name}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* CSV Preview */}
                    <div className="bg-slate-50/50 dark:bg-slate-700/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">
                              {csvData.length} contacts found
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {csvData.filter((c) => c.isValid).length} valid
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {csvData.filter((c) => !c.isValid).length} invalid
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {csvData.map((contact, index) => (
                          <div
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              contact.isValid
                                ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600"
                                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                            }`}
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  contact.isValid
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              <div className="flex-1">
                                <div className="font-medium text-slate-800 dark:text-slate-200">
                                  {contact.email}
                                </div>
                                {contact.name && (
                                  <div className="text-sm text-slate-600 dark:text-slate-400">
                                    {contact.name}
                                  </div>
                                )}
                                {contact.groups &&
                                  contact.groups.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {contact.groups.map(
                                        (group, groupIndex) => (
                                          <span
                                            key={groupIndex}
                                            className="px-2 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                                          >
                                            {group}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  )}
                                {contact.error && (
                                  <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                                    {contact.error}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => removeCsvContact(index)}
                              className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <motion.button
                        onClick={handleCsvImport}
                        disabled={
                          csvData.filter((c) => c.isValid).length === 0 ||
                          importCsvMutation.isPending
                        }
                        className="flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: brand.colors.primary,
                          boxShadow: `0 4px 12px ${brand.colors.primary}25`,
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {importCsvMutation.isPending ? (
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          />
                        ) : (
                          <Save className="w-5 h-5" />
                        )}
                        <span>
                          {importCsvMutation.isPending
                            ? "Importing..."
                            : `Import ${csvData.filter((c) => c.isValid).length} Contacts`}
                        </span>
                      </motion.button>

                      <button
                        onClick={() => {
                          setShowCsvPreview(false);
                          setCsvData([]);
                          setCsvImportGroups([]);
                        }}
                        className="px-4 py-3 rounded-xl font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
