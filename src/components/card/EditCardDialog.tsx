import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestCard } from "@/lib/api/card-api";
import type { ICard } from "@/screens/cards";

interface EditCardDialogProps {
  card: ICard;
}

const EditCardDialog: React.FC<EditCardDialogProps> = ({ card }) => {
  const [open, setOpen] = useState(false);
  const [cardType, setCardType] = useState(card.card_type);
  const [phone, setPhone] = useState(card.phone);

  const { UPDATE_CARD } = requestCard();
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: ({ cardId, payload }: { cardId: string; payload: any }) =>
      UPDATE_CARD(cardId, payload),
    onSuccess: () => {
      toast.success("Card updated successfully");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to update card");
    },
  });

  const handleSave = () => {
    updateMutation.mutate({
      cardId: card.id,
      payload: {
        card_type: cardType,
        phone,
      },
    });
  };

  return (
    <>
      <Button
        variant="ghost"
        className="w-full justify-start text-yellow-600"
        onClick={() => setOpen(true)}
      >
        <Pen className="w-4 h-4 mr-2" /> Edit
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Card</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="cardType" className="text-sm font-medium">
                Card Type
              </label>
              <Input
                id="cardType"
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone
              </label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button onClick={handleSave} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditCardDialog;
