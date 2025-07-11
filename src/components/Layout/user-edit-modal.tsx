import React, { useEffect, useState } from "react";
import { useUserEditModal } from "@/store/user-edit-modal-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestUser } from "@/lib/api/user-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const { UPDATE_USER_DETAIL } = requestUser();

interface FormState {
  full_name: string;
  user_name: string;
  email: string;
}

const EditUserModal = () => {
  const { isOpen, user, closeModal } = useUserEditModal();
  const [form, setForm] = useState<FormState>({
    full_name: "",
    user_name: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { mutate: updateUser, isLoading } = useMutation({
    mutationFn: (formData: FormState) => UPDATE_USER_DETAIL(user?.id!, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      closeModal();
    },
    onError: (err: any) => {
      setError(err?.message || "Failed to update user");
    },
  });

  useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name,
        user_name: user.user_name,
        email: user.email,
      });
      setError(null);
    } else {
      setForm({ full_name: "", user_name: "", email: "" });
      setError(null);
    }
  }, [user]);

  
  const isFormValid =
    form.full_name.trim() !== "" &&
    form.user_name.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

  
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!isFormValid || isLoading) return;
    updateUser(form);
  };

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal} aria-label="Edit User Modal">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Input
            placeholder="Full Name"
            aria-label="Full Name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />
          <Input
            placeholder="Username"
            aria-label="Username"
            value={form.user_name}
            onChange={(e) => setForm({ ...form, user_name: e.target.value })}
            required
          />
          <Input
            placeholder="Email"
            aria-label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" type="button" onClick={closeModal}>
              Cancel
            </Button>
            <Button disabled={!isFormValid || isLoading} type="submit">
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
