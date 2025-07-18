import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { requestCard } from "@/lib/api/card-api";

interface DeleteCardDialogProps {
  cardId: string;
}

const DeleteCardDialog: React.FC<DeleteCardDialogProps> = ({ cardId }) => {
  const [open, setOpen] = useState(false);
  const { DELETE_CARD } = requestCard();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => DELETE_CARD(cardId),
    onSuccess: () => {
      toast.success("Card deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to delete card");
    },
  });

  return (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start text-red-600"
        onClick={() => setOpen(true)}
      >
        <Trash className="w-4 h-4 mr-2" /> Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this card? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteCardDialog;
