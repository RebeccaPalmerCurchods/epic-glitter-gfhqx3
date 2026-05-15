import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  Bell,
  X,
  Check,
  Calendar,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

export default function PremiumPropertyDashboard() {
  const [properties, setProperties] = useState([]);
  const [adminFilter, setAdminFilter] = useState("all");
  const [expandedProperty, setExpandedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [admins] = useState(["All Admins", "Sarah", "Marcus", "Emma", "David"]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const coreItems = [
    { id: "agency", label: "Agency agreement" },
    { id: "cpr", label: "CPR form" },
    { id: "aml", label: "AML" },
    { id: "photography", label: "Photography" },
    { id: "floorplan", label: "Floor plan" },
    { id: "epc", label: "EPC" },
    { id: "brochure", label: "Brochure" },
  ];

  const mockProperties = [
    {
      id: "P001",
      address: "10 Oak Lane, London",
      agent: "John Smith",
      assignedAdmin: "Sarah",
      owners: 3,
      price: "£495,000",
      dateAdded: "2025-05-12",
      dueDate: "2025-05-19",
      checklist: {
        agency: { status: "approved", approvedBy: "Sarah", date: "2025-05-12" },
        cpr: { status: "approved", approvedBy: "Sarah", date: "2025-05-12" },
        aml: { status: "pending", approvedBy: null, date: null },
        photography: {
          status: "approved",
          approvedBy: "Sarah",
          date: "2025-05-13",
        },
        floorplan: { status: "overdue", approvedBy: null, date: null },
        epc: { status: "pending", approvedBy: null, date: null },
        brochure: {
          status: "approved",
          approvedBy: "Marcus",
          date: "2025-05-13",
        },
      },
      owners: [
        {
          name: "John Wilson",
          status: "pending",
          approvedBy: null,
          date: null,
        },
        {
          name: "Jane Wilson",
          status: "approved",
          approvedBy: "Self",
          date: "2025-05-13",
        },
        {
          name: "Robert Wilson",
          status: "pending",
          approvedBy: null,
          date: null,
        },
      ],
    },
    {
      id: "P002",
      address: "42 Riverside Road, London",
      agent: "Emma Johnson",
      assignedAdmin: "Marcus",
      owners: 2,
      price: "£325,000",
      dateAdded: "2025-05-14",
      dueDate: "2025-05-21",
      checklist: {
        agency: { status: "pending", approvedBy: null, date: null },
        cpr: { status: "pending", approvedBy: null, date: null },
        aml: { status: "pending", approvedBy: null, date: null },
        photography: { status: "pending", approvedBy: null, date: null },
        floorplan: { status: "pending", approvedBy: null, date: null },
        epc: { status: "pending", approvedBy: null, date: null },
        brochure: { status: "pending", approvedBy: null, date: null },
      },
      owners: [
        {
          name: "Michael Brown",
          status: "pending",
          approvedBy: null,
          date: null,
        },
        {
          name: "Sarah Brown",
          status: "pending",
          approvedBy: null,
          date: null,
        },
      ],
    },
    {
      id: "P003",
      address: "7 The Crescent, London",
      agent: "David Lee",
      assignedAdmin: "Emma",
      owners: 1,
      price: "£650,000",
      dateAdded: "2025-05-10",
      dueDate: "2025-05-18",
      checklist: {
        agency: { status: "approved", approvedBy: "Emma", date: "2025-05-11" },
        cpr: { status: "approved", approvedBy: "Emma", date: "2025-05-11" },
        aml: { status: "approved", approvedBy: "David", date: "2025-05-12" },
        photography: {
          status: "approved",
          approvedBy: "Emma",
          date: "2025-05-12",
        },
        floorplan: {
          status: "approved",
          approvedBy: "Emma",
          date: "2025-05-13",
        },
        epc: { status: "approved", approvedBy: "Emma", date: "2025-05-13" },
        brochure: { status: "pending", approvedBy: null, date: null },
      },
      owners: [
        {
          name: "Catherine Moore",
          status: "approved",
          approvedBy: "Self",
          date: "2025-05-14",
        },
      ],
    },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProperties(mockProperties);
      setLastSync(new Date().toLocaleTimeString());
      setLoading(false);
      addNotification(
        "Sync completed",
        "3 properties synced from Reapit",
        "sync"
      );
      addNotification(
        "Overdue items",
        "1 property has items overdue",
        "warning"
      );
      addNotification(
        "All owners signed",
        "7 The Crescent - ready to go live",
        "approved"
      );
    }, 600);
  }, []);

  const addNotification = (title, message, type = "info") => {
    const notification = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [notification, ...prev]);
    setUnreadCount((prev) => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredProperties =
    adminFilter === "all"
      ? properties
      : properties.filter((p) => p.assignedAdmin === adminFilter);

  const getCompletion = (prop) => {
    const allItems = [
      ...coreItems.map((c) => prop.checklist[c.id]),
      ...prop.owners.map((o) => ({ status: o.status })),
    ];
    const approved = allItems.filter((i) => i.status === "approved").length;
    return Math.round((approved / allItems.length) * 100);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return {
          bg: "rgba(76, 175, 80, 0.08)",
          border: "#4CAF50",
          text: "#2E7D32",
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
      case "pending":
        return {
          bg: "rgba(0, 38, 62, 0.08)",
          border: "#00263e",
          text: "#00263e",
          icon: <Clock className="w-4 h-4" />,
        };
      case "overdue":
        return {
          bg: "rgba(244, 67, 54, 0.08)",
          border: "#F44336",
          text: "#C62828",
          icon: <AlertTriangle className="w-4 h-4" />,
        };
      default:
        return {
          bg: "rgba(150, 150, 150, 0.08)",
          border: "#999",
          text: "#666",
          icon: null,
        };
    }
  };

  const getNotificationStyle = (type) => {
    switch (type) {
      case "approved":
        return { icon: <CheckCircle2 className="w-4 h-4" />, color: "#4CAF50" };
      case "warning":
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          color: "#FF9800",
        };
      case "sync":
        return { icon: <RefreshCw className="w-4 h-4" />, color: "#00263e" };
      case "error":
        return { icon: <AlertCircle className="w-4 h-4" />, color: "#F44336" };
      default:
        return { icon: <Clock className="w-4 h-4" />, color: "#00263e" };
    }
  };

  const handleApprove = (propertyId, itemId) => {
    addNotification(
      "Approval confirmed",
      `${itemId} approved successfully`,
      "approved"
    );
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          return {
            ...p,
            checklist: {
              ...p.checklist,
              [itemId]: {
                status: "approved",
                approvedBy: "You",
                date: new Date().toISOString().split("T")[0],
              },
            },
          };
        }
        return p;
      })
    );
  };

  // Calendar helpers
  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const days = [];
  const firstDay = getFirstDayOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const monthName = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Stats
  const totalProperties = filteredProperties.length;
  const completedProperties = filteredProperties.filter(
    (p) => getCompletion(p) === 100
  ).length;
  const overdueItems = filteredProperties.reduce((acc, p) => {
    return (
      acc +
      Object.values(p.checklist).filter((c) => c.status === "overdue").length
    );
  }, 0);
  const avgCompletion =
    totalProperties > 0
      ? Math.round(
          filteredProperties.reduce((sum, p) => sum + getCompletion(p), 0) /
            totalProperties
        )
      : 0;

  return (
    <div
      style={{ backgroundColor: "#f2e9db", minHeight: "100vh" }}
      className="flex flex-col"
    >
      {/* Header */}
      <header
        className="border-b sticky top-0 z-20 shadow-sm"
        style={{
          borderColor: "#e0d5c7",
          backgroundColor: "rgba(242, 233, 219, 0.99)",
        }}
      >
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1
                className="text-4xl font-bold mb-1"
                style={{ color: "#00263e" }}
              >
                Property Hub
              </h1>
              <p className="text-sm" style={{ color: "#999" }}>
                Real-time approval workflow
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLastSync(new Date().toLocaleTimeString());
                    setLoading(false);
                    addNotification(
                      "Sync completed",
                      "All properties synced",
                      "sync"
                    );
                  }, 800);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all"
                style={{ backgroundColor: "#00263e", color: "#f2e9db" }}
              >
                <RefreshCw
                  className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                />
                Sync
              </button>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg transition-all"
                  style={{ backgroundColor: "#00263e", color: "#f2e9db" }}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div
                    className="absolute right-0 top-full mt-2 w-80 rounded-lg shadow-2xl overflow-hidden z-50"
                    style={{
                      backgroundColor: "#fff",
                      border: "0.5px solid #e0d5c7",
                    }}
                  >
                    <div
                      className="px-4 py-3 border-b flex items-center justify-between"
                      style={{
                        borderColor: "#e0d5c7",
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      <h3
                        className="font-semibold text-sm"
                        style={{ color: "#00263e" }}
                      >
                        Notifications
                      </h3>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-xs font-medium px-2 py-1 rounded"
                            style={{
                              backgroundColor: "#f2e9db",
                              color: "#00263e",
                            }}
                          >
                            Mark read
                          </button>
                        )}
                        <button onClick={() => setShowNotifications(false)}>
                          <X className="w-4 h-4" style={{ color: "#666" }} />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div
                          className="px-4 py-6 text-center text-sm"
                          style={{ color: "#999" }}
                        >
                          No notifications
                        </div>
                      ) : (
                        notifications.map((notif) => {
                          const style = getNotificationStyle(notif.type);
                          return (
                            <div
                              key={notif.id}
                              className="border-b px-4 py-3 last:border-b-0"
                              style={{
                                borderColor: "#e0d5c7",
                                backgroundColor: !notif.read
                                  ? "rgba(0, 38, 62, 0.02)"
                                  : "transparent",
                              }}
                            >
                              <div className="flex items-start gap-2">
                                <div style={{ color: style.color }}>
                                  {style.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className="text-sm font-medium"
                                    style={{ color: "#00263e" }}
                                  >
                                    {notif.title}
                                  </p>
                                  <p
                                    className="text-xs mt-1"
                                    style={{ color: "#999" }}
                                  >
                                    {notif.message}
                                  </p>
                                  <p
                                    className="text-xs mt-1"
                                    style={{ color: "#ccc" }}
                                  >
                                    {notif.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                                <button
                                  onClick={() => deleteNotification(notif.id)}
                                  className="p-1 rounded hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
                                >
                                  <X
                                    className="w-3 h-3"
                                    style={{ color: "#999" }}
                                  />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filter & Last Sync */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4" style={{ color: "#999" }} />
              <select
                value={adminFilter}
                onChange={(e) => setAdminFilter(e.target.value.toLowerCase())}
                className="px-4 py-2 rounded-lg border text-sm font-medium"
                style={{
                  backgroundColor: "#fff",
                  borderColor: "#e0d5c7",
                  color: "#00263e",
                }}
              >
                {admins.map((admin) => (
                  <option key={admin} value={admin}>
                    {admin}
                  </option>
                ))}
              </select>
            </div>
            <p className="text-xs" style={{ color: "#999" }}>
              Last sync:{" "}
              <span style={{ color: "#00263e", fontWeight: "600" }}>
                {lastSync || "Never"}
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "#fff", borderColor: "#e0d5c7" }}
          >
            <p
              className="text-xs font-medium"
              style={{ color: "#999", marginBottom: "8px" }}
            >
              Total Properties
            </p>
            <p className="text-3xl font-bold" style={{ color: "#00263e" }}>
              {totalProperties}
            </p>
            <p className="text-xs mt-2" style={{ color: "#999" }}>
              active in workflow
            </p>
          </div>

          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "#fff", borderColor: "#e0d5c7" }}
          >
            <p
              className="text-xs font-medium"
              style={{ color: "#999", marginBottom: "8px" }}
            >
              Completion Rate
            </p>
            <p className="text-3xl font-bold" style={{ color: "#4CAF50" }}>
              {avgCompletion}%
            </p>
            <p className="text-xs mt-2" style={{ color: "#999" }}>
              {completedProperties} fully complete
            </p>
          </div>

          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "#fff", borderColor: "#e0d5c7" }}
          >
            <p
              className="text-xs font-medium"
              style={{ color: "#999", marginBottom: "8px" }}
            >
              Overdue Items
            </p>
            <p
              className="text-3xl font-bold"
              style={{ color: overdueItems > 0 ? "#F44336" : "#4CAF50" }}
            >
              {overdueItems}
            </p>
            <p className="text-xs mt-2" style={{ color: "#999" }}>
              requiring attention
            </p>
          </div>
        </div>

        {/* Calendar & Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Mini Calendar */}
          <div
            className="rounded-lg border p-6"
            style={{ backgroundColor: "#fff", borderColor: "#e0d5c7" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="font-semibold text-sm"
                style={{ color: "#00263e" }}
              >
                May 2025
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1
                      )
                    )
                  }
                  className="px-2 py-1 rounded text-xs"
                  style={{ backgroundColor: "#f2e9db", color: "#00263e" }}
                >
                  ←
                </button>
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1
                      )
                    )
                  }
                  className="px-2 py-1 rounded text-xs"
                  style={{ backgroundColor: "#f2e9db", color: "#00263e" }}
                >
                  →
                </button>
              </div>
            </div>

            <div
              className="grid grid-cols-7 gap-2 text-center text-xs mb-2"
              style={{ color: "#999" }}
            >
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                <div key={day} className="font-medium">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {days.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => day && setSelectedDate(day)}
                  className="py-2 rounded transition-all"
                  style={{
                    backgroundColor:
                      day === selectedDate
                        ? "#00263e"
                        : day
                        ? "#f2e9db"
                        : "transparent",
                    color:
                      day === selectedDate
                        ? "#f2e9db"
                        : day
                        ? "#00263e"
                        : "#ccc",
                    fontSize: "12px",
                    fontWeight: day === selectedDate ? "600" : "400",
                  }}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Activity Feed */}
            <div
              className="mt-6 pt-6 border-t"
              style={{ borderColor: "#e0d5c7" }}
            >
              <h4
                className="text-xs font-semibold mb-3"
                style={{ color: "#00263e" }}
              >
                Recent Activity
              </h4>
              <div className="space-y-2 text-xs">
                <div style={{ color: "#999" }}>
                  <p style={{ marginBottom: "2px" }}>
                    ✓ Agency agreement approved
                  </p>
                  <p style={{ color: "#ccc", fontSize: "11px" }}>5 mins ago</p>
                </div>
                <div style={{ color: "#999" }}>
                  <p style={{ marginBottom: "2px" }}>✓ All owners signed</p>
                  <p style={{ color: "#ccc", fontSize: "11px" }}>1 hour ago</p>
                </div>
                <div style={{ color: "#999" }}>
                  <p style={{ marginBottom: "2px" }}>⚠ Floor plan overdue</p>
                  <p style={{ color: "#ccc", fontSize: "11px" }}>2 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Properties List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              {filteredProperties.length === 0 ? (
                <div
                  className="text-center py-12 rounded-lg border"
                  style={{ backgroundColor: "#fff", borderColor: "#e0d5c7" }}
                >
                  <p style={{ color: "#999" }}>No properties assigned</p>
                </div>
              ) : (
                filteredProperties.map((property) => {
                  const completion = getCompletion(property);
                  const isExpanded = expandedProperty === property.id;

                  return (
                    <div
                      key={property.id}
                      className="border rounded-lg overflow-hidden transition-all"
                      style={{
                        backgroundColor: "#fff",
                        borderColor: "#e0d5c7",
                      }}
                    >
                      {/* Property Header */}
                      <button
                        onClick={() =>
                          setExpandedProperty(isExpanded ? null : property.id)
                        }
                        className="w-full px-6 py-5 flex items-center justify-between transition-colors"
                        style={{ ":hover": { backgroundColor: "#fafaf8" } }}
                      >
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-3 mb-2">
                            <h2
                              className="text-lg font-semibold"
                              style={{ color: "#00263e" }}
                            >
                              {property.address}
                            </h2>
                            <span
                              className="px-3 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor: "#f2e9db",
                                color: "#00263e",
                              }}
                            >
                              {property.owners.length} owner
                              {property.owners.length !== 1 ? "s" : ""}
                            </span>
                            {completion === 100 && (
                              <span
                                className="px-3 py-1 rounded text-xs font-medium"
                                style={{
                                  backgroundColor: "rgba(76, 175, 80, 0.1)",
                                  color: "#2E7D32",
                                }}
                              >
                                Complete
                              </span>
                            )}
                          </div>
                          <p className="text-sm" style={{ color: "#999" }}>
                            {property.agent} • {property.price} • Due:{" "}
                            {property.dueDate}
                          </p>
                        </div>

                        {/* Completion Ring */}
                        <div className="flex items-center gap-6 ml-6 flex-shrink-0">
                          <div className="relative w-14 h-14">
                            <svg
                              className="w-full h-full transform -rotate-90"
                              viewBox="0 0 100 100"
                            >
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                style={{ color: "#e0d5c7" }}
                              />
                              <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray={`${completion * 2.83} 283`}
                                style={{
                                  color: "#00263e",
                                  transition: "all 0.5s",
                                }}
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span
                                className="text-xs font-bold"
                                style={{ color: "#00263e" }}
                              >
                                {completion}%
                              </span>
                            </div>
                          </div>
                          <ChevronDown
                            className={`w-5 h-5 transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            style={{ color: "#999" }}
                          />
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div
                          className="border-t px-6 py-6"
                          style={{
                            borderColor: "#e0d5c7",
                            backgroundColor: "#fafaf8",
                          }}
                        >
                          {/* Core Checklist */}
                          <div className="mb-8">
                            <h3
                              className="text-sm font-semibold mb-4"
                              style={{ color: "#00263e" }}
                            >
                              Core Requirements
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {coreItems.map((item) => {
                                const itemStatus = property.checklist[item.id];
                                const style = getStatusStyle(itemStatus.status);

                                return (
                                  <div
                                    key={item.id}
                                    className="border rounded p-3 flex items-center justify-between"
                                    style={{
                                      backgroundColor: style.bg,
                                      borderColor: style.border,
                                    }}
                                  >
                                    <div className="flex items-center gap-2 flex-1">
                                      <div style={{ color: style.text }}>
                                        {style.icon}
                                      </div>
                                      <div className="min-w-0">
                                        <p
                                          className="text-sm font-medium"
                                          style={{ color: "#00263e" }}
                                        >
                                          {item.label}
                                        </p>
                                        {itemStatus.approvedBy && (
                                          <p
                                            className="text-xs"
                                            style={{ color: "#999" }}
                                          >
                                            {itemStatus.approvedBy} on{" "}
                                            {itemStatus.date}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    {itemStatus.status !== "approved" && (
                                      <button
                                        onClick={() =>
                                          handleApprove(property.id, item.id)
                                        }
                                        className="px-3 py-1 rounded text-xs font-medium flex-shrink-0 ml-2 transition-all"
                                        style={{
                                          backgroundColor: "#00263e",
                                          color: "#f2e9db",
                                        }}
                                      >
                                        Approve
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Owner Sign-offs */}
                          <div>
                            <h3
                              className="text-sm font-semibold mb-4"
                              style={{ color: "#00263e" }}
                            >
                              Owner Sign-offs ({property.owners.length})
                            </h3>
                            <div className="space-y-3">
                              {property.owners.map((owner, idx) => {
                                const style = getStatusStyle(owner.status);
                                return (
                                  <div
                                    key={idx}
                                    className="border rounded p-4 flex items-center justify-between"
                                    style={{
                                      backgroundColor: style.bg,
                                      borderColor: style.border,
                                    }}
                                  >
                                    <div className="flex items-center gap-3 flex-1">
                                      <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                        style={{
                                          backgroundColor: "#00263e",
                                          color: "#f2e9db",
                                        }}
                                      >
                                        {owner.name.charAt(0)}
                                      </div>
                                      <div className="min-w-0">
                                        <p
                                          className="text-sm font-medium"
                                          style={{ color: "#00263e" }}
                                        >
                                          {owner.name}
                                        </p>
                                        {owner.approvedBy && (
                                          <p
                                            className="text-xs"
                                            style={{ color: "#999" }}
                                          >
                                            {owner.approvedBy} • {owner.date}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <div style={{ color: style.text }}>
                                        {style.icon}
                                      </div>
                                      {owner.status !== "approved" && (
                                        <button
                                          className="px-3 py-1 rounded text-xs font-medium transition-all"
                                          style={{
                                            backgroundColor: "#00263e",
                                            color: "#f2e9db",
                                          }}
                                        >
                                          Approve
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
