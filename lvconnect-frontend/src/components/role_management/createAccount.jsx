import api from "@/services/axios";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const AccountForm = ({
    fetchData,
    closeModal,
    availableRoles = [],
    mode = "create",
    initialData = null,
}) => {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        roles: [],
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mode === "edit" && initialData) {
            setForm({
                name: initialData.name,
                roles: initialData.roles || [],
            });
        }
    }, [mode, initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === "roles") {
            setForm((prev) => {
                const newRoles = checked
                    ? [...prev.roles, value]
                    : prev.roles.filter((r) => r !== value);
                return { ...prev, roles: newRoles };
            });
        } else {
            setForm((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.roles.length === 0) {
            toast.error("At least one role must be selected.");
            return;
        }
        setLoading(true);
        try {
            if (mode === "create") {
                await api.post("/system-admin/create-user", form);
                toast.success("Account created successfully!");
            } else {
                await api.put(`/system-admin/update-role/${initialData.id}`, {
                    roles: form.roles,
                });
                toast.success("Roles updated successfully!");
            }

            await fetchData();
            closeModal();
        } catch (err) {
            console.error(err);
            if (err.response?.data?.errors) {
                toast.error("Validation failed. Check console.");
            } else {
                toast.error("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-4 p-4 bg-white shadow rounded"
        >
            {/* <h2 className="text-lg font-semibold">
                {mode === "create" ? "Create New User" : "Edit Roles"}
            </h2> */}

            {mode === "create" && (
                <div>
                    <div>
                        <label className="block text-sm font-medium">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={form.first_name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded border px-3 py-2 bg-gray-100"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={form.last_name}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded border px-3 py-2 bg-gray-100"
                        />
                    </div>
                </div>
            )}

            {mode === "edit" && (
                <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        disabled
                        className="mt-1 block w-full rounded border px-3 py-2 bg-gray-100"
                    />
                </div>

            )}

            <div>
                <label className="block text-sm font-medium mb-1">Roles</label>
                <div className="flex flex-wrap gap-4">
                    {availableRoles
                        .filter(role => !["student", "superadmin"].includes(role))
                        .map((role) => (
                            <label key={role} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="roles"
                                    value={role}
                                    checked={form.roles.includes(role)}
                                    onChange={handleChange}
                                    className="m-auto"
                                />
                                {role}
                            </label>
                        ))}
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading
                        ? mode === "create"
                            ? "Creating..."
                            : "Saving..."
                        : mode === "create"
                            ? "Create Account"
                            : "Save Changes"}
                </button>
            </div>
        </form>
    );
};

export default AccountForm;

